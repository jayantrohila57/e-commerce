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
import {
  marketingContentContract,
  marketingContentPageEnum,
  marketingContentSectionEnum,
} from "./marketing-content.schema";

const formSchema = marketingContentContract.create.input.shape.body;

type FormValues = z.infer<typeof formSchema>;

interface MarketingContentFormProps {
  defaultValues?: FormValues;
  id?: string;
}

export function MarketingContentForm({ defaultValues, id }: MarketingContentFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const isEdit = Boolean(id);

  const updateMutation = apiClient.marketingContent.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.MARKETING.CONTENT.ROOT as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while updating marketing content", { id: toastId });
      setToastId("");
    },
  });

  const createMutation = apiClient.marketingContent.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.MARKETING.CONTENT.ROOT as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while creating marketing content", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: FormValues) {
    setToastId("");
    const loadingText = isEdit ? "Updating marketing content..." : "Creating marketing content...";
    const idToast = toast.loading(loadingText);
    setToastId(idToast);

    if (isEdit && id) {
      updateMutation.mutate({
        params: { id },
        body: data,
      });
    } else {
      createMutation.mutate({
        body: data,
      });
    }
  }

  return (
    <Form
      defaultValues={
        defaultValues ?? {
          page: "home",
          section: "promo_banner",
          title: "",
          bodyText: "",
          image: "",
          ctaLabel: "",
          ctaLink: "",
          productLink: "",
          items: [],
          displayOrder: 0,
          isActive: true,
          startsAt: undefined,
          endsAt: undefined,
        }
      }
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection title="Placement" description="Choose where this content appears">
          <Form.Field
            name="page"
            label="Page"
            type="select"
            required
            placeholder="Select page"
            options={[
              { label: "Home", value: "home" },
              { label: "Store", value: "store" },
              { label: "Store Category", value: "store_category" },
              { label: "Store Subcategory", value: "store_subcategory" },
              { label: "Product", value: "product" },
              { label: "Checkout", value: "checkout" },
              { label: "About", value: "about" },
              { label: "Newsletter", value: "newsletter" },
              { label: "Support", value: "support" },
            ]}
          />
          <Form.Field
            name="section"
            label="Section"
            type="select"
            required
            placeholder="Select section"
            options={[
              { label: "Promo Banner", value: "promo_banner" },
              { label: "CTA", value: "cta" },
              { label: "Offer Banner", value: "offer_banner" },
              { label: "Split Banner", value: "split_banner" },
              { label: "Announcement Bar", value: "announcement_bar" },
              { label: "Feature Highlight", value: "feature_highlight" },
            ]}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection title="Content" description="Define visuals and copy for this block">
          <Form.Field name="title" label="Title" type="text" placeholder="Short title for this content block" />
          <Form.Field
            name="bodyText"
            label="Body Text"
            type="textarea"
            placeholder="Main copy for this content block"
          />
          <Form.Field name="image" label="Image" type="image" helperText="Upload an image for this banner/section" />
        </FormSection>

        <Separator className="my-6" />

        <FormSection title="Links & Actions" description="Connect this content to actions or products">
          <Form.Field name="ctaLabel" label="CTA Label" type="text" placeholder="e.g. Shop Now, Learn More" />
          <Form.Field name="ctaLink" label="CTA Link" type="text" placeholder="https:// or internal path like /store" />
          <Form.Field
            name="productLink"
            label="Product View/Buy Link"
            type="text"
            placeholder="/store/category/subcategory/variant or any URL"
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection title="Display & Scheduling" description="Control ordering, visibility and timing">
          <Form.Field
            name="displayOrder"
            label="Display Order"
            type="number"
            helperText="Lower numbers are shown first within the same section."
          />
          <Form.Field
            name="isActive"
            label="Active"
            type="switch"
            helperText="Inactive content will not be shown on the site."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              name="startsAt"
              label="Starts At"
              type="text"
              placeholder="Optional start date (ISO string)"
              helperText="Optional. Leave empty to start immediately."
            />
            <Form.Field
              name="endsAt"
              label="Ends At"
              type="text"
              placeholder="Optional end date (ISO string)"
              helperText="Optional. Leave empty for no end date."
            />
          </div>
        </FormSection>

        <Separator className="my-6" />

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(PATH.STUDIO.MARKETING.CONTENT.ROOT as Route)}
          >
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Save Changes" : "Create Content"}</Button>
        </div>
      </div>
    </Form>
  );
}
