import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { site } from "@/config/site";

/**
 * Hubroot's real photo. Uses the first file that exists in /public, in order:
 *   /me.jpg  →  /images/hubroot-portrait.webp
 * If neither exists, a clearly marked placeholder renders instead (never a generated face).
 * The image fills a fixed-ratio frame with object-fit: cover, so it is cropped, never stretched.
 */
function resolvePortrait(): string | null {
  for (const src of site.portrait.sources) {
    if (existsSync(join(process.cwd(), "public", src))) return src;
  }
  return null;
}

export function Portrait({ size = "large", priority = false }: { size?: "large" | "small"; priority?: boolean }) {
  const src = resolvePortrait();

  if (!src) {
    return (
      <div className={`portrait portrait--${size} portrait--placeholder`} role="img" aria-label="Portrait placeholder">
        {size === "large" && (
          <div className="portrait__ph">
            <span className="label">Portrait placeholder</span>
            <span className="mono">add /public/me.jpg</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`portrait portrait--${size}`}>
      <Image
        src={src}
        alt={site.portrait.alt}
        fill
        sizes={size === "large" ? "(min-width: 900px) 40vw, 100vw" : "120px"}
        priority={priority}
        // one small optimised image per page: load it eagerly so it is never left blank
        loading={priority ? undefined : "eager"}
      />
    </div>
  );
}
