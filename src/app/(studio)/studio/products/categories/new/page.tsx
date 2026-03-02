import { HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { redirect } from "next/navigation";
import CategoryForm from "@/module/category/category.component.form";

export const metadata = {
  title: "Add Category",
  description: "Add new category",
};

export default async function Home() {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <CategoryForm />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
