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
import { type Discount, discountContract } from "./discount.schema";

const createSchema = discountContract.create.input;
const updateSchema = discountContract.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

interface DiscountFormProps {
  mode: "create" | "edit";
  id?: string;
  /** Loaded on the server for edit mode. */
  initial?: Discount | null;
}

export function DiscountForm({ mode, id, initial }: DiscountFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.discount.create.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.DISCOUNTS.ROOT as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating discount", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.discount.update.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.DISCOUNTS.ROOT as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating discount", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(values: CreateFormValues) {
    const idToast = toast.loading("Creating discount...");
    setToastId(idToast);
    createMutation.mutate({
      body: values.body,
    });
  }

  function onSubmitUpdate(values: UpdateFormValues) {
    if (!id) return;
    const idToast = toast.loading("Updating discount...");
    setToastId(idToast);
    updateMutation.mutate({
      params: { id },
      body: values.body,
    });
  }

  const defaultValuesCreate: CreateFormValues = {
    body: {
      code: "",
      type: "percent",
      value: 0,
      minOrderAmount: 0,
      maxUses: null,
      expiresAt: null,
      isActive: true,
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: id ?? "" },
    body: initial
      ? {
          code: initial.code,
          type: initial.type,
          value: initial.value,
          minOrderAmount: initial.minOrderAmount ?? 0,
          maxUses: initial.maxUses ?? null,
          expiresAt: initial.expiresAt ?? null,
          isActive: initial.isActive ?? true,
        }
      : {},
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-6"
    >
      <FormSection title="Basic details" description="Update the code and type of discount." required>
        <Form.Field name="body.code" label="Code" type="text" placeholder="SAVE10" />
        <Form.Field
          name="body.type"
          label="Type"
          type="select"
          options={[
            { label: "Percent", value: "percent" },
            { label: "Flat amount", value: "flat" },
          ]}
        />
        <Form.Field
          name="body.value"
          label="Value"
          type="number"
          helperText="For percent, use basis points (e.g. 1000 = 10%). For flat, amount in smallest unit."
        />
      </FormSection>

      <FormSection title="Conditions" description="Optional conditions and limits for this discount.">
        <Form.Field
          name="body.minOrderAmount"
          label="Minimum order amount"
          type="number"
          helperText="Minimum cart subtotal (in smallest currency unit) required to apply this discount."
        />
        <Form.Field
          name="body.maxUses"
          label="Max uses"
          type="number"
          helperText="Total number of times this discount can be used. Leave empty for unlimited."
        />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push(PATH.STUDIO.DISCOUNTS.ROOT)}>
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
      className="space-y-6"
    >
      <FormSection title="Basic details" description="Define the code and type of discount." required>
        <Form.Field name="body.code" label="Code" type="text" placeholder="SAVE10" required />
        <Form.Field
          name="body.type"
          label="Type"
          type="select"
          required
          options={[
            { label: "Percent", value: "percent" },
            { label: "Flat amount", value: "flat" },
          ]}
        />
        <Form.Field
          name="body.value"
          label="Value"
          type="number"
          required
          helperText="For percent, use basis points (e.g. 1000 = 10%). For flat, amount in smallest unit."
        />
      </FormSection>

      <FormSection title="Conditions" description="Optional conditions and limits for this discount.">
        <Form.Field
          name="body.minOrderAmount"
          label="Minimum order amount"
          type="number"
          helperText="Minimum cart subtotal (in smallest currency unit) required to apply this discount."
        />
        <Form.Field
          name="body.maxUses"
          label="Max uses"
          type="number"
          helperText="Total number of times this discount can be used. Leave empty for unlimited."
        />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push(PATH.STUDIO.DISCOUNTS.ROOT)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create discount" />
        </div>
      </div>
    </Form>
  );
}
