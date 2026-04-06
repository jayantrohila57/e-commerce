type JsonLdScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

/**
 * Renders JSON-LD for rich results. Safe for RSC.
 */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  const json = JSON.stringify(data);
  return (
    <script
      id={id}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline for crawlers
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
