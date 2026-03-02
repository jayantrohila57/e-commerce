"use client";

import Form from "@/shared/components/form/form";
import { apiClient } from "@/core/api/api.client";
import type { Option } from "@/shared/components/form/form.types";

export function CategorySelect() {
  const { data: categories } = apiClient.category.getMany.useQuery({
    query: {},
  });

  const buildCategoryOptions = (): Option[] => {
    return [
      {
        label: "Select type...",
        value: "select-type",
        disabled: true,
      },
      ...(categories?.data?.map((t) => ({
        label: t.title,
        value: t.slug,
        icon: t.icon,
      })) || []),
    ];
  };
  return (
    <Form.Field
      {...{
        name: "body.categorySlug",
        label: "Category",
        type: "select",
        description: "Select the category of the post",
        helperText: "The category is used to display the category",
        required: true,
        placeholder: "Select category",
        options: buildCategoryOptions(),
      }}
    />
  );
}
