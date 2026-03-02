"use client";

import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/alert";
import { BadgePercentIcon } from "lucide-react";
import { cn } from "@/shared/utils/lib/utils";
import Link from "next/link";
import { PATH } from "@/shared/config/routes";

type SaleAlertProps = {
  title?: string;
  description?: string;
  percent?: number;
  className?: string;
};

export default function SaleAlert({
  title = "Limited time",
  description = "Grab your favorites before they vanish. Discount applies at checkout.",
  percent = 40,
  className = "",
}: SaleAlertProps) {
  return (
    <Link href={PATH.ROOT}>
      <Alert className={cn("w-auto cursor-pointer", className)}>
        <BadgePercentIcon className="h-5 w-5" />
        <AlertTitle className="text-sm leading-tight font-semibold">
          {title}- {percent}% OFF
        </AlertTitle>
        <AlertDescription className="text-muted-foreground mt-1 text-xs">{description}</AlertDescription>
      </Alert>
    </Link>
  );
}
