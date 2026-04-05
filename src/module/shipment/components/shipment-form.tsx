"use client";

import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { shipmentContract } from "@/module/shipment/shipment.schema";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { STATUS } from "@/shared/config/api.config";

const createSchema = shipmentContract.create.input;
type CreateFormValues = z.infer<typeof createSchema>;

const CARRIER_OPTIONS = [
  { label: "BlueDart", value: "BlueDart" },
  { label: "Delhivery", value: "Delhivery" },
  { label: "DTDC", value: "DTDC" },
  { label: "India Post", value: "India Post" },
  { label: "FedEx", value: "FedEx" },
  { label: "DHL", value: "DHL" },
  { label: "Other", value: "Other" },
];

interface ShipmentFormProps {
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ShipmentForm({ orderId, onSuccess, onCancel }: ShipmentFormProps) {
  const createMutation = apiClient.shipment.create.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        onSuccess?.();
      }
    },
  });

  const { data: providersRes } = apiClient.shippingConfig.listProviders.useQuery({});
  const { data: methodsRes } = apiClient.shippingConfig.listMethods.useQuery({});

  const providerOptions =
    providersRes?.data?.map((p) => ({
      label: p.name,
      value: p.id,
    })) ?? [];

  const methodOptionsByProvider =
    methodsRes?.data?.map((m) => ({
      label: m.name,
      value: m.id,
      providerId: m.providerId,
    })) ?? [];

  const defaultValues: CreateFormValues = {
    body: {
      orderId,
      trackingNumber: "",
      carrier: undefined,
      notes: "",
      estimatedDeliveryAt: undefined,
      shippingRate: undefined,
      weight: "",
      shippingProviderId: undefined,
      shippingMethodId: undefined,
    },
  };

  function onSubmit(data: CreateFormValues) {
    createMutation.mutate({
      body: {
        ...data.body,
        orderId,
        trackingNumber: data.body.trackingNumber || undefined,
        carrier: data.body.carrier || undefined,
        notes: data.body.notes || undefined,
        estimatedDeliveryAt: data.body.estimatedDeliveryAt,
        shippingRate: data.body.shippingRate,
        weight: data.body.weight || undefined,
      },
    });
  }

  return (
    <Form<CreateFormValues["body"] extends never ? never : typeof createSchema>
      defaultValues={defaultValues as CreateFormValues}
      schema={createSchema}
      onSubmitAction={onSubmit}
      className="space-y-4 p-0"
    >
      <input type="hidden" name="body.orderId" value={orderId} />
      <FormSection title="Shipment details" description="Enter tracking and carrier information.">
        <Form.Field
          name="body.trackingNumber"
          label="Tracking number"
          type="text"
          placeholder="Tracking or AWB number"
        />
        <Form.Field
          name="body.carrier"
          label="Carrier"
          type="select"
          placeholder="Select carrier"
          options={CARRIER_OPTIONS}
        />
        <Form.Field
          name="body.shippingProviderId"
          label="Shipping provider"
          type="select"
          placeholder="Select shipping provider"
          options={providerOptions}
        />
        <Form.FormWatch name="body.shippingProviderId">
          {({ value }) => {
            const filteredMethods = methodOptionsByProvider
              .filter((option) => !value || option.providerId === value)
              .map(({ providerId: _providerId, ...rest }) => rest);

            return (
              <Form.Field
                name="body.shippingMethodId"
                label="Shipping method"
                type="select"
                placeholder="Select shipping method"
                options={filteredMethods}
              />
            );
          }}
        </Form.FormWatch>
        <Form.Field
          name="body.notes"
          label="Notes"
          type="textarea"
          placeholder="Internal or delivery notes (optional)"
        />
        <Form.Field
          name="body.estimatedDeliveryAt"
          label="Estimated delivery (date)"
          type="text"
          placeholder="YYYY-MM-DD"
        />
        <Form.Field name="body.shippingRate" label="Shipping rate (₹)" type="currency" />
        <Form.Field name="body.weight" label="Weight (kg)" type="text" placeholder="Optional" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Form.Submit
            disabled={createMutation.isPending}
            isLoading={createMutation.isPending}
            label="Create shipment"
          />
        </div>
      </div>
    </Form>
  );
}
