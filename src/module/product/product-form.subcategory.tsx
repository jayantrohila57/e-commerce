"use client";

import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import type { Option } from "@/shared/components/form/form.types";

// Placeholder value that should never be submitted
const PLACEHOLDER_VALUE = "";

export function SubCategorySelect() {
  const form = useFormContext();
  const categorySlug = useWatch({ name: "body.categorySlug" });
  const prevCategoryRef = useRef<string | undefined>(undefined);
  const isInitialMount = useRef(true);

  const { data: subcategories } = apiClient.subcategory.getMany.useQuery({
    query: { categorySlug: categorySlug || undefined },
  });

  const buildSubcategoryOptions = (category: string): Option[] => {
    if (!category || category === PLACEHOLDER_VALUE) return [];
    return [
      {
        label: "Select subcategory...",
        value: PLACEHOLDER_VALUE,
        disabled: true,
      },
      ...(subcategories?.data
        ?.filter((t) => t.categorySlug === category)
        ?.map((t) => ({
          label: t.title,
          value: t.slug,
          icon: t.icon,
        })) ?? []),
    ];
  };

  // Only reset subcategory when user changes category (not on initial form load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevCategoryRef.current = categorySlug;
      return;
    }
    if (prevCategoryRef.current !== categorySlug && prevCategoryRef.current !== undefined) {
      form.setValue("body.subcategorySlug", PLACEHOLDER_VALUE);
      prevCategoryRef.current = categorySlug;
    }
  }, [categorySlug, form]);

  return (
    <Form.Field
      {...{
        name: "body.subcategorySlug",
        label: "Subcategory",
        type: "select",
        description: "Select the subcategory of the product",
        helperText: "The subcategory is used to organize products",
        required: true,
        placeholder: "Select subcategory",
        hidden: !categorySlug || categorySlug === PLACEHOLDER_VALUE,
        options: buildSubcategoryOptions(categorySlug ?? ""),
      }}
    />
  );
}
