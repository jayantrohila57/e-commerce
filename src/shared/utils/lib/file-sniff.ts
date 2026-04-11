/**
 * Infer image/PDF MIME from magic bytes. Declared `Content-Type` from multipart is spoofable; we trust bytes.
 */
export function sniffPublicUploadMime(buffer: ArrayBuffer): string | null {
  const u = new Uint8Array(buffer);
  if (u.length < 12) return null;

  if (u[0] === 0xff && u[1] === 0xd8 && u[2] === 0xff) {
    return "image/jpeg";
  }
  if (u[0] === 0x89 && u[1] === 0x50 && u[2] === 0x4e && u[3] === 0x47) {
    return "image/png";
  }
  if (u[0] === 0x47 && u[1] === 0x49 && u[2] === 0x46 && u[3] === 0x38) {
    return "image/gif";
  }
  if (u[0] === 0x25 && u[1] === 0x50 && u[2] === 0x44 && u[3] === 0x46) {
    return "application/pdf";
  }
  const riff = String.fromCharCode(u[0], u[1], u[2], u[3]);
  const webp = String.fromCharCode(u[8], u[9], u[10], u[11]);
  if (riff === "RIFF" && webp === "WEBP") {
    return "image/webp";
  }
  return null;
}

export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
};
