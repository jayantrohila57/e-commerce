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
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";
import { inventoryContract } from "./inventory.schema";

const formSchema = inventoryContract.create.input;
type FormValues = z.infer<typeof formSchema>;

export default function InventoryCreateForm() {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createInventory = apiClient.inventory.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.INVENTORY.ROOT as Route);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while creating the inventory", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: FormValues) {
    setToastId("");
    const id = toast.loading("Creating inventory");
    setToastId(id);

    createInventory.mutate({
      data: {
        variantId: data.data.variantId,
        warehouseId: data.data.warehouseId ?? null,
        sku: data.data.sku,
        barcode: data.data.barcode ?? null,
        quantity: data.data.quantity,
        incoming: data.data.incoming,
        reserved: data.data.reserved,
      },
    });
  }

  return (
    <Form
      defaultValues={{
        data: {
          variantId: "",
          warehouseId: undefined,
          sku: "",
          barcode: null,
          quantity: 0,
          incoming: 0,
          reserved: 0,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection title="Inventory Details" description="Create a new inventory record">
          <Form.Field name="data.variantId" label="Variant ID" type="text" required placeholder="Variant ID" />
          <Form.Field name="data.sku" label="SKU" type="text" required placeholder="SKU" />
          <Form.Field name="data.barcode" label="Barcode" type="text" placeholder="Barcode" />
          <Form.Field name="data.quantity" label="Quantity" type="number" required placeholder="Quantity" />
          <Form.Field name="data.incoming" label="Incoming" type="number" placeholder="Incoming" />
          <Form.Field name="data.reserved" label="Reserved" type="number" placeholder="Reserved" />
          <Form.Field name="data.warehouseId" label="Warehouse ID" type="text" required placeholder="Warehouse ID" />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-0 py-4">
        <Form.StatusBadge />
        <div className="flex flex-row items-center gap-2">
          <Button variant="outline" type="button" onClick={() => router.push(PATH.STUDIO.INVENTORY.ROOT as Route)}>
            Cancel
          </Button>
          <Form.Submit
            disabled={createInventory.isPending}
            isLoading={createInventory.isPending}
            label="Create Inventory"
          />
        </div>
      </div>
    </Form>
  );
}
