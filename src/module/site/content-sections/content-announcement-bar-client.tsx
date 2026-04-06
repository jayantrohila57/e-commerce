"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";

/** Minimal type for announcement bar content (serializable from server to client) */
export interface AnnouncementBarContent {
  id: string;
  title?: string | null;
  bodyText?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
}
const STORAGE_KEY = "site-announcement-bar-dismissed";

interface ContentAnnouncementBarClientProps {
  content: AnnouncementBarContent | null;
}

function getDismissedId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setDismissedId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export default function ContentAnnouncementBarClient({ content }: ContentAnnouncementBarClientProps) {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (!content?.id) {
      setIsHidden(true);
      return;
    }
    const dismissedId = getDismissedId();
    setIsHidden(dismissedId === content.id);
  }, [content?.id]);

  const handleDismiss = useCallback(() => {
    if (!content?.id) return;
    setDismissedId(content.id);
    setIsHidden(true);
  }, [content?.id]);

  if (!content || isHidden) return null;

  return (
    <div className="bg-secondary z-50 text-secondary-foreground relative">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 pr-12 text-xs sm:text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{content.title ?? "Announcement"}</span>
          {content.bodyText && <span className="opacity-90">{content.bodyText}</span>}
        </div>
        {content.ctaLabel && content.ctaLink && (
          <a href={content.ctaLink} className="ml-3 underline underline-offset-4">
            {content.ctaLabel}
          </a>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-secondary-foreground hover:bg-secondary-foreground/20"
        aria-label="Dismiss announcement"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
