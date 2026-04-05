"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";
import { shippingConfigContract, type shippingZoneSchema } from "./shipping-config.schema";

const createSchema = shippingConfigContract.zone.create.input;
const updateSchema = shippingConfigContract.zone.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type ShippingZone = z.infer<typeof shippingZoneSchema>;

interface ShippingZoneFormProps {
  mode: "create" | "edit";
  initialData?: ShippingZone | null;
  zoneId?: string;
}

export function ShippingZoneForm({ mode, initialData, zoneId }: ShippingZoneFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.shippingConfig.createZone.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.ZONES as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating zone", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.shippingConfig.updateZone.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.ZONES as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating zone", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(data: CreateFormValues) {
    const id = toast.loading("Creating zone...");
    setToastId(id);
    createMutation.mutate({ body: data.body });
  }

  function onSubmitUpdate(data: UpdateFormValues) {
    if (!zoneId) return;
    const id = toast.loading("Updating zone...");
    setToastId(id);
    updateMutation.mutate({
      params: { id: zoneId },
      body: data.body,
    });
  }

  const defaultValuesCreate: CreateFormValues = {
    body: {
      name: "",
      countryCode: "",
      regionCode: undefined,
      isActive: true,
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: zoneId ?? "" },
    body: {
      name: initialData?.name,
      countryCode: initialData?.countryCode,
      regionCode: initialData?.regionCode ?? undefined,
      isActive: initialData?.isActive,
    },
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && !initialData) {
    return <p className="text-sm text-muted-foreground">Shipping zone not found.</p>;
  }

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-4"
    >
      <FormSection title="Zone details" description="Update the shipping zone configuration.">
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Zone name" />
        <Form.Field name="body.countryCode" label="Country code" type="text" required placeholder="e.g. IN" />
        <Form.Field name="body.regionCode" label="Region code" type="text" placeholder="e.g. KA" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.ZONES as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Save changes" />
        </div>
      </div>
    </Form>
  ) : (
    <Form<typeof createSchema>
      schema={createSchema}
      defaultValues={defaultValuesCreate}
      onSubmitAction={onSubmitCreate}
      className="space-y-4"
    >
      <FormSection title="Zone details" description="Create a new shipping zone.">
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Zone name" />
        <Form.Field name="body.countryCode" label="Country code" type="text" required placeholder="e.g. IN" />
        <Form.Field name="body.regionCode" label="Region code" type="text" placeholder="e.g. KA" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.ZONES as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create zone" />
        </div>
      </div>
    </Form>
  );
}
