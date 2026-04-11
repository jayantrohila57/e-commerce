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
import { clientEnv } from "@/shared/config/env.client";
import { colorOptions, displayTypeOptions, visibilityOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { subcategoryContract } from "./subcategory.schema";
import type { SubcategoryUpdate } from "./subcategory.types";

const formSchema = subcategoryContract.update.input;
type FormValues = z.infer<typeof formSchema>;

interface SubcategoryEditFormProps {
  subcategory: SubcategoryUpdate | null;
  categorySlug: string;
}

export default function SubcategoryEditForm({ subcategory, categorySlug }: SubcategoryEditFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const updateSubcategory = apiClient.subcategory.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.SUB_CATEGORIES.ROOT(categorySlug, subcategory?.slug ?? "") as Route);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while updating the subcategory", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: FormValues) {
    if (!subcategory) {
      toast.error("Subcategory not found");
      return;
    }

    setToastId("");
    const id = toast.loading("Updating subcategory");
    setToastId(id);

    updateSubcategory.mutate({
      params: {
        id: String(subcategory?.id),
      },
      body: {
        slug: data.body.slug,
        title: data.body.title,
        description: data.body.description,
        color: data.body.color,
        image: data.body.image,
        displayType: data.body.displayType,
        visibility: data.body.visibility,
        displayOrder: data.body.displayOrder,
        isFeatured: data.body.isFeatured ?? false,
        metaTitle: data.body.metaTitle || data.body.title,
        metaDescription: data.body.metaDescription || data.body.description,
        icon: data.body.icon,
      },
    });
  }

  return (
    <Form
      defaultValues={{
        params: {
          id: String(subcategory?.id),
        },
        body: {
          ...subcategory,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection title="Subcategory Details" description="Enter subcategory information">
          <Form.Field
            {...{
              name: "body.title",
              label: "Title",
              type: "text",
              placeholder: "Enter subcategory title",
              required: true,
            }}
          />
          <Form.Field
            {...{
              name: "body.slug",
              label: "Slug",
              type: "slug",
              slugField: "body.title",
              description: "URL-friendly version of the title",
              helperText: "The slug is used in the URL",
              inlinePrefix: `${clientEnv.NEXT_PUBLIC_BASE_URL}/category/${categorySlug}/`,
              required: true,
              placeholder: "subcategory-name",
            }}
          />
          <Form.Field
            {...{
              name: "body.description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter a brief description of the subcategory",
              rows: 3,
            }}
          />
        </FormSection>
        <Separator className="my-4" />

        <FormSection title="Media" description="Upload images and icons for this subcategory">
          <Form.Field
            {...{
              name: "body.image",
              label: "Featured Image",
              type: "image",
              description: "Main image for the subcategory",
              helperText: "Recommended size: 1200x630px",
              required: false,
              placeholder: "Upload image",
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Display Settings" description="Configure how this subcategory appears to users">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.displayType",
                label: "Display Type",
                type: "select",
                description: "How products in this subcategory should be displayed",
                helperText: "Grid is recommended for most cases",
                required: true,
                placeholder: "Select display type",
                options: [
                  { label: "Select type...", value: "select-type", disabled: true },
                  ...displayTypeOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />
            <Form.Field
              {...{
                name: "body.visibility",
                label: "Visibility",
                type: "select",
                description: "Control who can see this subcategory",
                helperText: "Hidden items are only visible to admins",
                required: true,
                placeholder: "Select type",
                options: [
                  { label: "Select type...", value: "select-type", disabled: true },
                  ...visibilityOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />
            <Form.Field
              {...{
                name: "body.isFeatured",
                label: "Featured Subcategory",
                type: "switch",
                description: "Show this subcategory in featured sections",
                helperText: "Featured items may appear in special sections of your store",
              }}
            />
            <Form.Field
              {...{
                name: "body.color",
                label: "Accent Color",
                type: "color",
                description: "Used for highlights and accents",
                helperText: "Pick a color that represents this subcategory",
                required: false,
                options: colorOptions.map((c) => ({
                  label: c.label,
                  value: c.value,
                  icon: c.icon,
                  color: c.color,
                })),
              }}
            />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="SEO & Metadata" description="Optimize for search engines and social sharing">
          <Form.Field
            {...{
              name: "body.metaTitle",
              label: "Meta Title",
              type: "text",
              description: "Title for search engines (leave blank to use subcategory title)",
              placeholder: "Enter meta title",
              maxLength: 60,
            }}
          />
          <Form.Field
            {...{
              name: "body.metaDescription",
              label: "Meta Description",
              type: "textarea",
              description: "Description for search engines (leave blank to use subcategory description)",
              placeholder: "Enter meta description",
              rows: 2,
            }}
          />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-0 py-4">
        <Form.StatusBadge />
        <div className="flex flex-row items-center gap-2">
          <Button variant="outline" type="button">
            {"Save Draft"}
          </Button>
          <Form.Submit disabled={updateSubcategory.isPending} isLoading={updateSubcategory.isPending} />
        </div>
      </div>
    </Form>
  );
}
