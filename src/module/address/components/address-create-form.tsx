"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { addressContract } from "@/module/address/address.schema";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";

const createSchema = addressContract.create.input;
type CreateFormValues = z.infer<typeof createSchema>;

export function AddressCreateForm() {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.address.create.useMutation({
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
      toast.error(message || "An error occurred while creating the address", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: CreateFormValues) {
    setToastId("");
    const id = toast.loading("Saving address");
    setToastId(id);
    createMutation.mutate({
      body: {
        ...data.body,
      },
    });
  }

  const defaultValues: CreateFormValues = {
    body: {
      type: "shipping",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  };

  return (
    <Form<CreateFormValues["body"] extends never ? never : typeof createSchema>
      defaultValues={defaultValues as CreateFormValues}
      schema={createSchema}
      onSubmitAction={onSubmit}
      className="space-y-4"
    >
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

      <FormSection title="Address details" description="Enter the full address exactly as it should appear.">
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
          <Form.Submit disabled={createMutation.isPending} isLoading={createMutation.isPending} label="Save address" />
        </div>
      </div>
    </Form>
  );
}
