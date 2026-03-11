"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import type { Option } from "@/shared/components/form/form.types";

export function SubCategorySelect() {
  const form = useFormContext();
  const value = useWatch({ name: "body.categorySlug" });
  const { data: subcategories } = apiClient.subcategory.getMany.useQuery({
    query: {},
  });

  const buildSubcategoryOptions = (category: string): Option[] => {
    return [
      {
        label: "Select type...",
        value: "select-type",
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

  useEffect(() => {
    if (form && form.getValues("body.subcategorySlug")) {
      form.setValue("body.subcategorySlug", "");
    }
  }, [value]);

  return (
    <Form.Field
      {...{
        name: "body.subcategorySlug",
        label: "Subcategory",
        type: "select",
        description: "Select the subcategory of the post",
        helperText: "The subcategory is used to display the subcategory",
        required: true,
        placeholder: "Select subcategory",
        hidden: !value,
        options: buildSubcategoryOptions(value),
      }}
    />
  );
}
