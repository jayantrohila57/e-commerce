import { Copyright } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import CardSwap, { Card as CardSwapCard } from "@/shared/components/common/card-swap";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/lib/utils";
import SaleAlert from "../../common/sale-alert";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Separator } from "../../ui/separator";
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="motion-all bg-transparent flex h-full border-b min-h-[740px] w-full grid-cols-1 flex-row p-0 gap-0 md:grid-cols-3">
      <CardContent className="motion-all border-r h-full min-h-[740px] w-full max-w-md p-0 md:col-span-1">
        <CardHeader className="w-full p-4 border-b mb-2">
          <CardTitle className="w-full text-left text-3xl text-balance">{title}</CardTitle>
          <CardDescription className="w-full text-left text-sm text-pretty">{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid h-full w-full gap-4 p-4">
          {children}
          <div className="flex h-full items-center justify-center p-0 pt-4">{footer}</div>
        </CardContent>
        <CardFooter className="mt-auto flex h-auto flex-col items-start justify-start p-4">
          <Alert>
            <AlertTitle>Need help?</AlertTitle>
            <AlertDescription className="flex flex-row flex-wrap gap-1">
              Contact
              <Link
                target="_blank"
                href={"mailto:support@yourapp.com" as Route} // TODO: fix route
                className="underline"
              >
                support@yourapp.com
              </Link>
              or use live chat.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </CardContent>
      <CardContent className="bg-secondary motion-all p-0 relative hidden w-full overflow-hidden md:col-span-2 md:block">
        <SaleAlert className="absolute bottom-5 right-5 z-10" />
        <CardSwap width={1200} height={600} cardDistance={200} verticalDistance={200} delay={200} pauseOnHover={false}>
          {[
            "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1513188447171-ecf00455f051?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1507297448044-a99b358cd06e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1511892549826-a48122d9b258?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1509996458151-27d65fd9c869?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1508853363419-a9263d752c59?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1508270222513-bba3976b0e5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1508160703418-fde5a61fdf38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1507734287543-9db7622389e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
            "https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=100&w=1000",
          ].map((item) => (
            <CardSwapCard key={item}>
              <Image
                src={item}
                alt="Auth Left"
                className="bg-card h-full w-full rounded-md border object-cover"
                width={1920}
                height={1080}
              />
            </CardSwapCard>
          ))}
        </CardSwap>
      </CardContent>
    </Card>
  );
}

export function AuthFooterNote({ hint, action, href }: { hint: string; action: string; href: Route }) {
  return (
    <p className="text-muted-foreground text-center text-sm">
      {hint}{" "}
      <Link href={href} className="text-primary hover:text-primary/80 underline underline-offset-4">
        {action}
      </Link>
    </p>
  );
}

export function AppBrand({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-center text-xs", className)}>
      <Copyright className="inline-block h-3 w-3 mr-1" /> {`Copyright ${new Date().getFullYear()} - ${site.name}`} All
      rights reserved
    </p>
  );
}
