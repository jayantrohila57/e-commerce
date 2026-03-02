import { cn } from "@/shared/utils/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent border-input/30 animate-pulse rounded-md border", className)}
      {...props}
    />
  );
}

export { Skeleton };
