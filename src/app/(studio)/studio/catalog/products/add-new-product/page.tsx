import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import ProductForm from "@/module/product/product-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";

export const metadata = {
  title: `Add ${site.name} Product`,
  description: `Create a new product in ${site.name}.`,
};

export default async function Home() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ProductForm />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
