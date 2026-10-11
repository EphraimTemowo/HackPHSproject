import { useMemo } from 'react';

interface MoonPhaseSVGProps {
  /** 0–1, fraction of the lunation cycle (0 = new, 0.5 = full) */
  phaseFraction: number;
  /** Size in pixels */
  size?: number;
  /** Show glow effect */
  glow?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Renders the Moon with the correct illuminated portion using an SVG
 * technique that overlays a shadow ellipse/oval on the lit disk.
 *
 * The approach: draw the full moon disk, then overlay a shadow shape
 * that covers the dark portion. The shadow's boundary is an ellipse
 * whose width changes with the phase.
 */
export default function MoonPhaseSVG({
  phaseFraction,
  size = 200,
  glow = true,
  className = '',
}: MoonPhaseSVGProps) {
  const r = 50;
  const cx = 60;
  const cy = 60;

  const { shadowPath, isWaxing } = useMemo(() => {
    // Phase 0 = new (fully dark), 0.5 = full (fully lit), 1 = new again
    // Illuminated fraction from the right (waxing) or left (waning)
    const phase = phaseFraction;
    const isWax = phase < 0.5;
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

    // The terminator is an ellipse. Its semi-minor axis (x) depends on illumination.
    // At new moon (illum=0), the terminator is at the full radius (all dark).
    // At full moon (illum=1), the terminator collapses to 0 (all lit).
    // At quarter (illum=0.5), terminator x-radius = 0 (straight line).

    // The x-radius of the terminator ellipse:
    // For the lit fraction, terminatorX = r * (1 - 2 * illumination)
    // When illumination = 0.5, terminatorX = 0 (straight line — quarter phase)
    // When illumination = 1, terminatorX = -r (all lit)
    // When illumination = 0, terminatorX = r (all dark)

    const terminatorX = r * Math.abs(1 - 2 * illumination);
    const isLitOnRight = isWax;

    // Build the shadow path
    // The shadow covers the dark portion of the moon.
    // At new moon: shadow covers everything
    // At full moon: shadow covers nothing
    // At first quarter (waxing, illum=0.5): shadow covers left half
    // At last quarter (waning, illum=0.5): shadow covers right half

    let path = '';

    if (illumination >= 0.999) {
      // Full moon — no shadow
      path = '';
    } else if (illumination <= 0.001) {
      // New moon — full shadow circle
      path = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy} Z`;
    } else {
      // The shadow is bounded by the outer circle on the dark side and the
      // terminator ellipse on the lit side.
      //
      // We construct a path that goes:
      // 1. From top of circle around the dark side to bottom of circle (outer arc)
      // 2. From bottom back to top via the terminator ellipse (inner arc)

      const litOnRight = isLitOnRight;

      if (litOnRight) {
        // Dark side is on the LEFT
        // Outer arc: from top (cx, cy-r) going LEFT (counter-clockwise) to bottom (cx, cy+r)
        // Inner arc: from bottom (cx, cy+r) back to top (cx, cy-r) via ellipse

        if (illumination < 0.5) {
          // Crescent on the right — less than half lit
          // Shadow covers most of the disk. The terminator ellipse bulges to the right.
          // Outer arc goes from top, leftward around, to bottom
          // Inner arc (terminator) goes from bottom, rightward (sweep=1), to top
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 0 ${cx} ${cy - r} Z`;
        } else {
          // Gibbous — more than half lit
          // Shadow is a crescent on the left. Terminator bulges to the left.
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 1 ${cx} ${cy - r} Z`;
        }
      } else {
        // Dark side is on the RIGHT
        if (illumination < 0.5) {
          // Crescent on the left — less than half lit
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 1 ${cx} ${cy - r} Z`;
        } else {
          // Gibbous — more than half lit, shadow crescent on right
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 0 ${cx} ${cy - r} Z`;
        }
      }
    }

    return { shadowPath: path, isWaxing: isWax };
  }, [phaseFraction]);

  const illumination = (1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ filter: glow ? 'drop-shadow(0 0 15px rgba(244, 228, 188, 0.4))' : 'none' }}
    >
      <defs>
        <radialGradient id="moonLit" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fefcf5" />
          <stop offset="40%" stopColor="#fdf6e3" />
          <stop offset="70%" stopColor="#e8d9b8" />
          <stop offset="100%" stopColor="#c4b497" />
        </radialGradient>
        <radialGradient id="moonDark" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="70%" stopColor="#0d0d1a" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
        <filter id="moonTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="5" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Full lit moon disk */}
      <circle cx={cx} cy={cy} r={r} fill="url(#moonLit)" />

      {/* Surface texture overlay */}
      <g clipPath="url(#moonClip)">
        <circle cx={cx} cy={cy} r={r} fill="url(#moonLit)" />
        <circle cx={cx - 15} cy={cy - 10} r={5} fill="rgba(0,0,0,0.06)" />
        <circle cx={cx + 18} cy={cy + 8} r={7} fill="rgba(0,0,0,0.05)" />
        <circle cx={cx + 5} cy={cy + 20} r={4} fill="rgba(0,0,0,0.04)" />
        <circle cx={cx - 20} cy={cy + 15} r={3} fill="rgba(0,0,0,0.04)" />
        <circle cx={cx + 10} cy={cy - 18} r={2.5} fill="rgba(0,0,0,0.03)" />
        <circle cx={cx - 8} cy={cy + 5} r={2} fill="rgba(0,0,0,0.03)" />
        <circle cx={cx + 25} cy={cy - 5} r={3.5} fill="rgba(0,0,0,0.03)" />
        {/* Maria (dark patches) — more visible on lit side */}
        <ellipse cx={cx + 8} cy={cy - 5} rx={8} ry={6} fill="rgba(0,0,0,0.04)" />
        <ellipse cx={cx - 5} cy={cy + 12} rx={6} ry={5} fill="rgba(0,0,0,0.03)" />
      </g>

      {/* Shadow overlay for the dark portion */}
      {shadowPath && <path d={shadowPath} fill="url(#moonDark)" />}

      {/* Subtle rim highlight on lit side */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(254, 252, 245, 0.15)"
        strokeWidth="0.5"
      />

      {/* Glow ring for high illumination */}
      {glow && illumination > 0.5 && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 2}
          fill="none"
          stroke="rgba(244, 228, 188, 0.2)"
          strokeWidth="2"
          style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
        />
      )}
    </svg>
  );
}
