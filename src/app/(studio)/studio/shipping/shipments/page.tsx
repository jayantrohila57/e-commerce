import type { Route } from "next";
import { redirect } from "next/navigation";
import { PATH } from "@/shared/config/routes";

export default async function StudioShipmentsRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (typeof v === "string") search.append(key, v);
      });
    } else if (typeof value === "string") {
      search.set(key, value);
    }
  }

  const query = search.toString();
  const target = `${PATH.STUDIO.SHIPPING.ROOT}${query ? `?${query}` : ""}`;

  redirect(target as Route);
}
