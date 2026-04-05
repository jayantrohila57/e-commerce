"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";
import AttributeDelete from "./attribute.component.delete";
import type { AttributeSelect } from "./attribute.schema";
import { attributeContract } from "./attribute.schema";

const formSchema = attributeContract.update.input;
type FormValues = z.infer<typeof formSchema>;

const attributeTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Color", value: "color" },
  { label: "Select", value: "select" },
] as const;

export default function AttributeEditForm({ attribute }: { attribute: AttributeSelect }) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState(false);

  const updateAttribute = apiClient.attribute.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.ATTRIBUTES.ROOT as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
      setIsLoading(false);
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while updating the attribute", { id: toastId });
      setToastId("");
      setIsLoading(false);
    },
  });

  function onSubmit(values: FormValues) {
    setToastId("");
    const id = toast.loading("Updating attribute");
    setToastId(id);
    setIsLoading(true);

    updateAttribute.mutate({
      params: { id: attribute.id },
      body: {
        title: values.body.title,
        slug: values.body.slug,
        type: values.body.type,
        value: values.body.value,
        displayOrder: values.body.displayOrder ?? 0,
      },
    });
  }

  return (
    <Form
      defaultValues={{
        params: { id: attribute.id },
        body: {
          slug: attribute.slug,
          title: attribute.title,
          type: attribute.type,
          value: attribute.value,
          displayOrder: attribute.displayOrder ?? 0,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-4 rounded-md border p-4"
    >
      <div className="col-span-4 h-full w-full space-y-6">
        <FormSection title="Attribute Details" description="Update the attribute fields below.">
          <Form.Field name="body.title" label="Title" type="text" required />
          <Form.Field
            name="body.slug"
            label="Slug"
            type="slug"
            slugField="body.title"
            required
            description="Changing slug may affect existing references"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              name="body.type"
              label="Type"
              type="select"
              required
              options={attributeTypeOptions.map((t) => ({ label: t.label, value: t.value }))}
            />
            <Form.Field name="body.displayOrder" label="Display Order" type="number" />
          </div>
          <Form.Field name="body.value" label="Default Value" type="text" required />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground text-sm">
          <Form.StatusBadge />
          <p className="mt-1 text-xs">Edits will update future usage across variants.</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          <AttributeDelete attributeId={attribute.id} />
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Form.Submit label="Save Changes" disabled={isLoading} isLoading={isLoading} />
        </div>
      </div>
    </Form>
  );
}
