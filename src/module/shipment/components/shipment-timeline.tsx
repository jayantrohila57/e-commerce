"use client";

import { Package, Truck } from "lucide-react";
import type { Shipment } from "@/module/shipment/shipment.schema";

const FLOW_STEPS: { id: Shipment["status"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "pending", label: "Pending", icon: Package },
  { id: "label_created", label: "Label created", icon: Package },
  { id: "picked_up", label: "Picked up", icon: Truck },
  { id: "in_transit", label: "In transit", icon: Truck },
  { id: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: Package },
];

const EXCEPTION_STEPS: Shipment["status"][] = ["exception", "returned"];

interface ShipmentTimelineProps {
  shipment: Shipment;
}

export function ShipmentTimeline({ shipment }: ShipmentTimelineProps) {
  const currentStatus = shipment.status;
  const isException = EXCEPTION_STEPS.includes(currentStatus);
  const steps = isException
    ? FLOW_STEPS.concat([{ id: currentStatus, label: currentStatus.replace("_", " "), icon: Package }])
    : FLOW_STEPS;
  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Shipment status</h3>
      <ol className="space-y-3 text-xs">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStatus;
          const isCompleted = currentIndex >= 0 && index <= currentIndex;

          return (
            <li key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                {index < steps.length - 1 && <div className="mt-1 h-6 w-px bg-border/70" aria-hidden="true" />}
              </div>
              <div className="pt-0.5">
                <p className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
