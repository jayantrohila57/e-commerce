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
import { statusOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { productContract } from "./product.schema";
import type { ProductUpdate } from "./product.types";
import { CategorySelect } from "./product-form.category";
import { SubCategorySelect } from "./product-form.subcategory";

const formSchema = productContract.update.input;
type FormValues = z.infer<typeof formSchema>;

export default function ProductEditForm({ product }: { product: ProductUpdate | null }) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const updateProduct = apiClient.product.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.PRODUCTS.ROOT as Route);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while updating the product", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: FormValues) {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    setToastId("");
    const id = toast.loading("Updating product...");
    setToastId(id);

    updateProduct.mutate({
      params: {
        id: String(product?.id),
      },
      body: {
        title: data.body.title,
        slug: data.body.slug,
        description: data.body.description || undefined,
        metaTitle: data.body.title || undefined,
        metaDescription: data.body.description || undefined,
        isActive: data.body.isActive,
        basePrice: data.body.basePrice,
        baseCurrency: data.body.baseCurrency,
        features: data.body.features,
        categorySlug: data.body.categorySlug,
        subcategorySlug: data.body.subcategorySlug,
        status: data.body.status,
        baseImage: data.body.baseImage,
      },
    });
  }

  return (
    <Form
      defaultValues={{
        params: {
          id: String(product?.id),
        },
        body: {
          title: product?.title ?? "",
          slug: product?.slug ?? "",
          description: product?.description ?? "",
          metaTitle: product?.metaTitle ?? "",
          metaDescription: product?.metaDescription ?? "",
          categorySlug: product?.categorySlug ?? "",
          subcategorySlug: product?.subcategorySlug ?? "",
          isActive: product?.isActive ?? true,
          basePrice: product?.basePrice ?? 0,
          baseCurrency: product?.baseCurrency ?? "INR",
          baseImage: product?.baseImage ?? "",
          features: product?.features?.length ? product.features : [{ title: "" }],
          status: product?.status ?? "draft",
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection title="Product Details" description="Update product information">
          <Form.Field
            {...{
              name: "body.title",
              label: "Title",
              type: "text",
              placeholder: "Enter product title",
              required: true,
            }}
          />

          <Form.Field
            {...{
              name: "body.slug",
              label: "Slug",
              type: "slug",
              slugField: "body.title",
              inlinePrefix: `${clientEnv.NEXT_PUBLIC_BASE_URL}/product/`,
              required: true,
              placeholder: "Enter slug",
            }}
          />

          <Form.Field
            {...{
              name: "body.description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter product description",
            }}
          />
        </FormSection>

        <FormSection title="Image" description="Upload product image">
          <Form.Field
            {...{
              name: "body.baseImage",
              label: "Image",
              type: "image",
              required: true,
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Product Category and Subcategory" description="Select how this product is organised">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <CategorySelect />
            <SubCategorySelect />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Product Price" description="Enter product pricing">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.basePrice",
                label: "Base Price",
                type: "currency",
                prefixCurrency: "₹",
                postfixCurrency: "INR",
                placeholder: "Enter base price",
                required: true,
              }}
            />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Status" description="Control product visibility">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.status",
                label: "Status",
                type: "select",
                options: [
                  { label: "Select type...", value: "select-type", disabled: true },
                  ...statusOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />

            <Form.Field
              {...{
                name: "body.isActive",
                label: "Active",
                type: "switch",
              }}
            />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <FormSection title="Product Features" description="Add product features">
          <Form.FormGroup name="body.features">
            {({ index, add, remove, length }) => (
              <FormItem key={index} className="flex flex-row items-center justify-center gap-4">
                <div className="w-full">
                  <Form.Field
                    {...{
                      name: `body.features.${index}.title`,
                      label: "Title",
                      type: "text",
                      placeholder: "Feature title",
                    }}
                  />
                </div>

                <div className="flex gap-2 pt-5">
                  <Button
                    type="button"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => remove(index)}
                    hidden={length === 1}
                  >
                    <Minus />
                  </Button>

                  {index === length - 1 && (
                    <Button
                      type="button"
                      size={"icon"}
                      onClick={() =>
                        add({
                          title: "",
                        })
                      }
                    >
                      <Plus />
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          </Form.FormGroup>
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-0 py-4">
        <Form.StatusBadge />

        <div className="flex flex-row items-center gap-2">
          <Button variant="outline" type="button">
            Save Draft
          </Button>

          <Form.Submit disabled={updateProduct.isPending} isLoading={updateProduct.isPending} />
        </div>
      </div>
    </Form>
  );
}
