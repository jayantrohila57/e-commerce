import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { EmailVerification } from "@/module/auth/auth.verify-email";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email",
};
export default async function VerifyEmail({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const { email } = await searchParams;
  const { session } = await getServerSession();
  if (session) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="Need to sign in your account?" action="Sign in" href={PATH.AUTH.SIGN_IN} />}
      >
        <EmailVerification email={email} />
      </AuthCard>
    </Shell>
  );
}
