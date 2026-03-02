import SeriesListingSkeleton from "@/module/series/series-listing-skeleton";
import Section from "@/shared/components/layout/section/section";

export default async function CategoryLoading() {
  return (
    <Section>
      <SeriesListingSkeleton />
    </Section>
  );
}
