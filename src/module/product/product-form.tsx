"use client";

import { InfoIcon, Minus, Plus } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { FormItem } from "@/shared/components/common/form";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { STATUS } from "@/shared/config/api.config";
import { clientEnv } from "@/shared/config/env.client";
import { statusOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { productContract } from "./product.schema";
import { CategorySelect } from "./product-form.category";
import { SubCategorySelect } from "./product-form.subcategory";
import { ProductPdpPreview } from "./product-pdp-preview";

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
        description: data.body.description,
        isActive: data.body.isActive ?? true,
        basePrice: data.body.basePrice,
        baseCurrency: data.body.baseCurrency,
        features: data.body.features,
        categorySlug: data.body.categorySlug,
        subcategorySlug: data.body.subcategorySlug,
        status: data.body.status,
        baseImage: data.body.baseImage,
        metaTitle: data.body.metaTitle || data.body.title,
        metaDescription: data.body.metaDescription || data.body.description,
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
      className="grid h-full grid-cols-4"
    >
      <Tabs defaultValue="form" className="col-span-4 w-full justify-start items-start h-full grid grid-cols-12">
        <TabsList className="col-span-12 w-full justify-end items-center">
          <TabsTrigger value="form" className="max-w-60">
            Product Form
          </TabsTrigger>
          <TabsTrigger value="preview" className="max-w-60">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="col-span-12 h-full w-full">
          <div className="col-span-4 h-full w-full">
            <FormSection title="Basic Information" description="Enter product information">
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

            <FormSection title="SEO Information" description="Optimize your product for search engines">
              <Form.Field
                {...{
                  name: "body.metaTitle",
                  label: "Meta Title",
                  type: "text",
                  placeholder: "Enter meta title",
                  description: "The title that appears in search engine results",
                }}
              />
              <Form.Field
                {...{
                  name: "body.metaDescription",
                  label: "Meta Description",
                  type: "textarea",
                  placeholder: "Enter meta description",
                  description: "The summary that appears in search engine results",
                }}
              />
            </FormSection>

            <FormSection title="Product Media" description="Upload the media of the product">
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

            <FormSection
              title="Product Category and Subcategory"
              description="Select the category and subcategory of the product"
            >
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <CategorySelect />
                <SubCategorySelect />
              </div>
            </FormSection>

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
                <Form.Field
                  {...{
                    name: "body.baseCurrency",
                    label: "Currency",
                    type: "select",
                    required: true,
                    options: [
                      { label: "INR", value: "INR" },
                      { label: "USD", value: "USD" },
                    ],
                  }}
                />
              </div>
            </FormSection>

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
          <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-4">
            <Form.StatusBadge />
            <div className="flex flex-row items-center gap-2">
              <Button variant="outline" type="button">
                {"Save Draft"}
              </Button>
              <Form.Submit disabled={createProduct.isPending} isLoading={createProduct.isPending} />
            </div>
          </div>
          <div className="col-span-4 w-full my-10">
            <Alert>
              <InfoIcon className="h-5 w-5" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                <ul className="list-disc ">
                  <li>
                    Please make sure to fill out all required fields accurately to help us process your product
                    efficiently.
                  </li>
                  <li>Use clear and descriptive titles and descriptions for your product.</li>
                  <li>
                    You may add features to highlight what makes your product unique. Click the{" "}
                    <Plus className="inline h-3 w-3" /> button to add more features.
                  </li>
                  <li>Only the most recent changes will be saved when you submit the form.</li>
                  <li>If you are unsure about any section, you can save your progress as a draft and return later.</li>
                  <li>The product preview shown is for reference purposes and may change after submission.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="col-span-12 h-full w-full">
          <Form.FormWatch name="body">
            {({ value }) => <ProductPdpPreview data={value as z.infer<typeof productContract.create.input>["body"]} />}
          </Form.FormWatch>
        </TabsContent>
      </Tabs>
    </Form>
  );
}
