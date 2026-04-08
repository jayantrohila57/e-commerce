/**
 * Razorpay Checkout expects a hex (or rgb-compatible) brand color; theme tokens may be oklch.
 * Samples computed background from `var(--primary)` in the DOM.
 */
export function getPrimaryColorForRazorpayCheckout(fallbackHex = "#ea580c"): string {
  if (typeof document === "undefined") return fallbackHex;
  const body = document.body;
  if (!body) return fallbackHex;

  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.position = "absolute";
  probe.style.width = "0";
  probe.style.height = "0";
  probe.style.overflow = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.backgroundColor = "var(--primary)";
  let rgb: string;
  try {
    body.appendChild(probe);
    rgb = getComputedStyle(probe).backgroundColor;
  } finally {
    body.removeChild(probe);
  }

  return rgbToHex(rgb) ?? fallbackHex;
}

function rgbToHex(rgb: string): string | null {
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(rgb);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function getBackdropColorForRazorpayCheckout(isDark: boolean): string {
  return isDark ? "#1c1917" : "#fafaf9";
}
