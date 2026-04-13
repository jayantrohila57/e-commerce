"use client";

import { BarChart3, Globe2, Settings, Shield, Target, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { PATH } from "@/shared/config/routes";
import type { ConsentCategory, CookieConsentPreferences, CookieConsentRecord } from "./cookie-consent.schema";
import { defaultCookieConsentPreferences } from "./cookie-consent.shared";
import { useCookieConsent } from "./use-cookie-consent";

export default function CookieConsent() {
  const { data: session } = useSession();
  const { record, isLoaded, overwriteFromServer, updatePreferences } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [pendingServerConsent, setPendingServerConsent] = useState<CookieConsentRecord | null>(null);
  const [draftPreferences, setDraftPreferences] = useState<CookieConsentPreferences>(defaultCookieConsentPreferences);
  const [isPending, startTransition] = useTransition();
  const syncedForUserRef = useRef<string | null>(null);

  const syncMutation = apiClient.cookieConsent.syncAfterLogin.useMutation();
  const saveMutation = apiClient.cookieConsent.save.useMutation();

  useEffect(() => {
    setDraftPreferences({
      essential: true,
      functional: record?.functional ?? false,
      analytics: record?.analytics ?? false,
      marketing: record?.marketing ?? false,
    });
  }, [record]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || !isLoaded || syncedForUserRef.current === userId) return;

    syncedForUserRef.current = userId;
    void syncMutation
      .mutateAsync({
        body: {
          browserConsent: record,
        },
      })
      .then((result) => {
        if (result.status !== "success" || !result.data) return;
        if (result.data.mode === "db-overrides" && result.data.consent) {
          setPendingServerConsent(result.data.consent);
          setShowSyncDialog(true);
          return;
        }

        if (result.data.mode === "db-saved" && result.data.consent) {
          overwriteFromServer(result.data.consent);
        }
      });
  }, [isLoaded, overwriteFromServer, record, session?.user?.id, syncMutation]);

  const isVisible = isLoaded && !record;

  function persistConsent(nextPreferences: CookieConsentPreferences, source: "banner" | "account") {
    const localRecord = updatePreferences(nextPreferences, { source });

    if (session?.user?.id) {
      void saveMutation.mutateAsync({
        body: {
          essential: true,
          functional: nextPreferences.functional,
          analytics: nextPreferences.analytics,
          marketing: nextPreferences.marketing,
          region: localRecord?.region ?? null,
          source,
        },
      });
    }

    return localRecord;
  }

  function handleAcceptAll() {
    startTransition(() => {
      persistConsent(
        {
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
        },
        "banner",
      );
      toast.success("Cookie preferences saved");
    });
  }

  function handleRejectAll() {
    startTransition(() => {
      persistConsent(
        {
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
        },
        "banner",
      );
      toast.success("Only essential cookies will remain active");
    });
  }

  function handleSaveSelected() {
    startTransition(() => {
      persistConsent(draftPreferences, "banner");
      toast.success("Cookie preferences saved");
    });
  }

  function handlePreferenceChange(key: ConsentCategory, value: boolean) {
    if (key === "essential") return;
    setDraftPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function applySavedPrivacyPreferences() {
    if (!pendingServerConsent) return;
    overwriteFromServer(pendingServerConsent);
    setShowSyncDialog(false);
    setPendingServerConsent(null);
    toast.success("Saved privacy preferences applied to this device");
  }

  if (!isVisible) {
    return (
      <AlertDialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Use your saved privacy preferences?</AlertDialogTitle>
            <AlertDialogDescription>
              We found cookie choices saved in your account. To keep privacy consistent across devices, we can apply
              those saved preferences here now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep this device for now</AlertDialogCancel>
            <AlertDialogAction onClick={applySavedPrivacyPreferences}>Apply saved preferences</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm">
        <Card className="w-full max-w-3xl border-border/60 shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl">Privacy and cookie choices</CardTitle>
                <CardDescription className="max-w-2xl text-sm">
                  We use essential cookies to keep sign-in, cart, checkout, and security working. You can also choose
                  whether we use optional cookies for functionality, analytics, and marketing. Read our{" "}
                  <Link href={PATH.SITE.LEGAL.COOKIES} className="underline underline-offset-4">
                    cookie policy
                  </Link>
                  .
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0" onClick={() => setShowDetails((value) => !value)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {showDetails && (
              <div className="grid gap-3">
                <PreferenceRow
                  description="Required for account sessions, cart state, checkout, and security."
                  icon={<Shield className="h-5 w-5" />}
                  label="Essential cookies"
                  locked
                  checked
                />
                <PreferenceRow
                  description="Optional site features tied to this device only. Existing account preferences stay separate."
                  icon={<Settings className="h-5 w-5" />}
                  label="Functional cookies"
                  checked={draftPreferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                />
                <PreferenceRow
                  description="Helps us understand store usage and prepares the app for future analytics integrations."
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Analytics cookies"
                  checked={draftPreferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                />
                <PreferenceRow
                  description="Reserved for future advertising and retargeting integrations."
                  icon={<Target className="h-5 w-5" />}
                  label="Marketing cookies"
                  checked={draftPreferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disabled={isPending} onClick={handleAcceptAll}>
                Accept all
              </Button>
              <Button disabled={isPending} onClick={handleRejectAll} variant="outline">
                Reject all except essential
              </Button>
              <Button disabled={isPending} onClick={() => setShowDetails((value) => !value)} variant="outline">
                {showDetails ? "Hide customization" : "Customize"}
              </Button>
            </div>

            {showDetails && (
              <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe2 className="h-4 w-4" />
                  Your choice will be remembered for 6 months and can be changed later from Account Settings {" > "}
                  Privacy.
                </div>
                <Button disabled={isPending} onClick={handleSaveSelected} variant="secondary">
                  Save preferences
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Use your saved privacy preferences?</AlertDialogTitle>
            <AlertDialogDescription>
              We found cookie choices saved in your account. To keep privacy consistent across devices, we can apply
              those saved preferences here now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep this device for now</AlertDialogCancel>
            <AlertDialogAction onClick={applySavedPrivacyPreferences}>Apply saved preferences</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PreferenceRow(props: {
  checked: boolean;
  description: string;
  icon: React.ReactNode;
  label: string;
  locked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div className="flex flex-1 items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{props.icon}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{props.label}</p>
            {props.locked && <span className="text-xs text-muted-foreground">Always on</span>}
          </div>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>
      <Switch checked={props.checked} disabled={props.locked} onCheckedChange={props.onCheckedChange} />
    </div>
  );
}
