import type React from "react";
import { ScrollProgress } from "@/shared/components/common/scroll-progress";
import ScrollToTopButton from "@/shared/components/common/scroll-to-top";
import Footer from "@/shared/components/layout/footer/footer";
import Header from "@/shared/components/layout/header/header";
import { SubNavHeader } from "@/shared/components/layout/section/section.header";
import Shell from "@/shared/components/layout/shell";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <ScrollProgress />
      <ScrollToTopButton />
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section>
          <SubNavHeader />
          {children}
        </Shell.Section>
      </Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
