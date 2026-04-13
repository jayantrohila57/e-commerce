import { HelpCircle, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import { ContentEmpty } from "@/shared/components/common/content-empty";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export function FAQSection({ data }: { data: { id: string; title: string; content: string; icon: LucideIcon }[] }) {
  if (!data.length) {
    return (
      <ContentEmpty
        icon={HelpCircle}
        title="No questions listed yet"
        description="FAQ content will appear here when it is published. You can still reach our support team for help."
        primaryAction={{ label: "Contact support", href: PATH.SITE.SUPPORT.CONTACT as Route }}
        secondaryAction={{ label: "Help center", href: PATH.SITE.SUPPORT.HELP_CENTER as Route }}
      />
    );
  }

  const defaultOpen = data[0]?.id ?? "1";
  return (
    <Card className="grid grid-cols-1 overflow-hidden lg:grid-cols-2">
      <CardContent className="bg-muted/40 flex min-h-[280px] items-center justify-center p-0 lg:min-h-[420px]">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center" aria-hidden>
          <span className="text-primary text-4xl font-semibold tracking-tight">?</span>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Answers to the questions shoppers ask most — orders, delivery, returns, and account help.
          </p>
        </div>
      </CardContent>
      <CardContent className="flex h-full w-full flex-col gap-2 p-4 md:p-6">
        <Accordion type="single" collapsible className="w-full gap-4" defaultValue={defaultOpen}>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Frequently asked questions</h2>
          <p className="text-muted-foreground text-sm">Here are some of the most common questions we get asked.</p>
          {data.map((item) => (
            <AccordionItem
              value={item.id}
              key={item.id}
              className="group motion-all mt-4 cursor-pointer p-4 text-balance shadow-none"
            >
              <AccordionTrigger>
                <div className="flex flex-row items-center justify-start gap-2">
                  <item.icon className="text-primary" />
                  <CardTitle className="text-2xl font-semibold">{item.title}</CardTitle>
                </div>
              </AccordionTrigger>
              <AccordionContent className="motion-all">{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
