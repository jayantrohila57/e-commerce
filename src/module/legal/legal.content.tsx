"use client";

import { Calendar, Printer, Share2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { policyContent } from "./policy-content";

interface LegalContentProps {
  activeSection: string;
}

export function LegalContent({ activeSection }: LegalContentProps) {
  const content = policyContent[activeSection];

  if (!content) {
    return (
      <Card className="border-border bg-background p-8 shadow-sm">
        <p className="text-muted-foreground">Policy not found.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-primary">{content.icon}</span>
              <h1 className="text-foreground text-2xl font-semibold">{content.title}</h1>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Last updated: {content.lastUpdated}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1">
        {content.sections.map((section, index) => (
          <div key={index} id={`section-${index}`}>
            <h2 className="text-foreground text-lg font-medium">{section.heading}</h2>
            <div className="space-y-4">
              {section.content.map((paragraph: string, pIndex: number) => (
                <p key={pIndex} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {section.list && (
              <ul className="text-muted-foreground my-4 ml-6 list-disc space-y-2">
                {section.list.map((item: string, lIndex: number) => (
                  <li key={lIndex}>{item}</li>
                ))}
              </ul>
            )}

            {index < content.sections.length - 1 && <Separator className="bg-border my-6" />}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter>
        <div className="border-border bg-muted/30 rounded-lg border p-6">
          <h3 className="text-foreground mb-2 text-lg font-medium">Questions?</h3>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            If you have any questions about this policy, please contact our support team.
          </p>
          <Button asChild>
            <Link href={PATH.SITE.CONTACT as Route}>Contact support</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
