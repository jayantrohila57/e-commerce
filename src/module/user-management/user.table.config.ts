import { PATH } from "@/shared/config/routes";

export const userTableConfig = {
  routes: {
    base: PATH.STUDIO.USERS.ROOT,
    view: (id: string) => PATH.STUDIO.USERS.VIEW(id),
  },
  fields: {
    id: "id",
    email: "email",
    name: "name",
    role: "role",
  },
} as const;
