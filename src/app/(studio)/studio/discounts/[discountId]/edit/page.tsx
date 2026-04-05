import { forbidden, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { DiscountForm } from "@/module/discount/discount-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Edit discount",
  description: "Edit an existing discount or coupon code",
};

export default async function StudioDiscountEditPage({ params }: { params: { discountId: string } }) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { discountId } = params;

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...metadata}>
          <DiscountForm mode="edit" id={discountId} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
