import { Mail, MapPin, Phone } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { supportContactSummary, supportQuickLinks } from "./support-content";

export function SupportQuickLinkGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {supportQuickLinks.map((item) => (
        <Link key={item.href} href={item.href as Route} className="block h-full">
          <Card className="motion-all h-full transition-colors hover:border-primary/40 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function SupportContactPanel() {
  const { email, phone, hours, address } = supportContactSummary();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <Mail className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <CardTitle className="text-base">Email</CardTitle>
            <CardDescription>
              <a className="text-foreground hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <Phone className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <CardTitle className="text-base">Phone</CardTitle>
            <CardDescription>
              <a className="text-foreground hover:underline" href={`tel:${phone.replace(/\D/g, "")}`}>
                {phone}
              </a>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <CardTitle className="text-base">Mailing address</CardTitle>
            <CardDescription className="text-pretty">{address}</CardDescription>
            {hours ? <p className="text-muted-foreground mt-2 text-xs">{hours}</p> : null}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
