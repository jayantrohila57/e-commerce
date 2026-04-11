import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { serverEnv } from "@/shared/config/env.server";
import { MIME_TO_EXT, sniffPublicUploadMime } from "@/shared/utils/lib/file-sniff";
import { debugError } from "@/shared/utils/lib/logger.utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

/**
 * Staff/admin upload to public Vercel Blob. Filename and client MIME are not trusted; we sniff bytes and use a random path.
 */
export async function POST(request: Request) {
  try {
    if (!serverEnv.BLOB_READ_WRITE_TOKEN?.trim()) {
      return NextResponse.json({ error: "Blob uploads are not configured" }, { status: 503 });
    }

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

    const buffer = await file.arrayBuffer();
    const sniffed = sniffPublicUploadMime(buffer);
    if (!sniffed || !ALLOWED_TYPES.has(sniffed)) {
      return NextResponse.json({ error: "Unsupported or mismatched file content" }, { status: 400 });
    }

    const ext = MIME_TO_EXT[sniffed] ?? "bin";
    const pathname = `uploads/${randomUUID()}.${ext}`;
    const blob = new Blob([buffer], { type: sniffed });

    const uploaded = await put(pathname, blob, { access: "public", addRandomSuffix: true, contentType: sniffed });
    return NextResponse.json({ url: uploaded.url, pathname: uploaded.pathname }, { status: 200 });
  } catch (error) {
    debugError("VERCEL BLOB", { error });
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
