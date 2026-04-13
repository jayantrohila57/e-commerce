import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { DiscountForm } from "@/module/discount/discount-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Edit discount",
  description: "Edit an existing discount or coupon code",
};

export default async function StudioDiscountEditPage({ params }: PageProps<"/studio/discounts/[discountId]/edit">) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { discountId } = await params;

  const res = await apiServer.discount.get({
    params: { id: discountId },
  });

  if (res.status !== STATUS.SUCCESS || !res.data) {
    notFound();
  }

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...metadata}>
          <DiscountForm mode="edit" id={discountId} initial={res.data} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
