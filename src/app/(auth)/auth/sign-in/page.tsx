import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { AuthProviders } from "@/module/auth/auth.providers";
import { SignInForm } from "@/module/auth/auth.sign-in";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Shell from "@/shared/components/layout/shell";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Sign In",
  description: "Sign In to your account",
};
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; email?: string }>;
}) {
  const { verified, email } = await searchParams;
  const { session } = await getServerSession();
  if (session != null) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="New here?" action="Create an account" href={PATH.AUTH.SIGN_UP} />}
      >
        {verified === "1" && (
          <Alert>
            <AlertTitle>Signup complete</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                {email ? (
                  <>
                    <strong>{email}</strong> has been verified successfully.
                  </>
                ) : (
                  <>Your email has been verified successfully.</>
                )}
              </p>
              <p>You can now sign in with your password.</p>
            </AlertDescription>
          </Alert>
        )}
        <SignInForm />
        <div className="grid grid-cols-11 items-center justify-center">
          <Separator className="col-span-5" />
          <span className="text-muted-foreground col-span-1 w-full text-center text-xs">or</span>
          <Separator className="col-span-5" />
        </div>
        <AuthProviders />
      </AuthCard>
    </Shell>
  );
}
