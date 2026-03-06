import { PATH } from "@/shared/config/routes";

export const userTableConfig = {
  routes: {
    base: PATH.STUDIO.CUSTOMERS.ROOT,
    view: (id: string) => PATH.STUDIO.CUSTOMERS.VIEW(id),
  },
  fields: {
    id: "id",
    email: "email",
    name: "name",
    role: "role",
  },
} as const;
