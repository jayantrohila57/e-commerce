import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingMethodForm } from "@/module/shipping-config/shipping-method-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    methodId: string;
  }>;
}

export default async function EditShippingMethodPage({ params }: PageProps) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) {
    redirect(PATH.SITE.FORBIDDEN);
  }

  const { methodId } = await params;

  const [methodsRes, providersRes] = await Promise.all([
    apiServer.shippingConfig.listMethods({}),
    apiServer.shippingConfig.listProviders({}),
  ]);

  const method = methodsRes.data?.find((m) => m.id === methodId) ?? null;
  if (!method) {
    notFound();
  }

  const metadata = {
    title: "Edit Shipping Method",
    description: `Edit method “${method.name}”`,
  };

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingMethodForm
              mode="edit"
              methodId={methodId}
              initialData={method}
              providers={providersRes.data ?? []}
            />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
