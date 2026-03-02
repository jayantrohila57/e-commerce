import type { GetPDPProductOutput } from "./product.types";

export type PDPProduct = NonNullable<GetPDPProductOutput["data"]>["product"];
export type PDPVariant = PDPProduct["variants"][number];
type VariantAttribute = NonNullable<PDPVariant["attributes"]>[number];

const withAttributes = (variant: PDPVariant): VariantAttribute[] => variant.attributes ?? [];
const withVariants = (variants?: PDPVariant[] | null): PDPVariant[] => variants ?? [];

export function extractAttributeGroups(variants: PDPVariant[] | null | undefined) {
  const groups: Record<string, Set<string>> = {};

  for (const variant of withVariants(variants)) {
    for (const attr of withAttributes(variant)) {
      if (!groups[attr.title]) groups[attr.title] = new Set();
      groups[attr.title].add(attr.value);
    }
  }

  return groups;
}

export function resolveNextVariant(input: {
  variants: PDPVariant[] | null | undefined;
  current: PDPVariant;
  changeAttrTitle: string;
  changeAttrValue: string;
}): PDPVariant {
  const { variants, current, changeAttrTitle, changeAttrValue } = input;

  const desired: Record<string, string> = {};

  for (const a of withAttributes(current)) {
    desired[a.title] = a.value;
  }

  desired[changeAttrTitle] = changeAttrValue;

  const matchesAll = (v: PDPVariant): boolean =>
    Object.entries(desired).every(([t, val]) => withAttributes(v).some((a) => a.title === t && a.value === val));

  const pool = withVariants(variants);

  // perfect match
  const exact = pool.filter(matchesAll);
  if (exact.length === 1) return exact[0];

  // multiple → choose most specific
  if (exact.length > 1) {
    return exact
      .map((v) => ({
        v,
        score: withAttributes(v).filter((a) => desired[a.title] === a.value).length,
      }))
      .sort((a, b) => b.score - a.score)[0]?.v as PDPVariant;
  }

  // fallback — ignore the changed attr
  const fallbackDesired = { ...desired };
  delete fallbackDesired[changeAttrTitle];

  const fallbackMatches = (v: PDPVariant) =>
    Object.entries(fallbackDesired).every(([t, val]) =>
      withAttributes(v).some((a) => a.title === t && a.value === val),
    );

  const fallback = pool.filter(fallbackMatches);
  if (fallback.length > 0) return fallback[0];

  return pool[0] ?? current;
}

export function isOptionAvailable(input: {
  variants: PDPVariant[] | null | undefined;
  current: PDPVariant;
  changeAttrTitle: string;
  changeAttrValue: string;
}): boolean {
  const { variants, current, changeAttrTitle, changeAttrValue } = input;

  const desired: Record<string, string> = {};

  for (const a of withAttributes(current)) {
    desired[a.title] = a.value;
  }

  desired[changeAttrTitle] = changeAttrValue;

  return withVariants(variants).some((variant) =>
    Object.entries(desired).every(([t, value]) =>
      withAttributes(variant).some((a) => a.title === t && a.value === value),
    ),
  );
}
