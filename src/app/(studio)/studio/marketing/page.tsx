import type { Route } from "next";
import { redirect } from "next/navigation";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Marketing",
  description: "Marketing tools and content management",
};

export default async function MarketingPage() {
  return redirect(PATH.STUDIO.MARKETING.CONTENT.ROOT as Route);
}
