import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Support tickets",
  description: "Track support conversations and requests.",
};

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <div className="mx-auto flex max-w-lg flex-col gap-4 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              In-app ticket tracking is not available yet. For help with an order or your account, contact us by email
              or browse self‑service topics below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href={PATH.SITE.SUPPORT.CONTACT as Route}>Contact support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={PATH.SITE.SUPPORT.FAQ as Route}>FAQ</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={PATH.SITE.SUPPORT.HELP_CENTER as Route}>Help center</Link>
              </Button>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
