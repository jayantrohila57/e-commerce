import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingProviderForm } from "@/module/shipping-config/shipping-provider-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    providerId: string;
  }>;
}

export default async function EditShippingProviderPage({ params }: PageProps) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) {
    redirect(PATH.SITE.FORBIDDEN);
  }

  const { providerId } = await params;

  const providers = await apiServer.shippingConfig.listProviders({});
  const provider = providers.data?.find((p) => p.id === providerId) ?? null;

  if (!provider) {
    notFound();
  }

  const metadata = {
    title: "Edit Shipping Provider",
    description: `Edit provider “${provider.name}”`,
  };

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingProviderForm mode="edit" providerId={providerId} initialData={provider} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
