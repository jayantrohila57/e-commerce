import "@/shared/styles/globals.css";

import type { Metadata } from "next";
import { TRPCReactProvider } from "@/core/api/api.client";
import RazorpayProvider from "@/core/payment/razorpay.provider";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { ConsentAwareAnalytics } from "@/module/cookies/cookie-analytics";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { organizationJsonLd, websiteJsonLd } from "@/shared/seo/json-ld";
import { JsonLdScript } from "@/shared/seo/json-ld-script";
import { rootMetadataDefaults } from "@/shared/seo/metadata-builders";
import { seoConfig } from "@/shared/seo/seo.config";
import { className, viewport } from "@/shared/utils/methods/font";

export const metadata: Metadata = rootMetadataDefaults();
export { viewport };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={seoConfig.language} suppressHydrationWarning>
      <body suppressHydrationWarning className={className}>
        <JsonLdScript id="jsonld-organization" data={organizationJsonLd()} />
        <JsonLdScript id="jsonld-website" data={websiteJsonLd()} />
        <TRPCReactProvider>
          <ThemeProvider>
            <TooltipProvider>
              <RazorpayProvider>
                {children}
                <ConsentAwareAnalytics />
              </RazorpayProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
