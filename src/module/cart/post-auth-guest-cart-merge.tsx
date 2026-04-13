"use client";

import { useEffect, useRef } from "react";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { getOrGenerateSessionId } from "@/shared/utils/lib/sessionId";

/**
 * After any login (email or OAuth), merges the browser guest cart into the user cart.
 * Runs once per authenticated user id per tab until session clears.
 */
export function PostAuthGuestCartMerge() {
  const { data: session } = useSession();
  const utils = apiClient.useUtils();
  const { mutateAsync: mergeGuestCart } = apiClient.cart.merge.useMutation();
  const lastMergedUserId = useRef<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      lastMergedUserId.current = null;
      return;
    }
    if (lastMergedUserId.current === userId) return;

    const sessionId = getOrGenerateSessionId();
    if (!sessionId) return;

    lastMergedUserId.current = userId;
    void mergeGuestCart({ body: { sessionId } })
      .then((res) => {
        if (res.status === "success") {
          void utils.cart.get.invalidate();
          void utils.cart.getTotals.invalidate();
        }
      })
      .catch(() => {
        lastMergedUserId.current = null;
      });
  }, [mergeGuestCart, session?.user?.id, utils.cart.get, utils.cart.getTotals]);

  return null;
}
