"use client";

import { debugLog } from "@/shared/utils/lib/logger.utils";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    debugLog("WEB_VITALS", metric);
  });
  return null;
}
