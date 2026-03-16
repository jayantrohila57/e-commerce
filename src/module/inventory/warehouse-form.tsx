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
import { warehouseContract, type warehouseSchema } from "./warehouse.schema";

const createSchema = warehouseContract.create.input;
const updateSchema = warehouseContract.update.input;

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type Warehouse = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
  mode: "create" | "edit";
  initialData?: Warehouse | null;
  warehouseId?: string;
}

export function WarehouseForm({ mode, initialData, warehouseId }: WarehouseFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createMutation = apiClient.warehouse.create.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.INVENTORY.WAREHOUSES.ROOT as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error creating warehouse", { id: toastId });
      setToastId("");
    },
  });

  const updateMutation = apiClient.warehouse.update.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message, { id: toastId });
        router.push(PATH.STUDIO.INVENTORY.WAREHOUSES.ROOT as Route);
      } else {
        toast.error(res.message, { id: toastId });
      }
      setToastId("");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating warehouse", { id: toastId });
      setToastId("");
    },
  });

  const isEdit = mode === "edit";

  function onSubmitCreate(data: CreateFormValues) {
    const id = toast.loading("Creating warehouse...");
    setToastId(id);
    createMutation.mutate({ body: data.body });
  }

  function onSubmitUpdate(data: UpdateFormValues) {
    if (!warehouseId) return;
    const id = toast.loading("Updating warehouse...");
    setToastId(id);
    updateMutation.mutate({
      params: { id: warehouseId },
      body: data.body,
    });
  }

  const defaultValuesCreate: CreateFormValues = {
    body: {
      code: "",
      name: "",
      country: "",
      state: undefined,
      city: undefined,
      addressLine1: undefined,
      addressLine2: undefined,
      postalCode: undefined,
      isActive: true,
    },
  };

  const defaultValuesUpdate: UpdateFormValues = {
    params: { id: warehouseId ?? "" },
    body: {
      code: initialData?.code,
      name: initialData?.name,
      country: initialData?.country,
      state: initialData?.state ?? undefined,
      city: initialData?.city ?? undefined,
      addressLine1: initialData?.addressLine1 ?? undefined,
      addressLine2: initialData?.addressLine2 ?? undefined,
      postalCode: initialData?.postalCode ?? undefined,
      isActive: initialData?.isActive,
    },
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && !initialData) {
    return <p className="text-sm text-muted-foreground">Warehouse not found.</p>;
  }

  return isEdit ? (
    <Form<typeof updateSchema>
      schema={updateSchema}
      defaultValues={defaultValuesUpdate}
      onSubmitAction={onSubmitUpdate}
      className="space-y-4"
    >
      <FormSection title="Warehouse details" description="Update the warehouse configuration.">
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Warehouse name" />
        <Form.Field name="body.country" label="Country" type="text" required placeholder="Country code (e.g. IN)" />
        <Form.Field name="body.state" label="State" type="text" placeholder="State/region" />
        <Form.Field name="body.city" label="City" type="text" placeholder="City" />
        <Form.Field name="body.addressLine1" label="Address line 1" type="text" placeholder="Address line 1" />
        <Form.Field name="body.addressLine2" label="Address line 2" type="text" placeholder="Address line 2" />
        <Form.Field name="body.postalCode" label="Postal code" type="text" placeholder="Postal code" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(PATH.STUDIO.INVENTORY.WAREHOUSES.ROOT as Route)}
          >
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
      <FormSection title="Warehouse details" description="Create a new warehouse.">
        <Form.Field name="body.code" label="Code" type="text" required placeholder="Internal code" />
        <Form.Field name="body.name" label="Name" type="text" required placeholder="Warehouse name" />
        <Form.Field name="body.country" label="Country" type="text" required placeholder="Country code (e.g. IN)" />
        <Form.Field name="body.state" label="State" type="text" placeholder="State/region" />
        <Form.Field name="body.city" label="City" type="text" placeholder="City" />
        <Form.Field name="body.addressLine1" label="Address line 1" type="text" placeholder="Address line 1" />
        <Form.Field name="body.addressLine2" label="Address line 2" type="text" placeholder="Address line 2" />
        <Form.Field name="body.postalCode" label="Postal code" type="text" placeholder="Postal code" />
        <Form.Field name="body.isActive" label="Active" type="switch" />
      </FormSection>

      <div className="flex items-center justify-between gap-4 pt-2">
        <Form.StatusBadge />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(PATH.STUDIO.INVENTORY.WAREHOUSES.ROOT as Route)}
          >
            Cancel
          </Button>
          <Form.Submit disabled={isSubmitting} isLoading={isSubmitting} label="Create warehouse" />
        </div>
      </div>
    </Form>
  );
}
