import "@/shared/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { TRPCReactProvider } from "@/core/api/api.client";
import RazorpayProvider from "@/core/payment/razorpay.provider";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { className, viewport } from "@/shared/utils/methods/font";
export { viewport };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={className}>
        <TRPCReactProvider>
          <ThemeProvider>
            <TooltipProvider>
              <RazorpayProvider>
                {children}
                <Analytics />
              </RazorpayProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
