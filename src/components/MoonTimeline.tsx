import { useMemo } from 'react';
import type { AltitudePoint } from '@/lib/astronomy';

interface MoonTimelineProps {
  points: AltitudePoint[];
  optimalTimeMinutes: number;
  moonriseMinutes: number | null;
  moonsetMinutes: number | null;
  sunriseMinutes: number | null;
  sunsetMinutes: number | null;
}

/**
 * A 24-hour altitude timeline showing Moon and Sun altitude curves,
 * with markers for the optimal beach time, moonrise/set, and sunrise/set.
 */
export default function MoonTimeline({
  points,
  optimalTimeMinutes,
  moonriseMinutes,
  moonsetMinutes,
  sunriseMinutes,
  sunsetMinutes,
}: MoonTimelineProps) {
  const width = 700;
  const height = 200;
  const padX = 40;
  const padY = 30;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const { moonPath, sunPath, horizonY, maxAlt } = useMemo(() => {
    const maxAlt = 90;
    const xFor = (min: number) => padX + (min / (24 * 60)) * plotW;
    const yFor = (alt: number) => padY + plotH - ((alt + 10) / (maxAlt + 10)) * plotH;
    const horizonY = yFor(0);

    const moonPath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.minutes)} ${yFor(p.moonAltitude)}`)
      .join(' ');

    const sunPath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.minutes)} ${yFor(p.sunAltitude)}`)
      .join(' ');

    return { moonPath, sunPath, horizonY, maxAlt };
  }, [points, plotW, plotH, padX, padY]);

  const xFor = (min: number) => padX + (min / (24 * 60)) * plotW;
  const yFor = (alt: number) => padY + plotH - ((alt + 10) / (maxAlt + 10)) * plotH;

  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  function marker(min: number | null, color: string, label: string, icon?: string) {
    if (min === null) return null;
    const x = xFor(min);
    return (
      <g key={`marker-${label}`}>
        <line x1={x} y1={padY} x2={x} y2={padY + plotH} stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
        <circle cx={x} cy={padY + plotH - 5} r="3" fill={color} />
        <text x={x} y={height - 5} fill={color} fontSize="8" textAnchor="middle" opacity="0.7">
          {icon || label}
        </text>
      </g>
    );
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: '220px' }}>
        <defs>
          <linearGradient id="moonLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(244,228,188,0.4)" />
            <stop offset="100%" stopColor="rgba(244,228,188,0)" />
          </linearGradient>
          <linearGradient id="sunLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,180,80,0.3)" />
            <stop offset="100%" stopColor="rgba(255,180,80,0)" />
          </linearGradient>
        </defs>

        {/* Hour grid lines */}
        {hours.map((h) => {
          const x = xFor(h * 60);
          return (
            <g key={`grid-${h}`}>
              <line x1={x} y1={padY} x2={x} y2={padY + plotH} stroke="rgba(244,228,188,0.06)" strokeWidth="0.5" />
              <text x={x} y={padY - 5} fill="rgba(212,197,160,0.4)" fontSize="8" textAnchor="middle">
                {h.toString().padStart(2, '0')}:00
              </text>
            </g>
          );
        })}

        {/* Horizon line */}
        <line x1={padX} y1={horizonY} x2={width - padX} y2={horizonY} stroke="rgba(74,138,181,0.3)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={padX - 5} y={horizonY + 3} fill="rgba(74,138,181,0.5)" fontSize="7" textAnchor="end">0°</text>

        {/* Sun area fill */}
        <path
          d={`${sunPath} L ${xFor(24 * 60)} ${padY + plotH} L ${padX} ${padY + plotH} Z`}
          fill="url(#sunLineGrad)"
          opacity="0.5"
        />

        {/* Moon area fill */}
        <path
          d={`${moonPath} L ${xFor(24 * 60)} ${padY + plotH} L ${padX} ${padY + plotH} Z`}
          fill="url(#moonLineGrad)"
          opacity="0.5"
        />

        {/* Sun curve */}
        <path d={sunPath} fill="none" stroke="rgba(255,180,80,0.5)" strokeWidth="1.5" />

        {/* Moon curve */}
        <path d={moonPath} fill="none" stroke="rgba(244,228,188,0.8)" strokeWidth="2" />

        {/* Markers */}
        {marker(sunriseMinutes, 'rgba(255,180,80,0.6)', 'SR', '↑')}
        {marker(sunsetMinutes, 'rgba(255,140,60,0.6)', 'SS', '↓')}
        {marker(moonriseMinutes, 'rgba(244,228,188,0.5)', 'MR', '☾↑')}
        {marker(moonsetMinutes, 'rgba(200,180,150,0.5)', 'MS', '☾↓')}

        {/* Optimal time marker */}
        {optimalTimeMinutes >= 0 && optimalTimeMinutes <= 24 * 60 && (
          <g>
            <line
              x1={xFor(optimalTimeMinutes)}
              y1={padY - 8}
              x2={xFor(optimalTimeMinutes)}
              y2={padY + plotH}
              stroke="rgba(244,228,188,0.9)"
              strokeWidth="1.5"
            />
            <circle cx={xFor(optimalTimeMinutes)} cy={padY - 8} r="4" fill="rgba(244,228,188,1)" />
            <circle cx={xFor(optimalTimeMinutes)} cy={padY - 8} r="7" fill="none" stroke="rgba(244,228,188,0.4)" strokeWidth="1" />
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${padX + 5}, ${padY + 3})`}>
          <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(244,228,188,0.8)" strokeWidth="2" />
          <text x="16" y="3" fill="rgba(244,228,188,0.6)" fontSize="8">Moon</text>
          <line x1="50" y1="0" x2="62" y2="0" stroke="rgba(255,180,80,0.5)" strokeWidth="1.5" />
          <text x="66" y="3" fill="rgba(255,180,80,0.5)" fontSize="8">Sun</text>
        </g>
      </svg>
    </div>
  );
}
