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
import { attributeContract } from "./attribute.schema";

const formSchema = attributeContract.create.input;
type FormValues = z.infer<typeof formSchema>;

type SeriesLike = { slug: string; title: string };

const attributeTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Color", value: "color" },
  { label: "Select", value: "select" },
] as const;

export default function AttributeForm({ series }: { series: SeriesLike[] }) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState(false);

  const seriesOptions = useMemo(
    () =>
      (series ?? []).map((s) => ({
        label: s.title,
        value: s.slug,
      })),
    [series],
  );

  const createAttribute = apiClient.attribute.create.useMutation({
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
      toast.error(message || "An error occurred while creating the attribute", { id: toastId });
      setToastId("");
      setIsLoading(false);
    },
  });

  function onSubmit(values: FormValues) {
    setToastId("");
    const id = toast.loading("Creating attribute");
    setToastId(id);
    setIsLoading(true);

    createAttribute.mutate({
      body: {
        seriesSlug: values.body.seriesSlug,
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
        body: {
          seriesSlug: seriesOptions?.[0]?.value ?? "",
          slug: "",
          title: "",
          type: "text",
          value: "",
          displayOrder: 0,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-4 rounded-md border p-4"
    >
      <div className="col-span-4 h-full w-full space-y-6">
        <FormSection title="Attribute Details" description="Attributes are reusable key/value metadata for variants.">
          <Form.Field
            name="body.seriesSlug"
            label="Series"
            type="select"
            required
            options={seriesOptions}
            description="Attributes are scoped to a series"
            helperText="Pick the series this attribute belongs to"
          />
          <Form.Field name="body.title" label="Title" type="text" required placeholder="e.g. Material" />
          <Form.Field
            name="body.slug"
            label="Slug"
            type="slug"
            slugField="body.title"
            required
            placeholder="material"
            description="Used as a stable identifier"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              name="body.type"
              label="Type"
              type="select"
              required
              options={attributeTypeOptions.map((t) => ({ label: t.label, value: t.value }))}
              description="How this attribute is interpreted in the UI"
            />
            <Form.Field name="body.displayOrder" label="Display Order" type="number" placeholder="0" />
          </div>
          <Form.Field
            name="body.value"
            label="Default Value"
            type="text"
            required
            placeholder="e.g. Cotton"
            description="Stored as text; variants can override per selection"
          />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground text-sm">
          <Form.StatusBadge />
          <p className="mt-1 text-xs">Create the attribute once, then reuse it across variants.</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Form.Submit label="Create Attribute" disabled={isLoading} isLoading={isLoading} />
        </div>
      </div>
    </Form>
  );
}
