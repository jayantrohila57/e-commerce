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
  type shippingProviderSchema,
} from "./shipping-config.schema";

const createSchema = shippingConfigContract.method.create.input;
const updateSchema = shippingConfigContract.method.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type ShippingMethod = z.infer<typeof shippingMethodSchema>;
type ShippingProvider = z.infer<typeof shippingProviderSchema>;

interface ShippingMethodFormProps {
  mode: "create" | "edit";
  initialData?: ShippingMethod | null;
  methodId?: string;
  providers: ShippingProvider[];
}

export function ShippingMethodForm({ mode, initialData, methodId, providers }: ShippingMethodFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.shippingConfig.createMethod.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.METHODS as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating method", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.shippingConfig.updateMethod.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.METHODS as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating method", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(data: CreateFormValues) {
    const id = toast.loading("Creating method...");
    setToastId(id);
    createMutation.mutate({ body: data.body });
  }

  function onSubmitUpdate(data: UpdateFormValues) {
    if (!methodId) return;
    const id = toast.loading("Updating method...");
    setToastId(id);
    updateMutation.mutate({
      params: { id: methodId },
      body: data.body,
    });
  }

  const providerOptions =
    providers?.map((p) => ({
      label: p.name,
      value: p.id,
    })) ?? [];

  const defaultValuesCreate: CreateFormValues = {
    body: {
      providerId: providers?.[0]?.id ?? "",
      code: "",
      name: "",
      isActive: true,
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: methodId ?? "" },
    body: {
      providerId: initialData?.providerId,
      code: initialData?.code,
      name: initialData?.name,
      isActive: initialData?.isActive,
    },
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && !initialData) {
    return <p className="text-sm text-muted-foreground">Shipping method not found.</p>;
  }

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-4"
    >
      <FormSection title="Method details" description="Update the shipping method configuration.">
        <Form.Field
          name="body.providerId"
          label="Provider"
          type="select"
          required
          placeholder="Select provider"
          options={providerOptions}
        />
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code (e.g. STANDARD)" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Display name" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.METHODS as Route)}>
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
      <FormSection title="Method details" description="Create a new shipping method.">
        <Form.Field
          name="body.providerId"
          label="Provider"
          type="select"
          required
          placeholder="Select provider"
          options={providerOptions}
        />
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code (e.g. STANDARD)" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Display name" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.METHODS as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create method" />
        </div>
      </div>
    </Form>
  );
}
