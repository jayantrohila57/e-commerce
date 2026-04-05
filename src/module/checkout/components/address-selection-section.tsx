"use client";

import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useWatch } from "react-hook-form";
import type { Address } from "@/module/address/address.schema";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

function formatAddress(addr: Address) {
  const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
  return parts.join(", ");
}

interface AddressSelectionSectionProps {
  shippingAddresses: Address[];
  billingAddresses: Address[];
}

export function AddressSelectionSection({ shippingAddresses, billingAddresses }: AddressSelectionSectionProps) {
  const sameAsShipping = useWatch({ name: "body.sameAsShipping" as const, defaultValue: true });

  const shippingOptions =
    shippingAddresses.length > 0 ? shippingAddresses.map((a) => ({ value: a.id, label: formatAddress(a) })) : [];

  const billingOptions =
    billingAddresses.length > 0 ? billingAddresses.map((a) => ({ value: a.id, label: formatAddress(a) })) : [];

  return (
    <div className="space-y-4">
      <FormSection title="Shipping address" description="Select where you want your order delivered." required>
        <div className="space-y-3">
          {shippingAddresses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
                <MapPin className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No shipping address on file.</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={PATH.ACCOUNT.ADDRESS_NEW}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add address
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Form.Field name="body.shippingAddressId" label="" type="radio" required options={shippingOptions} />
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link href={PATH.ACCOUNT.ADDRESS_NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add new address
                </Link>
              </Button>
            </>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Billing address"
        description="Use the same as shipping or choose a different billing address."
      >
        <div className="space-y-3">
          <Form.Field
            name="body.sameAsShipping"
            label="Same as shipping address"
            type="switch"
            helperText="Bill to the same address as delivery."
          />
          {!sameAsShipping && billingAddresses.length > 0 && (
            <Form.Field name="body.billingAddressId" label="Billing address" type="radio" options={billingOptions} />
          )}
          {!sameAsShipping && billingAddresses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No billing address on file. Add one from your{" "}
              <Link href={PATH.ACCOUNT.ADDRESS} className="underline">
                address book
              </Link>
              .
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
}
