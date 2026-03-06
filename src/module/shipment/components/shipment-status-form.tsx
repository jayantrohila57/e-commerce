"use client";

import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { shipmentContract } from "@/module/shipment/shipment.schema";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { STATUS } from "@/shared/config/api.config";

const updateStatusSchema = shipmentContract.updateStatus.input;
type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

const SHIPMENT_STATUS_VALUES = [
  "pending",
  "label_created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
  "returned",
] as const;

const STATUS_OPTIONS = [
  { label: "Select status...", value: "", disable: true },
  ...SHIPMENT_STATUS_VALUES.map((value) => ({
    label: value.replace(/_/g, " "),
    value,
    disable: false,
  })),
];

interface ShipmentStatusFormProps {
  shipmentId: string;
  currentStatus: Shipment["status"];
  currentTrackingNumber?: string | null;
  currentCarrier?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ShipmentStatusForm({
  shipmentId,
  currentStatus,
  currentTrackingNumber,
  currentCarrier,
  onSuccess,
  onCancel,
}: ShipmentStatusFormProps) {
  const updateMutation = apiClient.shipment.updateStatus.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        onSuccess?.();
      }
    },
  });

  const defaultValues: UpdateStatusFormValues = {
    params: { id: shipmentId },
    body: {
      status: currentStatus,
      trackingNumber: currentTrackingNumber ?? "",
      carrier: currentCarrier ?? "",
    },
  };

  function onSubmit(data: UpdateStatusFormValues) {
    updateMutation.mutate({
      params: { id: shipmentId },
      body: {
        status: data.body.status,
        trackingNumber: data.body.trackingNumber || undefined,
        carrier: data.body.carrier || undefined,
      },
    });
  }

  return (
    <Form<UpdateStatusFormValues["body"] extends never ? never : typeof updateStatusSchema>
      defaultValues={defaultValues as UpdateStatusFormValues}
      schema={updateStatusSchema}
      onSubmitAction={onSubmit}
      className="space-y-4"
    >
      <FormSection title="Update status" description="Change shipment status and tracking info.">
        <Form.Field name="body.status" label="Status" type="select" required options={STATUS_OPTIONS} />
        <Form.Field
          name="body.trackingNumber"
          label="Tracking number"
          type="text"
          placeholder="Tracking or AWB number"
        />
        <Form.Field name="body.carrier" label="Carrier" type="text" placeholder="Carrier name" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Form.Submit disabled={updateMutation.isPending} isLoading={updateMutation.isPending} label="Update status" />
        </div>
      </div>
    </Form>
  );
}
