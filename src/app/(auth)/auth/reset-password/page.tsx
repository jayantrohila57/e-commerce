import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import ResetPasswordForm from "@/module/auth/auth.reset-password";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password",
};
export default async function ResetPasswordPage({ searchParams }: PageProps<"/auth/reset-password">) {
  const { token, error } = await searchParams;
  const { session } = await getServerSession();
  if (session) redirect(PATH.ROOT);
  if (!token) redirect(PATH.AUTH.FORGOT_PASSWORD);
  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="Need help?" action="Contact support" href={PATH.SITE.CONTACT} />}
      >
        <ResetPasswordForm token={token as string} error={error as string} />
      </AuthCard>
    </Shell>
  );
}
