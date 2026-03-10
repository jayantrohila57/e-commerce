import type { Route } from "next";
import { FormSection } from "@/shared/components/form/form.helper";
import { PATH } from "@/shared/config/routes";
import type { GetManySeriesOutput } from "./series.types";
import { SeriesCard } from "./series-card";

type SeriesSectionProps = {
  categorySlug: string;
  subcategorySlug: string;
  title: string;
  description: string;
  series: GetManySeriesOutput["data"];
  emptyMessage?: string;
};

export const SeriesSection = ({
  categorySlug,
  subcategorySlug,
  title,
  description,
  series,
  emptyMessage = "No series",
}: SeriesSectionProps) => (
  <FormSection title={`${title} (${series?.length || 0})`} description={description}>
    <div className="grid grid-cols-1 gap-2">
      {(series ?? [])?.length > 0 ? (
        series?.map((srs) => (
          <SeriesCard
            key={srs.id}
            href={PATH.STUDIO.SERIES.ROOT(categorySlug, subcategorySlug, srs.slug) as Route}
            data={srs}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
);
