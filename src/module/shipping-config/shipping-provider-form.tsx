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
import { shippingConfigContract, type shippingProviderSchema } from "./shipping-config.schema";

const createSchema = shippingConfigContract.provider.create.input;
const updateSchema = shippingConfigContract.provider.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type ShippingProvider = z.infer<typeof shippingProviderSchema>;

interface ShippingProviderFormProps {
  mode: "create" | "edit";
  initialData?: ShippingProvider | null;
  providerId?: string;
}

export function ShippingProviderForm({ mode, initialData, providerId }: ShippingProviderFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.shippingConfig.createProvider.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.PROVIDERS as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating provider", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.shippingConfig.updateProvider.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.SHIPPING.PROVIDERS as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating provider", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(data: CreateFormValues) {
    const id = toast.loading("Creating provider...");
    setToastId(id);
    createMutation.mutate({ body: data.body });
  }

  function onSubmitUpdate(data: UpdateFormValues) {
    if (!providerId) return;
    const id = toast.loading("Updating provider...");
    setToastId(id);
    updateMutation.mutate({
      params: { id: providerId },
      body: data.body,
    });
  }

  const defaultValuesCreate: CreateFormValues = {
    body: {
      code: "",
      name: "",
      isActive: true,
      metadata: {},
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: providerId ?? "" },
    body: {
      code: initialData?.code,
      name: initialData?.name,
      isActive: initialData?.isActive,
      metadata: initialData?.metadata ?? {},
    },
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && !initialData) {
    return <p className="text-sm text-muted-foreground">Provider not found.</p>;
  }

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-4"
    >
      <FormSection title="Provider details" description="Update the provider configuration.">
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code (e.g. IN_LOCAL)" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Display name" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.PROVIDERS as Route)}>
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
      <FormSection title="Provider details" description="Create a new shipping provider.">
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code (e.g. IN_LOCAL)" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Display name" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(PATH.STUDIO.SHIPPING.PROVIDERS as Route)}>
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create provider" />
        </div>
      </div>
    </Form>
  );
}
