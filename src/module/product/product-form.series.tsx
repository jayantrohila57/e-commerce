"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import type { Option } from "@/shared/components/form/form.types";

export function SeriesSelect() {
  const form = useFormContext();
  const value = useWatch({ name: "body.subcategorySlug" });
  const { data: series } = apiClient.series.getMany.useQuery({
    query: {},
  });

  const buildSeriesOptions = (subcategory: string): Option[] => {
    return [
      {
        label: "Select type...",
        value: "select-type",
        disabled: true,
      },
      ...(series?.data
        ?.filter((t) => t.subcategorySlug === subcategory)
        ?.map((t) => ({
          label: t.title,
          value: t.slug,
          icon: t.icon,
        })) ?? []),
    ];
  };

  useEffect(() => {
    if (form && form.getValues("body.seriesSlug")) {
      form.setValue("body.seriesSlug", "");
    }
  }, [value]);

  return (
    <Form.Field
      {...{
        name: "body.seriesSlug",
        label: "Series",
        type: "select",
        description: "Select the series of the post",
        helperText: "The series is used to display the series",
        required: true,
        placeholder: "Select series",
        hidden: !value,
        options: buildSeriesOptions(value),
      }}
    />
  );
}
