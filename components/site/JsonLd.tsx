/**
 * Renders a Schema.org JSON-LD block. Server component (no "use client") so
 * the markup is included in the HTML response — that's important: Google's
 * crawler wants to see it without executing JavaScript.
 *
 * Usage:
 *   <JsonLd data={destinationSchema(dest)} />
 */
interface Props {
  data: object | object[];
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // The schema is generated server-side from typed objects, so the
      // stringified output is always valid JSON. No XSS surface from this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
