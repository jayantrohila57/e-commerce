import type { Route } from "next";
import { forbidden, notFound, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { getStudioUserById } from "@/module/user-management/actions/user-management.actions";
import { UserRoleForm } from "@/module/user-management/components/user-role-form";
import { UserRowActions } from "@/module/user-management/components/user-row-actions";
import { PERMISSIONS_BY_ROLE } from "@/module/user-management/user-management.permissions";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

interface StudioCustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Customer Details",
  description: "Inspect and manage user access.",
};

export default async function StudioCustomerDetailPage({ params }: StudioCustomerDetailPageProps) {
  const { id } = await params;
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) !== APP_ROLE.ADMIN) forbidden();

  const managedUser = await getStudioUserById({
    params: { id },
  });

  if (!managedUser) return notFound();

  const permissions = PERMISSIONS_BY_ROLE[managedUser.role];

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section {...metadata}>
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-md border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">{managedUser.name}</h1>
                <p className="text-sm text-muted-foreground">{managedUser.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {managedUser.role}
                  </Badge>
                  <Badge variant={managedUser.emailVerified ? "default" : "outline"}>
                    {managedUser.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge variant={managedUser.banned ? "destructive" : "outline"}>
                    {managedUser.banned ? "Banned" : "Active"}
                  </Badge>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={PATH.STUDIO.CUSTOMERS.ROOT as Route}>Back to users</a>
              </Button>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <UserRoleForm userId={managedUser.id} role={managedUser.role} />
              <UserRowActions userId={managedUser.id} isBanned={managedUser.banned} role={managedUser.role} />
            </div>

            <Separator />

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Effective permissions</h2>
              <div className="flex flex-wrap gap-1">
                {permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
