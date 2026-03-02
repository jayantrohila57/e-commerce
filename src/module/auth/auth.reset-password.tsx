"use client";

import type z from "zod/v3";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/core/auth/auth.client";
import { PATH } from "@/shared/config/routes";
import { AuthSchema } from "./auth-schema";
import Form from "@/shared/components/form/form";
import { useTransition } from "react";
import { Separator } from "@/shared/components/ui/separator";

type FormValues = z.infer<typeof AuthSchema.CHANGE_PASSWORD.INPUT>;

export default function ResetPasswordForm({ token, error }: { token: string; error: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      if (token == null) return;

      await resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to reset password");
          },
          onSuccess: () => {
            toast.success("Password reset successful", {
              description: "Redirection to login...",
            });
            setTimeout(() => {
              router.push(PATH.AUTH.SIGN_IN);
            }, 1000);
          },
        },
      );
    });
  }

  if (token == null || error != null) {
    return (
      <div className="my-6 px-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>The password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href={PATH.AUTH.SIGN_IN}>Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form
      defaultValues={{
        password: "",
        confirmPassword: "",
        token: token,
        oldPassword: null,
        userId: null,
      }}
      schema={AuthSchema.CHANGE_PASSWORD.INPUT}
      onSubmitAction={onSubmit}
      className="grid h-auto grid-cols-1 gap-4 p-1"
    >
      <Form.Field
        {...{
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "********",
          needValidation: true,
        }}
      />
      <Form.Field
        {...{
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "********",
        }}
      />
      <Separator />
      <Form.Submit disabled={pending} isLoading={pending} />
    </Form>
  );
}
