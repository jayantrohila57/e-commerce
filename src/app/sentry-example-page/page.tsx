"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, Bug } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function SentryExamplePage() {
  const [didThrow, setDidThrow] = useState(false);

  function triggerError() {
    setDidThrow(true);
    const error = new Error("Sentry test error from /sentry-example-page");
    Sentry.captureException(error);
    throw error;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
      <Card className="w-full max-w-lg border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
            <Bug className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Sentry test page</CardTitle>
          <CardDescription className="text-slate-300">
            Click the button below to send a test error to Sentry and confirm the Next.js SDK is working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-rose-500 text-white hover:bg-rose-400" onClick={triggerError} type="button">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Trigger test error
          </Button>
          <p className="text-sm text-slate-400">If the event appears in Sentry Issues, the setup is complete.</p>
          {didThrow && (
            <p className="text-sm text-rose-300">
              The error was triggered. Check Sentry for the issue that was just sent.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
