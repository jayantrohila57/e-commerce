import type React from "react";
import CookieConsent from "@/module/cookies/cookie-consent";
import { ScrollProgress } from "@/shared/components/common/scroll-progress";
import ScrollToTopButton from "@/shared/components/common/scroll-to-top";
import Footer from "@/shared/components/layout/footer/footer";
import Header from "@/shared/components/layout/header/header";
import AccountPageLayout from "@/shared/components/layout/section/account-page-layout";
import { SubNavHeader } from "@/shared/components/layout/section/section.header";
import Shell from "@/shared/components/layout/shell";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <ScrollProgress />
      <ScrollToTopButton />
      <CookieConsent />
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section className="flex min-h-0 flex-1 flex-col">
          <SubNavHeader />
          <AccountPageLayout>{children}</AccountPageLayout>
        </Shell.Section>
      </Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
