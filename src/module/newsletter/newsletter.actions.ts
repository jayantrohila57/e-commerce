"use server";

import { z } from "zod/v3";
import { db } from "@/core/db/db";
import { newsletterSubscriber } from "@/core/db/db.schema";

const emailSchema = z.string().trim().email().max(320);

export type NewsletterSubscribeState = {
  ok: boolean;
  message: string;
};

const initial: NewsletterSubscribeState = { ok: false, message: "" };

export async function subscribeToNewsletter(
  _prev: NewsletterSubscribeState,
  formData: FormData,
): Promise<NewsletterSubscribeState> {
  const rawEmail = formData.get("email");
  const rawSource = formData.get("source");

  const parsed = emailSchema.safeParse(typeof rawEmail === "string" ? rawEmail : "");
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const source =
    typeof rawSource === "string" && rawSource.trim().length > 0 ? rawSource.trim().slice(0, 64) : "website";

  const email = parsed.data.toLowerCase();

  try {
    await db
      .insert(newsletterSubscriber)
      .values({
        id: crypto.randomUUID(),
        email,
        source,
      })
      .onConflictDoNothing({ target: newsletterSubscriber.email });

    return {
      ok: true,
      message: "Thanks — you’re on the list. We’ll email you about launches and offers.",
    };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again in a moment." };
  }
}

export const newsletterSubscribeInitialState: NewsletterSubscribeState = initial;
