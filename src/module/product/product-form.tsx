"use client";

import { Minus, Plus } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { FormItem } from "@/shared/components/ui/form";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS } from "@/shared/config/api.config";
import { clientEnv } from "@/shared/config/env.client";
import { statusOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { productContract } from "./product.schema";
import { CategorySelect } from "./product-form.category";
import { SeriesSelect } from "./product-form.series";
import { SubCategorySelect } from "./product-form.subcategory";

const formSchema = productContract.create.input;

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm() {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const createProduct = apiClient.product.create.useMutation({
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
      toast.error(message || "An error occurred while creating the product", { id: toastId });
      setToastId("");
    },
  });

  function onSubmit(data: FormValues) {
    setToastId("");
    const id = toast.loading("Creating product...");
    setToastId(id);
    createProduct.mutate({
      body: {
        title: data.body.title,
        slug: data.body.slug,
        description: data.body.description || undefined,
        metaTitle: data.body.title || undefined,
        metaDescription: data.body.description || undefined,
        seriesSlug: data.body.seriesSlug,
        isActive: data.body.isActive ?? true,
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
        body: {
          title: "",
          slug: "",
          description: "",
          metaTitle: "",
          metaDescription: "",
          seriesSlug: "phone-cases-series-1",
          categorySlug: "",
          subcategorySlug: "",
          isActive: true,
          basePrice: 0,
          baseCurrency: "INR",
          baseImage: "",
          features: [
            {
              title: "",
            },
          ],
          status: "draft",
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection title="Product Details" description="Enter product information">
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
              description: "Enter the slug of the product",
              helperText: "The slug is used to generate the URL of the product",
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
        <FormSection title="Image" description="Upload the image of the category">
          <Form.Field
            {...{
              name: "body.baseImage",
              label: "Image",
              type: "image",
              description: "Upload the image of the category",
              helperText:
                "After selecting, click the upload icon to attach the imageThe image is used to generate the meta image of the category",
              required: true,
              placeholder: "Upload image",
            }}
          />
        </FormSection>

        <Separator className="my-4" />
        <Separator className="my-4" />

        <FormSection
          title="Product Category, Subcategory and Series"
          description="Select the category, subcategory and series of the product"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <CategorySelect />
            <SubCategorySelect />
            <SeriesSelect />
          </div>
        </FormSection>

        <Separator className="my-4" />
        <FormSection title="Product Price" description="Enter product price" className="space-y-4">
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

        <FormSection title="Status" description="Control product visibility" className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: "body.status",
                label: "Status",
                type: "select",
                description: "Select the status of the post",
                helperText: "The status is used to generate status of the post",
                required: true,
                placeholder: "Select type",
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
                description: "Set product visibility",
                helperText: "Inactive products will not be visible to customers",
              }}
            />
          </div>
        </FormSection>
        <Separator className="my-4" />
        <FormSection title="Product Features" description="Enter product features" className="space-y-4">
          <Form.FormGroup name="body.features">
            {({ index, add, remove, length }) => (
              <FormItem key={index} className="flex flex-row items-center justify-center gap-4">
                <div className="w-full">
                  <Form.Field
                    key={`body.features.${index}.title`}
                    {...{
                      name: `body.features.${index}.title`,
                      label: "Title",
                      type: "text",
                      placeholder: "Enter feature title",
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-5">
                  <Button
                    key={`body.features.${index}.remove`}
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
                    key={`body.features.${index}.add`}
                    type="button"
                    disabled={index !== length - 1}
                    hidden={index !== length - 1}
                    size={"icon"}
                    onClick={() =>
                      add({
                        title: "",
                      })
                    }
                  >
                    <Plus />
                  </Button>
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
            {"Save Draft"}
          </Button>
          <Form.Submit disabled={createProduct.isPending} isLoading={createProduct.isPending} />
        </div>
      </div>
    </Form>
  );
}
