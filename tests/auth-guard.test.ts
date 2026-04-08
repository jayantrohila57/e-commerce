import { describe, expect, it } from "vitest";
import { canUseGuard } from "@/core/auth/auth.guard";

describe("auth guard", () => {
  it("allows staff for staffProcedure guard", () => {
    expect(canUseGuard("staff", "staff")).toBe(true);
    expect(canUseGuard("staff", "admin")).toBe(true);
    expect(canUseGuard("staff", "customer")).toBe(false);
  });

  it("allows only admin for admin-only semantics via adminProcedure", () => {
    expect(canUseGuard("admin", "admin")).toBe(true);
    expect(canUseGuard("admin", "staff")).toBe(false);
  });
});
