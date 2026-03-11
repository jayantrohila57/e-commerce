"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/core/api/api.client";
import { FormSection } from "@/shared/components/form/form.helper";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/lib/utils";
import AttributeCard from "./attribute.component.card";
import type { AttributeSelect } from "./attribute.schema";

export default function AttributesSection({ initialAttributes }: { initialAttributes: AttributeSelect[] }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const queryInput = {
    query: {
      limit: 100,
      offset: 0,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    },
  };

  const isDefaultKey = !debouncedSearch;

  const { data, isFetching } = apiClient.attribute.getMany.useQuery(queryInput, {
    ...(isDefaultKey
      ? {
          initialData: {
            status: "success" as const,
            message: "Attributes retrieved",
            data: initialAttributes,
          },
        }
      : {}),
  });

  const attributes = data?.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <FormSection
        title={`All Attributes (${attributes.length})`}
        description="Search and manage attributes across your catalog"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug, or value…"
              className="sm:max-w-md"
            />
          </div>
          <div className={cn("text-muted-foreground text-xs", isFetching && "animate-pulse")}>
            {isFetching ? "Refreshing…" : "Up to date"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {attributes.length ? (
            attributes.map((a) => <AttributeCard key={a.id} attribute={a} />)
          ) : (
            <p className="text-muted-foreground px-2 text-sm">
              No attributes found. Try adjusting filters or create a new attribute.
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
}
