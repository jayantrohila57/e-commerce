"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type z from "zod/v3";
import { requestPasswordReset } from "@/core/auth/auth.client";
import Form from "@/shared/components/form/form";
import { Separator } from "@/shared/components/ui/separator";
import { AuthSchema } from "./auth-schema";

type FormValues = z.infer<typeof AuthSchema.FORGOT_PASSWORD.INPUT>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const options = {
        onError: (error: { error?: { message?: string } }) => {
          toast.error(error.error?.message || "Failed to send password reset email");
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
          router.replace(`/auth/forgot-password?sent=1&email=${encodeURIComponent(data.email)}`);
        },
      } satisfies NonNullable<Parameters<typeof requestPasswordReset>[1]>;

      await requestPasswordReset(
        {
          ...data,
          redirectTo: "/auth/reset-password",
        },
        options,
      );
    });
  }

  return (
    <Form
      defaultValues={{ email: "" }}
      schema={AuthSchema.FORGOT_PASSWORD.INPUT}
      onSubmitAction={onSubmit}
      className="grid h-auto grid-cols-1 gap-4 p-1"
    >
      <Form.Field
        {...{
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        }}
      />
      <Separator />
      <Form.Submit disabled={pending} isLoading={pending} />
    </Form>
  );
}
