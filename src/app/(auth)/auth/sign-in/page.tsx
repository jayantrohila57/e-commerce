import { getServerSession } from "@/core/auth/auth.server";
import { SignInForm } from "@/module/auth/auth.sign-in";
import Shell from "@/shared/components/layout/shell";
import { redirect } from "next/navigation";
import { PATH } from "@/shared/config/routes";
import { AuthProviders } from "@/module/auth/auth.providers";
import { Separator } from "@/shared/components/ui/separator";
import { AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";

export const metadata = {
  title: "Sign In",
  description: "Sign In to your account",
};
export default async function SignInPage() {
  const { session } = await getServerSession();
  if (session != null) redirect(PATH.ROOT);

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={<AuthFooterNote hint="New here?" action="Create an account" href={PATH.AUTH.SIGN_UP} />}
      >
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
