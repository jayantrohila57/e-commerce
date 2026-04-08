import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { debugError } from "@/shared/utils/lib/logger.utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = normalizeRole(session.user.role);
    if (role !== APP_ROLE.ADMIN && role !== APP_ROLE.STAFF) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    const uploaded = await put(file.name, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ url: uploaded.url, pathname: uploaded.pathname }, { status: 200 });
  } catch (error) {
    debugError("VERCEL BLOB", { error });
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
