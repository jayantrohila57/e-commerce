import CookieConsent from "@/module/cookies/cookie-consent";
import { ContentAnnouncementBar } from "@/module/site/content-sections";
import { ScrollProgress } from "@/shared/components/common/scroll-progress";
import ScrollToTopButton from "@/shared/components/common/scroll-to-top";
import Footer from "@/shared/components/layout/footer/footer";
import Header from "@/shared/components/layout/header/header";
import Shell from "@/shared/components/layout/shell";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      {/* <PushNotificationPrompt /> */}
      <ScrollProgress />
      <ScrollToTopButton />
      <CookieConsent />
      <Shell.Header>
        <ContentAnnouncementBar page="home" />
        <Header />
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
