import type { Route } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { policyContent } from "./policy-content";

export function LegalPolicyHub() {
  const policies = Object.values(policyContent).filter((p) => p.id !== "legal" && p.sections.length > 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {policies.map((p) => (
        <Link key={p.id} href={p.href as Route} className="block h-full">
          <Card className="motion-all h-full border-border transition-colors hover:border-primary/40 hover:shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="text-primary shrink-0">{p.icon}</span>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <CardDescription className="line-clamp-4">{p.description}</CardDescription>
                  <p className="text-muted-foreground text-xs">Last updated: {p.lastUpdated}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
