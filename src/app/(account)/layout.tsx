import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { PATH } from "@/shared/config/routes";
import { safeAuthCallbackPath, signInUrlWithCallback } from "@/shared/utils/auth-callback";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { session } = await getServerSession();
  if (session) return children;

  const h = await headers();
  const intended = safeAuthCallbackPath(h.get("x-intended-path") ?? undefined) ?? (PATH.ACCOUNT.ROOT as Route);
  redirect(signInUrlWithCallback(intended) as Route);
}
