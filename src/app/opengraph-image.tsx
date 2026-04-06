import { ImageResponse } from "next/og";
import { seoConfig } from "@/shared/seo/seo.config";

export const runtime = "nodejs";

export const alt = seoConfig.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #3b82f6 100%)",
        color: "#f8fafc",
        fontSize: 64,
        fontWeight: 700,
        letterSpacing: "-0.04em",
        padding: 48,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 42, opacity: 0.9, marginBottom: 24 }}>{seoConfig.siteName}</div>
      <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.85, maxWidth: 900, lineHeight: 1.35 }}>
        {seoConfig.description}
      </div>
    </div>,
    { ...size },
  );
}
