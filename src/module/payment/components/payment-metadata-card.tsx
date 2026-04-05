"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Payment, PaymentProviderMetadata } from "../payment.schema";

function normalizeMetadata(metadata: unknown): PaymentProviderMetadata | null {
  if (!metadata || typeof metadata !== "object") return null;
  return metadata as PaymentProviderMetadata;
}

export function PaymentMetadataCard({ payment }: { payment: Payment }) {
  const providerMetadata = normalizeMetadata(payment.providerMetadata);
  const hasMetadata =
    providerMetadata && Object.keys(providerMetadata).filter((key) => providerMetadata[key] != null).length > 0;

  return (
    <Card className="bg-transparent">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-semibold">Provider details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Provider payment ID</p>
          {payment.providerPaymentId ? (
            <Badge variant="outline" className="font-mono text-xs">
              {payment.providerPaymentId}
            </Badge>
          ) : (
            <p className="text-xs text-muted-foreground">Not available</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Raw metadata</p>
          {hasMetadata ? (
            <pre className="max-h-60 overflow-auto rounded-md bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
              {JSON.stringify(providerMetadata, null, 2)}
            </pre>
          ) : (
            <p className="text-xs text-muted-foreground">No additional metadata recorded for this payment.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
