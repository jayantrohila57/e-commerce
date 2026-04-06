import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { ForgotPasswordForm } from "@/module/auth/auth.forgot-password";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; email?: string }>;
}) {
  const { sent, email } = await searchParams;
  const { session } = await getServerSession();
  if (session) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="Need to sign in your account?" action="Sign in" href={PATH.AUTH.SIGN_IN} />}
      >
        {sent === "1" ? (
          <Alert>
            <AlertTitle>Reset email sent</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                If <strong>{email ?? "that email address"}</strong> is registered, you should receive a password reset
                email shortly.
              </p>
              <p>Check your inbox and spam folder, then use the link in the email to continue.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <ForgotPasswordForm />
        )}
      </AuthCard>
    </Shell>
  );
}
