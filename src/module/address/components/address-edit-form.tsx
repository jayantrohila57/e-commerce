"use client";

import { Loader2 } from "lucide-react";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { addressContract } from "@/module/address/address.schema";
import { useAddress } from "@/module/address/use-address";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";

const updateSchema = addressContract.update.input;
type UpdateFormValues = z.infer<typeof updateSchema>;

export function AddressEditForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const addressId = params.id;

  const { addresses, isLoading } = useAddress();
  const [toastId, setToastId] = useState<string | number>("");

  const currentAddress = useMemo(() => addresses.find((addr) => addr.id === addressId), [addresses, addressId]);

  const updateMutation = apiClient.address.update.useMutation({
    onSuccess: ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.ACCOUNT.ADDRESS as Route);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while updating the address", { id: toastId });
      setToastId("");
    },
  });

  if (isLoading && !currentAddress) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentAddress) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-6 text-sm">
        <p className="font-medium">Address not found</p>
        <p className="text-muted-foreground">
          The address you are trying to edit does not exist or may have been removed.
        </p>
        <Button size="sm" onClick={() => router.push(PATH.ACCOUNT.ADDRESS as Route)}>
          Back to addresses
        </Button>
      </div>
    );
  }

  const defaultValues: UpdateFormValues = {
    params: {
      id: currentAddress.id,
    },
    body: {
      type: currentAddress.type,
      line1: currentAddress.line1,
      line2: currentAddress.line2 ?? "",
      city: currentAddress.city,
      state: currentAddress.state,
      postalCode: currentAddress.postalCode,
      country: currentAddress.country,
      isDefault: currentAddress.isDefault,
    },
  };

  function onSubmit(data: UpdateFormValues) {
    setToastId("");
    const id = toast.loading("Updating address");
    setToastId(id);
    updateMutation.mutate({
      params: { id: data.params.id },
      body: {
        ...data.body,
      },
    });
  }

  return (
    <Form defaultValues={defaultValues} schema={updateSchema} onSubmitAction={onSubmit} className="space-y-4">
      <FormSection title="Address type" description="Choose whether this is a shipping or billing address.">
        <Form.Field
          name="body.type"
          label="Type"
          type="select"
          required
          placeholder="Select type"
          options={[
            { label: "Select type...", value: "select-type", disable: true },
            { label: "Shipping", value: "shipping" },
            { label: "Billing", value: "billing" },
          ]}
        />
        <Form.Field
          name="body.isDefault"
          label="Set as default"
          type="switch"
          helperText="Use this address as your default for this type."
        />
      </FormSection>

      <Separator className="my-2" />

      <FormSection title="Address details" description="Update the full address exactly as it should appear.">
        <Form.Field
          name="body.line1"
          label="Address line 1"
          type="text"
          placeholder="House number and street"
          required
        />
        <Form.Field
          name="body.line2"
          label="Address line 2"
          type="text"
          placeholder="Apartment, suite, etc. (optional)"
        />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Form.Field name="body.city" label="City" type="text" placeholder="City" required />
          <Form.Field name="body.state" label="State / Province" type="text" placeholder="State" required />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Form.Field name="body.postalCode" label="Postal code" type="text" placeholder="Postal / ZIP code" required />
          <Form.Field name="body.country" label="Country" type="text" placeholder="Country" required />
        </div>
      </FormSection>

      <Separator className="my-2" />

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.ACCOUNT.ADDRESS as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={updateMutation.isPending} isLoading={updateMutation.isPending} label="Save changes" />
        </div>
      </div>
    </Form>
  );
}
