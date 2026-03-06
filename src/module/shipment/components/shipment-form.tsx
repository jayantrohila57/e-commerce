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
  { label: "Select carrier...", value: "", disable: true },
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

  const defaultValues: CreateFormValues = {
    body: {
      orderId,
      trackingNumber: "",
      carrier: undefined,
      notes: "",
      estimatedDeliveryAt: undefined,
      shippingRate: undefined,
      weight: "",
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
      className="space-y-4"
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
