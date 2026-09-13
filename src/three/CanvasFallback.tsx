/**
 * Static, dependency-free illustration shown when WebGL is unavailable.
 * Deliberately simple (inline SVG, no external asset) — it only needs to
 * gesture at the same Build → Govern → Deploy concept the 3D sculpture
 * conveys, not reproduce it faithfully. Shared by the hero and, later, the
 * scroll-story scene via useWebGLSupport.
 */
export interface CanvasFallbackProps {
  className?: string;
}

export function CanvasFallback({ className }: CanvasFallbackProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label="Illustration of application modules moving from scattered (Build) to a governed ring (Govern) to connected deployed satellites (Deploy)"
    >
      <svg viewBox="0 0 480 480" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Electric Iris — the v3 palette's sole cool anchor, carrying the
              governance/structure role champagne/violet used to split. */}
          <radialGradient id="fallback-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#5683da" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5683da" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="240" cy="240" r="220" fill="url(#fallback-glow)" />

        {/* Governance ring (Electric Iris — matches the 3D scene's governance-ring material) */}
        <circle cx="240" cy="240" r="150" fill="none" stroke="#5683da" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="240" cy="240" r="150" fill="none" stroke="#5683da" strokeOpacity="0.15" strokeWidth="10" />

        {/* Obsidian-canvas core, outlined in Electric Iris for definition against the dark backdrop */}
        <rect x="210" y="210" width="60" height="60" rx="10" fill="#111111" stroke="#5683da" strokeWidth="1.5" />

        {/* Deployed satellite modules connected to the core */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r = 150;
          const cx = 240 + Math.cos(rad) * r;
          const cy = 240 + Math.sin(rad) * r;
          return (
            <g key={i}>
              {/* Ember Pulse — matches the 3D scene's connection/accent material */}
              <line x1="240" y1="240" x2={cx} y2={cy} stroke="#ff8964" strokeOpacity="0.4" strokeWidth="1" />
              <rect
                x={cx - 16}
                y={cy - 16}
                width="32"
                height="32"
                rx="6"
                fill="#ffffff"
                fillOpacity="0.08"
                stroke="#5683da"
                strokeWidth="1.25"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
