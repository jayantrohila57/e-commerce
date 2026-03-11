import { PDPSkeleton } from "@/module/product/product-skeleton";
import Section from "@/shared/components/layout/section/section";

export default async function ProductVariantLoading() {
  return (
    <Section>
      <PDPSkeleton />
    </Section>
  );
}
