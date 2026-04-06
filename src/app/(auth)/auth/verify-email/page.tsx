import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { EmailVerification } from "@/module/auth/auth.verify-email";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email",
};
export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; verified?: string }>;
}) {
  const { email, verified } = await searchParams;
  const { session } = await getServerSession();
  if (session) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="Need to sign in your account?" action="Sign in" href={PATH.AUTH.SIGN_IN} />}
      >
        {verified === "1" ? (
          <Alert>
            <AlertTitle>Email verified</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Thank you. Your email address has been verified successfully.</p>
              <p>You can now sign in to your account.</p>
              <Button asChild className="w-full">
                <Link href={PATH.AUTH.SIGN_IN}>Sign in</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <EmailVerification email={email ?? ""} />
        )}
      </AuthCard>
    </Shell>
  );
}
