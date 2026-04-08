import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { discount, discountUsageEvent, orderDiscount, shippingMethod } from "@/core/db/db.schema";

/** Drizzle DB or transaction handle (same query API). */
export type PricingDb = typeof import("@/core/db/db").db;

export type CartLinePricingInput = {
  variantId: string;
  quantity: number;
  unitPrice: number;
  variantTaxClassId: string | null;
  productTaxClassId: string | null;
};

export type ShippingAddressPricingInput = {
  country: string;
  state: string;
  city?: string;
  postalCode?: string;
};

export type ComputeCheckoutTotalsInput = {
  lines: CartLinePricingInput[];
  shippingAddress: ShippingAddressPricingInput;
  shippingProviderId: string;
  shippingMethodId: string;
  discountCode?: string | null;
  userId: string;
  /** When true, do not mutate discount usage counters */
  preview: boolean;
};

export type AppliedDiscountPreview = {
  id: string;
  discountId: string;
  appliedAmount: number;
};

export type CheckoutTotalsComputed = {
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  shippingZoneId: string;
  appliedDiscount: AppliedDiscountPreview | null;
};

export type CheckoutTotalsError = { ok: false; message: string };
export type CheckoutTotalsSuccess = { ok: true; data: CheckoutTotalsComputed };
export type CheckoutTotalsResult = CheckoutTotalsError | CheckoutTotalsSuccess;

/**
 * Resolves shipping method, zone, and flat rate for an address (same rules as order.create).
 */
export async function resolveShippingForCheckout(
  dbLike: PricingDb,
  input: {
    shippingAddress: ShippingAddressPricingInput;
    shippingProviderId: string;
    shippingMethodId: string;
  },
): Promise<{ shippingTotal: number; shippingZoneId: string } | { error: string }> {
  const methodRow = await dbLike.query.shippingMethod.findFirst({
    where: eq(shippingMethod.id, input.shippingMethodId),
    with: {
      provider: true,
      rates: {
        with: {
          zone: true,
        },
      },
    },
  });

  if (!methodRow || !methodRow.isActive) {
    return { error: "Selected delivery method is not available" };
  }

  if (!methodRow.provider || !methodRow.provider.isActive || methodRow.provider.id !== input.shippingProviderId) {
    return { error: "Selected delivery provider is not available" };
  }

  const normalizedCountry = input.shippingAddress.country.toUpperCase();
  const normalizedRegion = input.shippingAddress.state.toUpperCase();

  const matchingRate =
    methodRow.rates.find(
      (rate) =>
        rate.isActive &&
        rate.zone.countryCode.toUpperCase() === normalizedCountry &&
        (rate.zone.regionCode?.toUpperCase() === normalizedRegion || rate.zone.regionCode === null),
    ) ?? null;

  if (!matchingRate) {
    return { error: "No delivery rate is configured for the selected address and method" };
  }

  return { shippingTotal: matchingRate.price, shippingZoneId: matchingRate.zoneId };
}

/**
 * Read-only discount amount for preview / parity with order.create.
 */
async function computeDiscountTotal(
  dbLike: PricingDb,
  subtotal: number,
  discountCode: string | null | undefined,
): Promise<{ discountTotal: number; discountRowId: string | null }> {
  if (!discountCode?.trim()) {
    return { discountTotal: 0, discountRowId: null };
  }

  const now = new Date();
  const discountRow = await dbLike.query.discount.findFirst({
    where: (d, { and: andLocal, eq: eqLocal }) =>
      andLocal(eqLocal(d.code, discountCode.trim()), eqLocal(d.isActive, true)),
  });

  if (!discountRow || (discountRow.expiresAt && discountRow.expiresAt <= now)) {
    return { discountTotal: 0, discountRowId: null };
  }

  const minOrderAmount = discountRow.minOrderAmount ?? 0;
  const maxUses = discountRow.maxUses ?? null;
  const usedCount = discountRow.usedCount ?? 0;

  if (subtotal < minOrderAmount || (maxUses != null && usedCount >= maxUses)) {
    return { discountTotal: 0, discountRowId: null };
  }

  let discountTotal = 0;
  if (discountRow.type === "percent") {
    const basisPoints = discountRow.value;
    discountTotal = Math.floor((subtotal * basisPoints) / 10000);
  } else if (discountRow.type === "flat") {
    discountTotal = Math.min(discountRow.value, subtotal);
  }

  if (discountTotal <= 0) {
    return { discountTotal: 0, discountRowId: null };
  }

  return { discountTotal, discountRowId: discountRow.id };
}

async function getDefaultTaxClassId(dbLike: PricingDb): Promise<string | null> {
  const row = await dbLike.query.taxClass.findFirst({
    where: (tc, { eq: eqTc }) => eqTc(tc.isDefault, true),
  });
  return row?.id ?? null;
}

/**
 * Pick the best matching tax zone for an address (country + optional region), by specificity then priority.
 */
async function resolveTaxZoneForAddress(
  dbLike: PricingDb,
  address: ShippingAddressPricingInput,
): Promise<{ id: string } | null> {
  const c = address.country.toUpperCase();
  const r = address.state.toUpperCase();

  const zones = await dbLike.query.taxZone.findMany({
    where: (z, { eq: eqZ, and: andZ }) => andZ(eqZ(z.countryCode, c), eqZ(z.isActive, true)),
  });

  const matching = zones.filter((z) => !z.regionCode || z.regionCode.toUpperCase() === r);

  if (matching.length === 0) return null;

  matching.sort((a, b) => {
    const aSpec = a.regionCode ? 1 : 0;
    const bSpec = b.regionCode ? 1 : 0;
    if (aSpec !== bSpec) return bSpec - aSpec;
    return b.priority - a.priority;
  });

  const first = matching[0];
  return first ? { id: first.id } : null;
}

async function effectiveTaxRateForClass(
  dbLike: PricingDb,
  zoneId: string,
  taxClassId: string,
  at: Date,
): Promise<number> {
  const rules = await dbLike.query.taxRule.findMany({
    where: (rule, { and: andR, eq: eqR }) =>
      andR(eqR(rule.zoneId, zoneId), eqR(rule.taxClassId, taxClassId), eqR(rule.isActive, true)),
  });

  const active = rules.filter((rule) => {
    if (rule.effectiveFrom > at) return false;
    if (rule.effectiveTo && rule.effectiveTo <= at) return false;
    return true;
  });

  active.sort((a, b) => b.priority - a.priority);
  const chosen = active[0];
  if (!chosen) return 0;
  return Number(chosen.rate);
}

async function shippingTaxRate(dbLike: PricingDb, zoneId: string, at: Date): Promise<number> {
  const rules = await dbLike.query.taxRule.findMany({
    where: (rule, { and: andR, eq: eqR }) => andR(eqR(rule.zoneId, zoneId), eqR(rule.isActive, true)),
  });

  const active = rules.filter((rule) => {
    if (!rule.appliesToShipping) return false;
    if (rule.effectiveFrom > at) return false;
    if (rule.effectiveTo && rule.effectiveTo <= at) return false;
    return true;
  });

  active.sort((a, b) => b.priority - a.priority);
  const chosen = active[0];
  if (!chosen) return 0;
  return Number(chosen.rate);
}

/**
 * Single source of truth for checkout totals: subtotal, discount, shipping, tax (from tax_zone / tax_rule),
 * and grand total in smallest currency unit.
 */
export async function computeCheckoutTotals(
  dbLike: PricingDb,
  input: ComputeCheckoutTotalsInput,
): Promise<CheckoutTotalsResult> {
  if (input.lines.length === 0) {
    return { ok: false, message: "Cart is empty" };
  }

  const subtotal = input.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const ship = await resolveShippingForCheckout(dbLike, {
    shippingAddress: input.shippingAddress,
    shippingProviderId: input.shippingProviderId,
    shippingMethodId: input.shippingMethodId,
  });
  if ("error" in ship) {
    return { ok: false, message: ship.error };
  }

  const { discountTotal, discountRowId } = await computeDiscountTotal(dbLike, subtotal, input.discountCode);
  const netSubtotal = Math.max(0, subtotal - discountTotal);

  const taxZoneRow = await resolveTaxZoneForAddress(dbLike, input.shippingAddress);
  const defaultClassId = await getDefaultTaxClassId(dbLike);
  const at = new Date();

  let taxTotal = 0;

  if (taxZoneRow && netSubtotal > 0 && subtotal > 0) {
    let allocated = 0;
    const n = input.lines.length;

    for (let i = 0; i < n; i++) {
      const line = input.lines[i]!;
      const lineGross = line.unitPrice * line.quantity;
      const isLast = i === n - 1;
      const lineNet = isLast ? netSubtotal - allocated : Math.floor((netSubtotal * lineGross) / subtotal);
      allocated += lineNet;

      const classId = line.variantTaxClassId ?? line.productTaxClassId ?? defaultClassId;
      if (!classId) continue;

      const rate = await effectiveTaxRateForClass(dbLike, taxZoneRow.id, classId, at);
      taxTotal += Math.round(lineNet * rate);
    }

    const shipRate = await shippingTaxRate(dbLike, taxZoneRow.id, at);
    if (shipRate > 0 && ship.shippingTotal > 0) {
      taxTotal += Math.round(ship.shippingTotal * shipRate);
    }
  }

  const grandTotal = Math.max(0, netSubtotal + ship.shippingTotal + taxTotal);

  return {
    ok: true,
    data: {
      subtotal,
      discountTotal,
      shippingTotal: ship.shippingTotal,
      taxTotal,
      grandTotal,
      currency: "INR",
      shippingZoneId: ship.shippingZoneId,
      appliedDiscount:
        discountTotal > 0 && discountRowId ? { id: "", discountId: discountRowId, appliedAmount: discountTotal } : null,
    },
  };
}

/**
 * Persists discount usage inside an order transaction (mirrors previous order.create logic).
 */
export async function persistDiscountInTransaction(
  tx: PricingDb,
  params: {
    discountCode: string;
    subtotal: number;
    orderId: string;
    userId: string;
    currency: string;
  },
): Promise<AppliedDiscountPreview | null> {
  const now = new Date();
  const discountRow = await tx.query.discount.findFirst({
    where: (d, { and: andLocal, eq: eqLocal }) =>
      andLocal(eqLocal(d.code, params.discountCode.trim()), eqLocal(d.isActive, true)),
  });

  if (!discountRow || (discountRow.expiresAt && discountRow.expiresAt <= now)) {
    return null;
  }

  const minOrderAmount = discountRow.minOrderAmount ?? 0;
  const maxUses = discountRow.maxUses ?? null;
  const usedCount = discountRow.usedCount ?? 0;

  if (params.subtotal < minOrderAmount || (maxUses != null && usedCount >= maxUses)) {
    return null;
  }

  let discountTotal = 0;
  if (discountRow.type === "percent") {
    discountTotal = Math.floor((params.subtotal * discountRow.value) / 10000);
  } else if (discountRow.type === "flat") {
    discountTotal = Math.min(discountRow.value, params.subtotal);
  }

  if (discountTotal <= 0) return null;

  const orderDiscountId = crypto.randomUUID();

  await tx
    .update(discount)
    .set({
      usedCount: sql`${discount.usedCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(discount.id, discountRow.id));

  await tx.insert(orderDiscount).values({
    id: orderDiscountId,
    orderId: params.orderId,
    discountId: discountRow.id,
    appliedAmount: discountTotal,
    createdAt: new Date(),
  });

  await tx.insert(discountUsageEvent).values({
    id: crypto.randomUUID(),
    orderId: params.orderId,
    discountId: discountRow.id,
    orderDiscountId,
    userId: params.userId ?? null,
    currency: params.currency,
    appliedAmount: discountTotal,
    createdAt: new Date(),
  });

  return {
    id: orderDiscountId,
    discountId: discountRow.id,
    appliedAmount: discountTotal,
  };
}
