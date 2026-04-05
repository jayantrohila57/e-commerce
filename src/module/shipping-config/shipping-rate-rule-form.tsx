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
import {
  shippingConfigContract,
  type shippingMethodSchema,
  type shippingRateRuleSchema,
  type shippingZoneSchema,
} from "./shipping-config.schema";

const createSchema = shippingConfigContract.rateRule.create.input;
const updateSchema = shippingConfigContract.rateRule.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type ShippingRateRule = z.infer<typeof shippingRateRuleSchema>;
type ShippingMethod = z.infer<typeof shippingMethodSchema>;
type ShippingZone = z.infer<typeof shippingZoneSchema>;

interface ShippingRateRuleFormProps {
  mode: "create" | "edit";
  initialData?: ShippingRateRule | null;
  rateRuleId?: string;
  methods: ShippingMethod[];
  zones: ShippingZone[];
}

export function ShippingRateRuleForm({ mode, initialData, rateRuleId, methods, zones }: ShippingRateRuleFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.shippingConfig.createRateRule.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.RATES as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating rate rule", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.shippingConfig.updateRateRule.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.RATES as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating rate rule", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(data: CreateFormValues) {
    const id = toast.loading("Creating rate rule...");
    setToastId(id);
    createMutation.mutate({ body: data.body });
  }

  function onSubmitUpdate(data: UpdateFormValues) {
    if (!rateRuleId) return;
    const id = toast.loading("Updating rate rule...");
    setToastId(id);
    updateMutation.mutate({
      params: { id: rateRuleId },
      body: data.body,
    });
  }

  const methodOptions =
    methods?.map((m) => ({
      label: m.name,
      value: m.id,
    })) ?? [];

  const zoneOptions =
    zones?.map((z) => ({
      label: `${z.name} (${z.countryCode}${z.regionCode ? `-${z.regionCode}` : ""})`,
      value: z.id,
    })) ?? [];

  const defaultValuesCreate: CreateFormValues = {
    body: {
      methodId: methods?.[0]?.id ?? "",
      zoneId: zones?.[0]?.id ?? "",
      price: 0,
      freeShippingMinOrderValue: undefined,
      isActive: true,
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: rateRuleId ?? "" },
    body: {
      methodId: initialData?.methodId,
      zoneId: initialData?.zoneId,
      price: initialData?.price,
      freeShippingMinOrderValue: initialData?.freeShippingMinOrderValue ?? undefined,
      isActive: initialData?.isActive,
    },
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && !initialData) {
    return <p className="text-sm text-muted-foreground">Shipping rate rule not found.</p>;
  }

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-4"
    >
      <FormSection title="Rate rule details" description="Update the shipping rate rule.">
        <Form.Field
          name="body.methodId"
          label="Method"
          type="select"
          required
          placeholder="Select method"
          options={methodOptions}
        />
        <Form.Field
          name="body.zoneId"
          label="Zone"
          type="select"
          required
          placeholder="Select zone"
          options={zoneOptions}
        />
        <Form.Field
          name="body.price"
          label="Price (₹)"
          type="number"
          required
          placeholder="5000"
          description="Amount in paise (e.g. 5000 = ₹50)"
        />
        <Form.Field
          name="body.freeShippingMinOrderValue"
          label="Free shipping over (₹)"
          type="number"
          placeholder="Optional"
          description="Optional order total threshold in paise for free shipping"
        />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.RATES as Route)}>
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
      <FormSection title="Rate rule details" description="Create a new shipping rate rule.">
        <Form.Field
          name="body.methodId"
          label="Method"
          type="select"
          required
          placeholder="Select method"
          options={methodOptions}
        />
        <Form.Field
          name="body.zoneId"
          label="Zone"
          type="select"
          required
          placeholder="Select zone"
          options={zoneOptions}
        />
        <Form.Field
          name="body.price"
          label="Price (₹)"
          type="number"
          required
          placeholder="5000"
          description="Amount in paise (e.g. 5000 = ₹50)"
        />
        <Form.Field
          name="body.freeShippingMinOrderValue"
          label="Free shipping over (₹)"
          type="number"
          placeholder="Optional"
          description="Optional order total threshold in paise for free shipping"
        />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.RATES as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create rate rule" />
        </div>
      </div>
    </Form>
  );
}
