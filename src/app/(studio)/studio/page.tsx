import { BadgePercentIcon, DollarSignIcon, ShoppingBagIcon, TrendingUpIcon } from "lucide-react";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";

export const metadata = {
  title: `${site.name} Studio`,
  description: `${site.name} operations and analytics.`,
};

/** Matches storefront order summary formatting (integer minor units as displayed). */
function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default async function Home() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const kpisRes = await apiServer.analytics.studioDashboardKpis({});
  const k =
    kpisRes.status === "success" && kpisRes.data
      ? kpisRes.data
      : {
          totalOrders: 0,
          pendingOrders: 0,
          paidRevenuePaise: 0,
          discountValuePaise: 0,
        };

  const metrics = [
    {
      icons: <TrendingUpIcon className="size-5" />,
      title: "Paid revenue",
      value: formatInr(k.paidRevenuePaise),
    },
    {
      icons: <BadgePercentIcon className="size-5" />,
      title: "Discount value (orders)",
      value: formatInr(k.discountValuePaise),
    },
    {
      icons: <DollarSignIcon className="size-5" />,
      title: "Pending checkout",
      value: String(k.pendingOrders),
    },
    {
      icons: <ShoppingBagIcon className="size-5" />,
      title: "Total orders",
      value: String(k.totalOrders),
    },
  ];

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <div className="grid grid-cols-6 gap-2 h-full w-full">
              <div className="col-span-2 flex flex-col h-full border-r w-full">
                {metrics.map((metric, index) => (
                  <div key={metric.title} className="flex items-center gap-4 rounded-md border-b p-4">
                    <Avatar className="size-8.5 rounded-sm">
                      <AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
                        {metric.icons}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-sm font-medium">{metric.title}</span>
                      <span className="text-lg font-medium">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-span-4 h-full w-full">
                <div className="h-full w-full flex justify-center border-b items-center text-sm text-muted-foreground">
                  Overview charts can be added here.
                </div>
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
