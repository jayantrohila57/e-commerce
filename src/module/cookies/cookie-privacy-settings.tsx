"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import {
  AlertDialog,
  AlertDialogAction,
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
import type { ConsentCategory } from "./cookie-consent.schema";
import { defaultCookieConsentPreferences } from "./cookie-consent.shared";
import { useCookieConsent } from "./use-cookie-consent";

export function CookiePrivacySettings() {
  const router = useRouter();
  const { record, isLoaded, updatePreferences } = useCookieConsent();
  const consentQuery = apiClient.cookieConsent.getCurrent.useQuery();
  const saveMutation = apiClient.cookieConsent.save.useMutation();
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preferences, setPreferences] = useState(defaultCookieConsentPreferences);

  const effectiveRecord = useMemo(() => {
    return consentQuery.data?.data?.consent ?? record;
  }, [consentQuery.data?.data?.consent, record]);

  useEffect(() => {
    if (!isLoaded) return;
    setPreferences({
      essential: true,
      functional: effectiveRecord?.functional ?? false,
      analytics: effectiveRecord?.analytics ?? false,
      marketing: effectiveRecord?.marketing ?? false,
    });
  }, [effectiveRecord, isLoaded]);

  function handlePreferenceChange(key: ConsentCategory, value: boolean) {
    if (key === "essential") return;
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSave() {
    startTransition(async () => {
      const localRecord = updatePreferences(preferences, { source: "account" });
      const result = await saveMutation.mutateAsync({
        body: {
          essential: true,
          functional: preferences.functional,
          analytics: preferences.analytics,
          marketing: preferences.marketing,
          region: localRecord?.region ?? null,
          source: "account",
        },
      });

      if (result.status !== "success") {
        toast.error(result.message || "Failed to update privacy settings");
        return;
      }

      toast.success("Privacy preferences saved");
      setShowReloadDialog(true);
    });
  }

  function handleReloadHome() {
    setShowReloadDialog(false);
    window.location.assign(PATH.ROOT);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cookie preferences</CardTitle>
          <CardDescription>
            Essential cookies stay on. Optional categories update both this device and your account privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrivacyRow
            checked
            description="Required for authentication, cart, checkout, and core security."
            label="Essential cookies"
            locked
            icon={<Shield className="h-4 w-4" />}
          />
          <PrivacyRow
            checked={preferences.functional}
            description="Optional device-level enhancements. Existing account preferences remain separate."
            label="Functional cookies"
            onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
          />
          <PrivacyRow
            checked={preferences.analytics}
            description="Allows analytics and future tracking integrations to run."
            label="Analytics cookies"
            onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
          />
          <PrivacyRow
            checked={preferences.marketing}
            description="Reserved for future ads and remarketing providers."
            label="Marketing cookies"
            onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
          />

          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Last updated:{" "}
              {effectiveRecord?.updatedAt ? new Date(effectiveRecord.updatedAt).toLocaleString() : "Not set yet"}
            </span>
            <Button disabled={isPending} onClick={handleSave}>
              Save privacy settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showReloadDialog} onOpenChange={setShowReloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Preferences saved</AlertDialogTitle>
            <AlertDialogDescription>
              Your privacy settings have been updated. We will take you back to the homepage so optional tracking and
              customer-side behavior reload with the new consent state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleReloadHome}>Return to homepage</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PrivacyRow(props: {
  checked: boolean;
  description: string;
  icon?: React.ReactNode;
  label: string;
  locked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {props.icon}
          <p className="font-medium">{props.label}</p>
          {props.locked && <span className="text-xs text-muted-foreground">Always on</span>}
        </div>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
      <Switch checked={props.checked} disabled={props.locked} onCheckedChange={props.onCheckedChange} />
    </div>
  );
}
