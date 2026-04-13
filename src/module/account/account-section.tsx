import type { ComponentProps } from "react";
import Section from "@/shared/components/layout/section/section";

/** Account area: drop the global Section min-height so pages size naturally. */
export function AccountSection(props: ComponentProps<typeof Section>) {
  return <Section isMinHeight={false} {...props} />;
}
