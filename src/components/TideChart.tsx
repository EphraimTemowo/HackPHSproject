import { useMemo } from 'react';
import type { TidePoint } from '@/lib/astronomy';

interface TideChartProps {
  points: TidePoint[];
  optimalTimeMinutes: number;
}

/**
 * A 24-hour tide height curve with high/low tide markers.
 */
export default function TideChart({ points, optimalTimeMinutes }: TideChartProps) {
  const width = 700;
  const height = 180;
  const padX = 40;
  const padY = 25;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const { tidePath, areaPath, maxY, highPoints, lowPoints } = useMemo(() => {
    const maxY = Math.max(...points.map((p) => p.height), 1) * 1.15;
    const xFor = (min: number) => padX + (min / (24 * 60)) * plotW;
    const yFor = (h: number) => padY + plotH - (h / maxY) * plotH;

    const tidePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.minutes)} ${yFor(p.height)}`)
      .join(' ');

    const areaPath = `${tidePath} L ${xFor(24 * 60)} ${padY + plotH} L ${padX} ${padY + plotH} Z`;

    // Find local maxima and minima
    const highPoints: TidePoint[] = [];
    const lowPoints: TidePoint[] = [];
    for (let i = 2; i < points.length - 2; i++) {
      if (
        points[i].height > points[i - 1].height &&
        points[i].height > points[i + 1].height &&
        points[i].height > points[i - 2].height &&
        points[i].height > points[i + 2].height
      ) {
        highPoints.push(points[i]);
      }
      if (
        points[i].height < points[i - 1].height &&
        points[i].height < points[i + 1].height &&
        points[i].height < points[i - 2].height &&
        points[i].height < points[i + 2].height
      ) {
        lowPoints.push(points[i]);
      }
    }

    return { tidePath, areaPath, maxY, highPoints, lowPoints };
  }, [points, plotW, plotH, padX, padY]);

  const xFor = (min: number) => padX + (min / (24 * 60)) * plotW;
  const yFor = (h: number) => padY + plotH - (h / maxY) * plotH;
  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  function formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: '200px' }}>
        <defs>
          <linearGradient id="tideAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(74,138,181,0.35)" />
            <stop offset="100%" stopColor="rgba(26,58,92,0.05)" />
          </linearGradient>
        </defs>

        {/* Hour grid */}
        {hours.map((h) => {
          const x = xFor(h * 60);
          return (
            <g key={`tg-${h}`}>
              <line x1={x} y1={padY} x2={x} y2={padY + plotH} stroke="rgba(74,138,181,0.06)" strokeWidth="0.5" />
              <text x={x} y={padY - 5} fill="rgba(74,138,181,0.4)" fontSize="8" textAnchor="middle">
                {h.toString().padStart(2, '0')}:00
              </text>
            </g>
          );
        })}

        {/* Tide area */}
        <path d={areaPath} fill="url(#tideAreaGrad)" />

        {/* Tide curve */}
        <path d={tidePath} fill="none" stroke="rgba(74,138,181,0.8)" strokeWidth="2" />

        {/* High tide markers */}
        {highPoints.map((p, i) => (
          <g key={`hi-${i}`}>
            <circle cx={xFor(p.minutes)} cy={yFor(p.height)} r="4" fill="rgba(74,138,181,1)" />
            <circle cx={xFor(p.minutes)} cy={yFor(p.height)} r="7" fill="none" stroke="rgba(74,138,181,0.3)" strokeWidth="1" />
            <text x={xFor(p.minutes)} y={yFor(p.height) - 10} fill="rgba(150,200,230,0.7)" fontSize="7" textAnchor="middle">
              {formatTime(p.minutes)}
            </text>
            <text x={xFor(p.minutes)} y={yFor(p.height) - 2} fill="rgba(150,200,230,0.5)" fontSize="6" textAnchor="middle">
              {p.height.toFixed(1)}m
            </text>
          </g>
        ))}

        {/* Low tide markers */}
        {lowPoints.map((p, i) => (
          <g key={`lo-${i}`}>
            <circle cx={xFor(p.minutes)} cy={yFor(p.height)} r="3" fill="rgba(200,180,150,0.8)" />
            <text x={xFor(p.minutes)} y={yFor(p.height) + 14} fill="rgba(200,180,150,0.5)" fontSize="7" textAnchor="middle">
              {formatTime(p.minutes)}
            </text>
          </g>
        ))}

        {/* Optimal time marker */}
        {optimalTimeMinutes >= 0 && optimalTimeMinutes <= 24 * 60 && (
          <g>
            <line
              x1={xFor(optimalTimeMinutes)}
              y1={padY - 5}
              x2={xFor(optimalTimeMinutes)}
              y2={padY + plotH}
              stroke="rgba(244,228,188,0.8)"
              strokeWidth="1.5"
            />
            <circle cx={xFor(optimalTimeMinutes)} cy={padY - 5} r="4" fill="rgba(244,228,188,1)" />
            <circle cx={xFor(optimalTimeMinutes)} cy={padY - 5} r="7" fill="none" stroke="rgba(244,228,188,0.4)" strokeWidth="1" />
          </g>
        )}

        {/* Y-axis labels */}
        <text x={padX - 5} y={padY + 5} fill="rgba(74,138,181,0.4)" fontSize="7" textAnchor="end">
          {maxY.toFixed(1)}m
        </text>
        <text x={padX - 5} y={padY + plotH} fill="rgba(74,138,181,0.4)" fontSize="7" textAnchor="end">
          0m
        </text>
      </svg>
    </div>
  );
}
