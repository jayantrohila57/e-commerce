"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type z from "zod/v3";
import { signUp } from "@/core/auth/auth.client";
import Form from "@/shared/components/form/form";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { AuthSchema } from "./auth-schema";

type FormValues = z.infer<typeof AuthSchema.SIGN_UP.INPUT>;

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(data: FormValues) {
    startTransition(async () => {
      const toastId = toast.loading("Signing up");
      const res = await signUp.email(
        { ...data },
        {
          onSuccess: ({ data }) => {
            router.push(`/auth/verify-email?email=${data?.user?.email}`);
            toast.success("Sign up successful", { id: toastId });
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign up", { id: toastId });
          },
        },
      );

      if (res.error == null && !res.data.user.emailVerified) {
        router.push(`/auth/verify-email?email=${res?.data?.user?.email}`);
      }
    });
  }

  function onSubmit(data: FormValues) {
    void handleSubmit({ ...data, email: data?.email?.toLowerCase() });
  }

  return (
    <Form
      defaultValues={{ name: "", email: "", password: "" }}
      schema={AuthSchema.SIGN_UP.INPUT}
      onSubmitAction={onSubmit}
      className="grid h-auto grid-cols-1 gap-4 px-1"
    >
      <Form.Field
        {...{
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Jane Doe",
        }}
      />
      <Form.Field
        {...{
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        }}
      />
      <Form.Field
        {...{
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "********",
          needValidation: true,
        }}
      />

      <Separator />

      <Form.Submit disabled={isPending} isLoading={isPending} />
      <div className="text-muted-foreground flex flex-row flex-wrap items-start justify-start gap-1 text-xs">
        <Shield className="text-muted-foreground mt-0.5 h-3 w-3" />
        By signing up, you agree to our
        <Link href={PATH.SITE.LEGAL.TERMS}>
          <Button className="h-auto p-0 text-xs underline underline-offset-2" size={"sm"} variant={"link"}>
            Terms of Service
          </Button>
        </Link>
        and
        <Link href={PATH.SITE.LEGAL.PRIVACY}>
          <Button size={"sm"} className="h-auto p-0 text-xs underline underline-offset-2" variant={"link"}>
            Privacy Policy
          </Button>
        </Link>
        .
      </div>
    </Form>
  );
}
