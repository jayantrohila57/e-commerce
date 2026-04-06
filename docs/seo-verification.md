# SEO verification checklist

Use this after deploy (especially production with `NEXT_PUBLIC_BASE_URL` set to the canonical domain).

## Metadata

- View page source on `/`, `/store`, a category, subcategory, and PDP: confirm `<title>`, meta description, canonical link, `og:*` and `twitter:*` tags.
- Confirm `metadataBase` resolves OG images to absolute URLs (not relative).

## Structured data

- **Rich Results Test**: run PDP and category URLs through Google’s Rich Results Test; expect `Product` + `BreadcrumbList` on PDP, `BreadcrumbList` on catalog pages, `Organization` + `WebSite` on all pages (root JSON-LD).
- Fix any errors before relying on merchant listings.

## Crawling

- Open `/robots.txt`: `Allow`/`Disallow` match intent; `Sitemap` points to the production origin.
- Open `/sitemap.xml`: includes home, store, static marketing/support/legal URLs, public categories/subcategories, and live product variant URLs only.

## Social previews

- Share debugger: Facebook Sharing Debugger, LinkedIn Post Inspector, X (Twitter) Card Validator — spot-check home and a PDP URL.

## PWA / icons

- `/manifest.webmanifest` loads; install prompt / “Add to Home Screen” smoke test on mobile.
- `/icon.png`, `/icons/icon-192x192.png` (and other sizes under `/icons/`), and `/mask-icon.svg` return expected assets.

## Environment

- `NEXT_PUBLIC_BASE_URL` must be the canonical HTTPS origin in production.
- Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console.
