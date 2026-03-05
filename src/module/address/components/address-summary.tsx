"use client";

import { Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useAddress } from "@/module/address/use-address";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export function AddressSummary() {
  const { addresses, isLoading } = useAddress();

  const { total, shippingCount, billingCount, defaultCount } = useMemo(() => {
    const totalCount = addresses.length;
    const shipping = addresses.filter((a) => a.type === "shipping").length;
    const billing = addresses.filter((a) => a.type === "billing").length;
    const defaults = addresses.filter((a) => a.isDefault).length;
    return {
      total: totalCount,
      shippingCount: shipping,
      billingCount: billing,
      defaultCount: defaults,
    };
  }, [addresses]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-muted/40">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Addresses</h2>
            <p className="text-xs text-muted-foreground">You have not saved any addresses yet.</p>
          </div>
        </div>
        <Button size="sm" className="w-full" asChild>
          <Link href={PATH.ACCOUNT.ADDRESS_NEW}>Add address</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Address summary</h2>
            <p className="text-xs text-muted-foreground">Quick overview of your saved addresses.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={PATH.ACCOUNT.ADDRESS_NEW}>Add</Link>
        </Button>
      </div>

      <Separator />

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total addresses</span>
          <span className="font-medium">{total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping addresses</span>
          <span className="font-medium">{shippingCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Billing addresses</span>
          <span className="font-medium">{billingCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Default addresses</span>
          <span className="font-medium">{defaultCount}</span>
        </div>
      </div>

      <p className="pt-1 text-[10px] leading-snug text-muted-foreground">
        Default addresses will be pre-selected during checkout. You can still change them on a per-order basis.
      </p>
    </div>
  );
}
