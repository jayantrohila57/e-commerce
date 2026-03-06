"use client";

import { BarChart3, Settings, Shield, Target, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { debugError, debugLog } from "@/shared/utils/lib/logger.utils";

const onConsentChange = (newPreferences: CookiePreferences) => {
  debugLog("Cookie preferences updated:", newPreferences);

  if (newPreferences.analytics) {
    debugLog("Analytics enabled - initialize Google Analytics, etc.");
  }

  if (newPreferences.marketing) {
    debugLog("Marketing enabled - initialize Facebook Pixel, etc.");
  }
};

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "cookie-consent-preferences";
const CONSENT_GIVEN_KEY = "cookie-consent-given";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => !localStorage.getItem(CONSENT_GIVEN_KEY));
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === "undefined") {
      return {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      };
    }

    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      if (!savedPreferences) {
        return {
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
        };
      }

      const parsed = JSON.parse(savedPreferences);
      const newPreferences: CookiePreferences = {
        essential: true, // Ensure essential is always true
        functional: parsed.functional ?? false,
        analytics: parsed.analytics ?? false,
        marketing: parsed.marketing ?? false,
      };

      // Call onConsentChange with the loaded preferences
      onConsentChange(newPreferences);
      return newPreferences;
    } catch (error) {
      debugError("Failed to parse saved cookie preferences:", error);
      return {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      };
    }
  });

  const savePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    localStorage.setItem(CONSENT_GIVEN_KEY, "true");
    onConsentChange?.(preferences);

    // Set actual cookies based on preferences
    if (preferences.analytics) {
      document.cookie = "analytics_enabled=true; path=/; max-age=31536000; SameSite=Lax";
    } else {
      document.cookie = "analytics_enabled=false; path=/; max-age=0";
    }

    if (preferences.marketing) {
      document.cookie = "marketing_enabled=true; path=/; max-age=31536000; SameSite=Lax";
    } else {
      document.cookie = "marketing_enabled=false; path=/; max-age=0";
    }

    if (preferences.functional) {
      document.cookie = "functional_enabled=true; path=/; max-age=31536000; SameSite=Lax";
    } else {
      document.cookie = "functional_enabled=false; path=/; max-age=0";
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
    setIsVisible(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return; // Essential cookies cannot be disabled

    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">{"Cookie Preferences"}</CardTitle>
              <CardDescription className="mt-2">
                {
                  "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic."
                }
                {"Choose which cookies you allow us to use."}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {showDetails && (
            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex flex-1 items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div className="space-y-1">
                    <h4 className="font-medium">{"Essential Cookies"}</h4>
                    <p className="text-muted-foreground text-sm">
                      {"Required for the website to function properly. These cannot be disabled."}
                    </p>
                  </div>
                </div>
                <Switch checked={preferences.essential} disabled={true} className="shrink-0" />
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex flex-1 items-start gap-3">
                  <Settings className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div className="space-y-1">
                    <h4 className="font-medium">{"Functional Cookies"}</h4>
                    <p className="text-muted-foreground text-sm">
                      {"Enable enhanced functionality like chat widgets, videos, and personalized content."}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                  className="shrink-0"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex flex-1 items-start gap-3">
                  <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
                  <div className="space-y-1">
                    <h4 className="font-medium">{"Analytics Cookies"}</h4>
                    <p className="text-muted-foreground text-sm">
                      {
                        "    Help us understand how visitors interact with our website by collecting anonymous information."
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                  className="shrink-0"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex flex-1 items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                  <div className="space-y-1">
                    <h4 className="font-medium"> {"Marketing Cookies"}</h4>
                    <p className="text-muted-foreground text-sm">
                      {"Used to track visitors across websites to display relevant advertisements."}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                  className="shrink-0"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleAcceptAll} className="flex-1">
              {"Accept All"}
            </Button>

            <Button onClick={handleRejectAll} variant="outline" className="flex-1 bg-transparent">
              {"Reject All"}
            </Button>

            <Button onClick={() => setShowDetails(!showDetails)} variant="outline" className="flex-1">
              {showDetails ? "Hide Details" : "Customize"}
            </Button>
          </div>

          {showDetails && (
            <Button onClick={handleAcceptSelected} className="w-full" variant="secondary">
              {"Save Preferences"}
            </Button>
          )}

          <p className="text-muted-foreground text-center text-xs">
            {"You can change your preferences at any time in your browser settings or by clearing your cookies."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
