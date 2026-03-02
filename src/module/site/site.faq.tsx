import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/components/ui/accordion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";
import Image from "next/image";

export function FAQSection({ data }: { data: { id: string; title: string; content: string; icon: LucideIcon }[] }) {
  return (
    <Card className="grid grid-cols-2">
      <CardContent className="h-full w-full p-0">
        <CardContent className="flex h-auto w-full items-center justify-center overflow-hidden">
          <Image
            src={
              "https://images.unsplash.com/photo-1513118043662-d90fa1fbb315?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=805"
            }
            alt="design"
            width={400}
            height={800}
            className="h-full w-full rounded-md object-cover"
          />
        </CardContent>
      </CardContent>
      <CardContent className="flex h-full w-full flex-col gap-2 p-0">
        <Accordion type="single" collapsible className="w-full gap-4" defaultValue="1">
          <h2 className="text-3xl font-bold">{"Frequently Asked Questions"}</h2>
          <p className="text-muted-foreground">{" Here are some of the most common questions we get asked."}</p>
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
