import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { debugError } from "@/shared/utils/lib/logger.utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const uploaded = await put(file.name, file, { access: "public" });
    return NextResponse.json({ url: uploaded.url, pathname: uploaded.pathname }, { status: 200 });
  } catch (error) {
    debugError("VERCEL BLOB", { error });
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
