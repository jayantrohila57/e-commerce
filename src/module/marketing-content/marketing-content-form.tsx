"use client";

import { Minus, Plus } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { FormItem } from "@/shared/components/common/form";
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

function EnsureCrouselItems({ defaultSlide }: { defaultSlide: NonNullable<FormValues["items"]>[number] }) {
  const form = useFormContext<FormValues>();
  const section = useWatch({ control: form.control, name: "section" });
  const items = useWatch({ control: form.control, name: "items" });
  const didInit = useRef(false);

  useEffect(() => {
    if (section !== "crousel") {
      didInit.current = false;
      return;
    }

    const arr = Array.isArray(items) ? items : [];
    if (!didInit.current && arr.length === 0) {
      didInit.current = true;
      form.setValue("items", [defaultSlide], { shouldDirty: true });
    }
  }, [defaultSlide, form, items, section]);

  return null;
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
              { label: "Crousel", value: "crousel" },
              { label: "Split Banner", value: "split_banner" },
              { label: "Announcement Bar", value: "announcement_bar" },
              { label: "Feature Highlight", value: "feature_highlight" },
            ]}
          />
        </FormSection>

        <Separator className="my-6" />

        <Form.FormWatch name="section">
          {({ value }) => {
            if (value === "crousel") return null;
            return (
              <FormSection title="Content" description="Define visuals and copy for this block">
                <Form.Field name="title" label="Title" type="text" placeholder="Short title for this content block" />
                <Form.Field
                  name="bodyText"
                  label="Body Text"
                  type="textarea"
                  placeholder="Main copy for this content block"
                />
                <Form.Field
                  name="image"
                  label="Image"
                  type="image"
                  helperText="Upload an image for this banner/section"
                />
              </FormSection>
            );
          }}
        </Form.FormWatch>

        <Form.FormWatch name="section">
          {({ value }) => {
            if (value !== "crousel") return null;

            type Slide = NonNullable<FormValues["items"]>[number];
            const defaultSlide: Slide = {
              title: "",
              bodyText: "",
              image: "",
              ctaLabel: "",
              ctaLink: "",
            };

            return (
              <>
                <Separator className="my-6" />
                <FormSection
                  title="Crousel Slides"
                  description="Add multiple slides (image + title + description + optional link)."
                >
                  <EnsureCrouselItems defaultSlide={defaultSlide} />

                  <Form.FormGroup name="items">
                    {({ index, add, remove, length }) => (
                      <FormItem key={index} className="bg-card rounded-xl border p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Form.Field
                            name={`items.${index}.image`}
                            label="Slide Image"
                            type="image"
                            helperText="Upload slide image"
                          />
                          <div className="space-y-4">
                            <Form.Field
                              name={`items.${index}.title`}
                              label="Title"
                              type="text"
                              placeholder="Slide title"
                            />
                            <Form.Field
                              name={`items.${index}.bodyText`}
                              label="Description"
                              type="textarea"
                              placeholder="Slide description"
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Form.Field
                                name={`items.${index}.ctaLabel`}
                                label="Link Label"
                                type="text"
                                placeholder="e.g. Shop Now"
                              />
                              <Form.Field
                                name={`items.${index}.ctaLink`}
                                label="Link URL"
                                type="text"
                                placeholder="/store or https://..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button type="button" size="icon" onClick={() => add(defaultSlide)}>
                            <Plus />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            disabled={length <= 1}
                            onClick={() => remove(index)}
                          >
                            <Minus />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  </Form.FormGroup>
                </FormSection>
              </>
            );
          }}
        </Form.FormWatch>

        <Separator className="my-6" />

        <Form.FormWatch name="section">
          {({ value }) => {
            if (value === "crousel") return null;
            return (
              <FormSection title="Links & Actions" description="Connect this content to actions or products">
                <Form.Field name="ctaLabel" label="CTA Label" type="text" placeholder="e.g. Shop Now, Learn More" />
                <Form.Field
                  name="ctaLink"
                  label="CTA Link"
                  type="text"
                  placeholder="https:// or internal path like /store"
                />
                <Form.Field
                  name="productLink"
                  label="Product View/Buy Link"
                  type="text"
                  placeholder="/store/category/subcategory/variant or any URL"
                />
              </FormSection>
            );
          }}
        </Form.FormWatch>

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
