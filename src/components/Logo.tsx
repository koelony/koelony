import { LOCKUP_SVG, MARK_SVG } from "../brand";
import { SITE_NAME } from "../site";

/**
 * The Koelony logo, inlined from `brand/` at build time so it takes the colours of the theme.
 * `lockup` is the mark with the wordmark; without a lockup file it falls back to mark plus text.
 */
export function Logo({
  variant = "lockup",
  height = 30,
}: {
  variant?: "lockup" | "mark";
  height?: number;
}) {
  const svg = variant === "lockup" ? LOCKUP_SVG : MARK_SVG;
  if (svg) {
    return (
      <span
        className={`logo logo-${variant}`}
        style={{ height }}
        role="img"
        aria-label={SITE_NAME}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: our own SVG from brand/, inlined at build time
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  if (variant === "lockup" && MARK_SVG) {
    return (
      <span className="logo logo-fallback" style={{ height }}>
        <Logo variant="mark" height={height} />
        <span className="logo-word">{SITE_NAME}</span>
      </span>
    );
  }
  return <span className="logo logo-word">{SITE_NAME}</span>;
}
