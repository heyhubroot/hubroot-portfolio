import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { site } from "@/config/site";

/**
 * Real portrait if /public/images/hubroot-portrait.webp exists, otherwise a clearly marked placeholder.
 * Replacing it is a one-file swap: drop the photo at that path and rebuild. No code changes.
 */
export function Portrait({ size = "large", priority = false }: { size?: "large" | "small"; priority?: boolean }) {
  const exists = existsSync(join(process.cwd(), "public", site.portrait.src));
  // source is 3:4; the small avatar is cropped to the face in CSS, so it needs a little more resolution
  const dims = size === "large" ? { w: 720, h: 960 } : { w: 240, h: 320 };

  if (!exists) {
    return (
      <div className={`portrait portrait--${size} portrait--placeholder`} role="img" aria-label="Portrait placeholder">
        {size === "large" && (
          <div className="portrait__ph">
            <span className="label">Portrait placeholder</span>
            <span className="mono">add /public/images/hubroot-portrait.webp</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`portrait portrait--${size}`}>
      <Image
        src={site.portrait.src}
        alt={site.portrait.alt}
        width={dims.w}
        height={dims.h}
        sizes={size === "large" ? "(min-width: 900px) 40vw, 100vw" : "160px"}
        priority={priority}
      />
    </div>
  );
}
