"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { AddressCard } from "@/module/address/components/address-card";
import { useAddress } from "@/module/address/use-address";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";

export function AddressItemList() {
  const { addresses, isLoading } = useAddress();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  const hasAddresses = addresses && addresses.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Saved addresses</h2>
          <p className="text-xs text-muted-foreground">
            Manage the shipping and billing addresses associated with your account.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={PATH.ACCOUNT.ADDRESS_NEW}>Add address</Link>
        </Button>
      </div>

      {!hasAddresses ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No addresses yet</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Add a shipping or billing address to speed up checkout and keep your orders organized.
          </p>
          <Button asChild>
            <Link href={PATH.ACCOUNT.ADDRESS_NEW}>Add your first address</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}

      {/* Creation handled on dedicated page at PATH.ACCOUNT.ADDRESS_NEW */}
    </div>
  );
}
