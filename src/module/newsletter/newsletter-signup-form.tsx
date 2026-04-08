"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  type NewsletterSubscribeState,
  newsletterSubscribeInitialState,
  subscribeToNewsletter,
} from "./newsletter.actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" type="submit" disabled={pending}>
      {pending ? "…" : label}
    </Button>
  );
}

export function NewsletterSignupForm({
  source,
  className,
  submitLabel = "Subscribe",
  inputClassName,
}: {
  source: "footer" | "newsletter_page";
  className?: string;
  submitLabel?: string;
  inputClassName?: string;
}) {
  const [state, formAction] = useFormState<NewsletterSubscribeState, FormData>(
    subscribeToNewsletter,
    newsletterSubscribeInitialState,
  );

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="source" value={source} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
        <Input
          className={inputClassName ?? "flex-1"}
          placeholder="Enter your email"
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-invalid={state.ok === false && state.message ? true : undefined}
          aria-describedby={state.message ? "newsletter-form-hint" : undefined}
        />
        <SubmitButton label={submitLabel} />
      </div>
      {state.message ? (
        <p
          id="newsletter-form-hint"
          className={`text-xs ${state.ok ? "text-muted-foreground" : "text-destructive"}`}
          role={state.ok ? undefined : "alert"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
