import type React from "react";
import { SubNavHeader } from "@/shared/components/layout/section/section.header";

/**
 * Store-only chrome: breadcrumbs + back control. Shared site shell (header, footer,
 * cookie consent, etc.) comes from `(site)/layout.tsx`.
 */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubNavHeader />
      {children}
    </>
  );
}
