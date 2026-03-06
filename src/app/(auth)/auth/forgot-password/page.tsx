import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { ForgotPasswordForm } from "@/module/auth/auth.forgot-password";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};
export default async function ForgotPasswordPage() {
  const { session } = await getServerSession();
  if (session) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="Need to sign in your account?" action="Sign in" href={PATH.AUTH.SIGN_IN} />}
      >
        <ForgotPasswordForm />
      </AuthCard>
    </Shell>
  );
}
