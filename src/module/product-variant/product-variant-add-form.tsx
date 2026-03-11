"use client";

import { Minus, Plus } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { FormItem } from "@/shared/components/common/form";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { clientEnv } from "@/shared/config/env.client";
import { PATH } from "@/shared/config/routes";
import { productVariantContract } from "./product-variant.schema";

const formSchema = productVariantContract.create.input;
type FormValues = z.infer<typeof formSchema>;

interface VariantFormProps {
  productSlug: string;
  productId: string;
  defaultAttributes?: { title: string; type: string; value: string }[];
}

function parseSelectOptions(raw: string) {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(parts));
}

export default function VariantForm({ productSlug, productId, defaultAttributes = [] }: VariantFormProps) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState(false);

  const createVariant = apiClient.productVariant.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.PRODUCTS.VIEW(productSlug) as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
      setIsLoading(false);
    },

    onError: ({ message }) => {
      toast.error(message || "Error while creating variant", { id: toastId });
      setToastId("");
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    const id = toast.loading("Creating variant with inventory...");
    setToastId(id);
    setIsLoading(true);

    createVariant.mutate({
      body: {
        productId,
        slug: data.body.slug,
        title: data.body.title,
        priceModifierType: data.body.priceModifierType,
        priceModifierValue: data.body.priceModifierValue,
        attributes: data.body.attributes,
        media: data.body.media,
        inventory: {
          sku: data.body.inventory.sku,
          barcode: data.body.inventory.barcode,
          quantity: data.body.inventory.quantity,
          incoming: data.body.inventory.incoming,
          reserved: data.body.inventory.reserved,
        },
      },
    });
  }

  return (
    <Form
      defaultValues={{
        body: {
          productId,
          slug: "",
          title: "",
          priceModifierType: "flat_increase",
          priceModifierValue: "0",
          attributes: defaultAttributes.map((a) => ({
            title: a.title,
            type: a.type,
            value: a.value,
          })),
          media: [
            {
              url: "",
            },
          ],
          inventory: {
            sku: "",
            barcode: "",
            quantity: 0,
            incoming: 0,
            reserved: 0,
          },
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-4 p-4"
    >
      <div className="col-span-4 space-y-6">
        <FormSection title="Basic Info" description="Define your variant identity">
          <Form.Field
            {...{
              name: "body.title",
              label: "Variant Title",
              type: "text",
              placeholder: "e.g. 128GB / Black",
              required: true,
            }}
          />

          <Form.Field
            {...{
              name: "body.slug",
              label: "Slug",
              type: "slug",
              slugField: "body.title",
              inlinePrefix: `${clientEnv.NEXT_PUBLIC_BASE_URL}/product/${productSlug}/`,
              required: true,
              placeholder: "variant-name",
              description: "URL-friendly identifier for the variant",
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Pricing Logic" description="Control how this variant modifies base price">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.priceModifierType",
                label: "Price Modifier Type",
                type: "select",
                required: true,
                options: [
                  { label: "Flat Increase", value: "flat_increase" },
                  { label: "Flat Decrease", value: "flat_decrease" },
                  { label: "Percent Increase", value: "percent_increase" },
                  { label: "Percent Decrease", value: "percent_decrease" },
                ],
              }}
            />

            <Form.Field
              {...{
                name: "body.priceModifierValue",
                label: "Modifier Value",
                type: "number",
                required: true,
                description: "Value depends on modifier type (amount or %)",
                placeholder: "0",
              }}
            />
          </div>
        </FormSection>
        <Separator className="my-4" />

        <FormSection title="Media" description="Add images specific to this variant">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.FormGroup name="body.media">
              {({ index, add, remove, length }) => (
                <FormItem key={index} className="flex flex-row items-center justify-center gap-4">
                  <div className="h-full min-h-80 w-full">
                    <Form.Field
                      {...{
                        name: `body.media.${index}.url`,
                        label: "Variant Media",
                        type: "image",
                        description: "Upload product images for this variant",
                      }}
                    />
                  </div>

                  <div className="flex items-start justify-start gap-2 pt-5">
                    <Button
                      key={`body.media.${index}.remove`}
                      disabled={index === length - 1}
                      hidden={index === length - 1}
                      type="button"
                      variant={"destructive"}
                      size={"icon"}
                      onClick={() => remove(index)}
                    >
                      <Minus />
                    </Button>
                    <Button
                      key={`body.media.${index}.add`}
                      type="button"
                      disabled={index !== length - 1}
                      hidden={index !== length - 1}
                      size={"icon"}
                      onClick={() =>
                        add({
                          url: "",
                        })
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                </FormItem>
              )}
            </Form.FormGroup>
          </div>
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title={`Attributes (${defaultAttributes.length})`}
          description="Configure variant-specific attributes."
        >
          {defaultAttributes.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {defaultAttributes.map((attr, index) => {
                const baseName = `body.attributes.${index}` as const;
                const selectOptions = attr.type === "select" ? parseSelectOptions(attr.value) : [];

                if (attr.type === "boolean") {
                  return (
                    <Form.Field
                      key={`${attr.title}-${attr.type}-${index}`}
                      name={`${baseName}.value`}
                      label={attr.title}
                      type="select"
                      placeholder="Select..."
                      options={[
                        { label: "True", value: "true" },
                        { label: "False", value: "false" },
                      ]}
                      helperText={attr.type ? `Type: ${attr.type}` : undefined}
                    />
                  );
                }

                if (attr.type === "select" && selectOptions.length > 1) {
                  return (
                    <Form.Field
                      key={`${attr.title}-${attr.type}-${index}`}
                      name={`${baseName}.value`}
                      label={attr.title}
                      type="select"
                      placeholder="Select..."
                      options={selectOptions.map((v) => ({ label: v, value: v }))}
                      helperText={attr.type ? `Type: ${attr.type}` : undefined}
                    />
                  );
                }

                return (
                  <Form.Field
                    key={`${attr.title}-${attr.type}-${index}`}
                    name={`${baseName}.value`}
                    label={attr.title}
                    type="text"
                    placeholder="Enter value"
                    helperText={attr.type ? `Type: ${attr.type}` : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground px-2 text-sm">
              No default attributes configured. Add attributes in Studio → Catalog → Attributes.
            </p>
          )}
        </FormSection>
        <Separator className="my-4" />

        <FormSection title="Inventory" description="Manage stock levels, SKU, and barcode">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.inventory.sku",
                label: "SKU",
                type: "text",
                required: true,
                placeholder: "e.g. SKU-001-BLK-128GB",
                description: "Unique stock keeping unit identifier",
              }}
            />

            <Form.Field
              {...{
                name: "body.inventory.barcode",
                label: "Barcode / ISBN",
                type: "text",
                placeholder: "e.g. 123456789012",
                description: "Scannable barcode for inventory tracking",
              }}
            />

            <Form.Field
              {...{
                name: "body.inventory.quantity",
                label: "Available Quantity",
                type: "number",
                required: true,
                placeholder: "0",
                description: "Current stock available for sale",
              }}
            />

            <Form.Field
              {...{
                name: "body.inventory.incoming",
                label: "Incoming Quantity",
                type: "number",
                placeholder: "0",
                description: "Stock arriving soon (not available yet)",
              }}
            />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            <p>Review all fields before creating the variant.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Form.Submit label="Create Variant" disabled={isLoading} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </Form>
  );
}
