import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { AuthPageComponent } from "@/module/auth/auth.page";
import { AuthCard } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";

export const metadata = {
  title: `Join ${site.name}`,
  description: `Get started with ${site.name}.`,
};

export default async function AuthPage() {
  const { session } = await getServerSession();
  if (session) redirect(PATH.SITE.ROOT);
  return (
    <Shell>
      <AuthCard {...metadata}>
        <AuthPageComponent />
      </AuthCard>
    </Shell>
  );
}
