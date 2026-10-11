import { Calendar, Loader2, Info, Waves, Wind, Sun, Clock, Moon, Sunrise, Sunset, ArrowUpDown, Sparkles, Droplet, Cloud } from 'lucide-react';
import MoonPhaseSVG from './MoonPhaseSVG';
import Starfield from './Starfield';
import MoonTimeline from './MoonTimeline';
import TideChart from './TideChart';
import type { MoonPhaseInfo, MoonPositionInfo, OptimalTimeInfo, TideInfo, AltitudePoint, TidePoint, NextPhaseInfo } from '@/lib/astronomy';
import type { BeachLocation, WeatherData } from '@/lib/api';
import { weatherCodeToString } from '@/lib/api';

interface ResultsSectionProps {
  beach: BeachLocation;
  date: Date;
  moonPhase: MoonPhaseInfo;
  moonPosition: MoonPositionInfo;
  optimalTime: OptimalTimeInfo;
  tideInfo: TideInfo;
  weather: WeatherData | null;
  weatherLoading: boolean;
  altitudePoints: AltitudePoint[];
  tidePoints: TidePoint[];
  nextPhase: NextPhaseInfo;
  moonrise: Date | null;
  moonset: Date | null;
  sunrise: Date | null;
  sunset: Date | null;
  moonTransit: Date | null;
  onMoonClick: () => void;
  onDateChange: (date: Date) => void;
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
}

export default function ResultsSection({
  beach,
  date,
  moonPhase,
  moonPosition,
  optimalTime,
  tideInfo,
  weather,
  weatherLoading,
  altitudePoints,
  tidePoints,
  nextPhase,
  moonrise,
  moonset,
  sunrise,
  sunset,
  moonTransit,
  onMoonClick,
  onDateChange,
  datePickerOpen,
  setDatePickerOpen,
}: ResultsSectionProps) {
  const timeStr = optimalTime.time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: undefined,
  });

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const illuminationPct = Math.round(moonPhase.illumination * 100);

  const fmtTime = (d: Date | null) => {
    if (!d) return '—';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: undefined });
  };

  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);
  const minsFromMidnight = (d: Date | null) => {
    if (!d) return null;
    return (d.getTime() - localMidnight.getTime()) / 60000;
  };

  const optimalMinutes = minsFromMidnight(optimalTime.time) ?? 0;

  const nextPhaseDays = Math.round(nextPhase.daysUntil);
  const nextPhaseDate = nextPhase.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-night-mid via-night-dark to-night-deep">
      <Starfield count={80} />

      {/* Date picker button — top right corner */}
      <div className="absolute top-6 right-6 z-30">
        <div className="relative">
          <button
            onClick={() => setDatePickerOpen(!datePickerOpen)}
            className="flex items-center gap-2 bg-night-light/50 backdrop-blur-md border border-moon-mid/20 rounded-full px-4 py-2.5 text-moon-light hover:border-moon-glow/50 hover:bg-night-light/70 transition-all duration-300 group"
          >
            <Calendar className="w-4 h-4 text-moon-glow/70 group-hover:text-moon-glow transition-colors" />
            <span className="text-xs font-light tracking-wide">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </button>

          {datePickerOpen && (
            <div className="absolute top-full mt-2 right-0 bg-night-dark/95 backdrop-blur-lg border border-moon-mid/20 rounded-2xl shadow-2xl p-4 animate-slide-up z-40">
              <div className="flex flex-col gap-3 w-56">
                <p className="text-xs font-light text-moon-mid/60 tracking-wide uppercase">Select date</p>
                <input
                  type="date"
                  value={date.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      onDateChange(newDate);
                    }
                  }}
                  className="bg-night-light/50 border border-moon-mid/20 rounded-lg px-3 py-2 text-moon-light text-sm font-light focus:outline-none focus:border-moon-glow/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { onDateChange(new Date()); setDatePickerOpen(false); }}
                    className="flex-1 text-xs font-light text-moon-glow/70 bg-moon-glow/5 border border-moon-glow/15 rounded-lg py-2 hover:bg-moon-glow/10 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      onDateChange(tomorrow);
                      setDatePickerOpen(false);
                    }}
                    className="flex-1 text-xs font-light text-moon-glow/70 bg-moon-glow/5 border border-moon-glow/15 rounded-lg py-2 hover:bg-moon-glow/10 transition-colors"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 pt-24">
        {/* Beach name */}
        <div className="text-center mb-2 animate-fade-in">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-moon-mid/50">
            {beach.displayName.split(',').slice(-1)[0]?.trim()}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-moon-light mt-1 moon-text-glow">
            {beach.name}
          </h2>
        </div>

        {/* Date display */}
        <p className="text-sm font-light text-moon-mid/60 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {dateStr}
        </p>

        {/* The Moon — centered, clickable */}
        <button
          onClick={onMoonClick}
          className="group relative animate-scale-in"
          style={{ animationDelay: '0.2s' }}
          aria-label="Click the Moon for details"
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(244,228,188,0.2) 0%, transparent 70%)',
              transform: 'scale(1.5)',
              animation: 'glow-pulse 4s ease-in-out infinite',
            }}
          />
          <div className="relative transition-transform duration-500 group-hover:scale-105">
            <MoonPhaseSVG phaseFraction={moonPhase.phaseFraction} size={280} glow />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-moon-mid/50 group-hover:text-moon-glow/80 transition-colors duration-300">
            <Info className="w-3.5 h-3.5" />
            <span className="text-xs font-light tracking-wide">Click the Moon for details</span>
          </div>
        </button>

        {/* Phase name */}
        <div className="mt-14 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="font-serif text-2xl md:text-3xl font-light text-moon-light">
            {moonPhase.phaseName}
          </p>
          <p className="text-sm font-light text-moon-mid/60 mt-1">
            {illuminationPct}% illuminated · {moonPhase.age.toFixed(1)} days old
          </p>
          {moonPhase.isNearPerigee && (
            <p className="text-xs font-light text-moon-glow/60 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Near perigee — closest to Earth, appears larger
            </p>
          )}
          {moonPhase.isNearApogee && (
            <p className="text-xs font-light text-moon-mid/50 mt-1">
              Near apogee — farthest from Earth, appears smaller
            </p>
          )}
        </div>

        {/* Next phase */}
        <div className="mt-4 flex items-center gap-2 text-xs font-light text-moon-mid/50 bg-night-light/20 border border-moon-mid/10 rounded-full px-4 py-2 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <Moon className="w-3 h-3 text-moon-glow/50" />
          <span>Next: {nextPhase.name} in {nextPhaseDays} day{nextPhaseDays !== 1 ? 's' : ''} ({nextPhaseDate})</span>
        </div>

        {/* Optimal time */}
        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-xs font-light tracking-[0.2em] uppercase text-moon-mid/50 text-center mb-3">
            Most optimal time to visit
          </p>
          <div className="flex items-center gap-3 bg-night-light/30 backdrop-blur-md border border-moon-glow/20 rounded-2xl px-8 py-4">
            <Clock className="w-6 h-6 text-moon-glow/70" />
            <span className="font-serif text-3xl md:text-4xl font-light text-moon-light moon-text-glow">
              {timeStr}
            </span>
          </div>
          <p className="text-xs font-light text-moon-mid/50 text-center mt-3 max-w-md">
            {optimalTime.reasons.slice(0, 2).join(' · ')}
          </p>
        </div>

        {/* Rise/Set/Transit row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl w-full animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
          <TimeCard icon={<Sunrise className="w-4 h-4" />} label="Moonrise" value={fmtTime(moonrise)} />
          <TimeCard icon={<Sunset className="w-4 h-4" />} label="Moonset" value={fmtTime(moonset)} />
          <TimeCard icon={<ArrowUpDown className="w-4 h-4" />} label="Transit" value={fmtTime(moonTransit)} />
          <TimeCard icon={<Sun className="w-4 h-4" />} label="Sunset" value={fmtTime(sunset)} />
        </div>

        {/* 24-hour altitude timeline */}
        <div className="mt-12 w-full max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="w-4 h-4 text-moon-glow/60" />
            <h3 className="text-sm font-light tracking-wide text-moon-mid/70 uppercase">Moon &amp; Sun altitude — 24h</h3>
          </div>
          <div className="bg-night-light/15 backdrop-blur-sm border border-moon-mid/10 rounded-2xl p-4">
            <MoonTimeline
              points={altitudePoints}
              optimalTimeMinutes={optimalMinutes}
              moonriseMinutes={minsFromMidnight(moonrise)}
              moonsetMinutes={minsFromMidnight(moonset)}
              sunriseMinutes={minsFromMidnight(sunrise)}
              sunsetMinutes={minsFromMidnight(sunset)}
            />
          </div>
        </div>

        {/* 24-hour tide chart */}
        <div className="mt-8 w-full max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.65s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-ocean-foam/60" />
            <h3 className="text-sm font-light tracking-wide text-moon-mid/70 uppercase">Tide curve — 24h</h3>
          </div>
          <div className="bg-night-light/15 backdrop-blur-sm border border-moon-mid/10 rounded-2xl p-4">
            <TideChart points={tidePoints} optimalTimeMinutes={optimalMinutes} />
          </div>
        </div>

        {/* Weather & tide quick stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <StatCard
            icon={<Waves className="w-5 h-5" />}
            label="Tide"
            value={tideInfo.state.charAt(0).toUpperCase() + tideInfo.state.slice(1)}
            sub={tideInfo.heightEstimate.toFixed(1) + 'm est.'}
          />
          <StatCard
            icon={<Sun className="w-5 h-5" />}
            label="Moon Alt."
            value={moonPosition.altitude.toFixed(0) + '°'}
            sub={moonPosition.altitude > 0 ? 'Above horizon' : 'Below horizon'}
          />
          {weatherLoading ? (
            <StatCard icon={<Loader2 className="w-5 h-5 animate-spin" />} label="Temp" value="..." sub="Loading" />
          ) : weather ? (
            <StatCard
              icon={<Sun className="w-5 h-5" />}
              label="Temp"
              value={weather.current.temperature.toFixed(0) + '°C'}
              sub={weatherCodeToString(weather.current.weatherCode)}
            />
          ) : (
            <StatCard icon={<Sun className="w-5 h-5" />} label="Temp" value="N/A" sub="No data" />
          )}
          {weatherLoading ? (
            <StatCard icon={<Loader2 className="w-5 h-5 animate-spin" />} label="Wind" value="..." sub="Loading" />
          ) : weather ? (
            <StatCard
              icon={<Wind className="w-5 h-5" />}
              label="Wind"
              value={weather.current.windSpeed.toFixed(0) + ' km/h'}
              sub={weather.current.windDirection.toFixed(0) + '°'}
            />
          ) : (
            <StatCard icon={<Wind className="w-5 h-5" />} label="Wind" value="N/A" sub="No data" />
          )}
        </div>

        {/* Additional weather stats */}
        {!weatherLoading && weather && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full animate-fade-in-up" style={{ animationDelay: '0.75s' }}>
            <StatCard icon={<Droplet className="w-5 h-5" />} label="Humidity" value={weather.current.humidity.toFixed(0) + '%'} sub="Relative" />
            <StatCard icon={<Cloud className="w-5 h-5" />} label="Cloud" value={weather.current.cloudCover.toFixed(0) + '%'} sub={weather.current.cloudCover < 30 ? 'Clear' : weather.current.cloudCover < 70 ? 'Partly cloudy' : 'Overcast'} />
            <StatCard
              icon={<Sun className="w-5 h-5" />}
              label="High/Low"
              value={weather.daily.tempMax[0]?.toFixed(0) + '°/' + weather.daily.tempMin[0]?.toFixed(0) + '°'}
              sub="Today's range"
            />
            <StatCard
              icon={<Moon className="w-5 h-5" />}
              label="Distance"
              value={Math.round(moonPhase.distance).toLocaleString()}
              sub={moonPhase.isNearPerigee ? 'Perigee (close)' : moonPhase.isNearApogee ? 'Apogee (far)' : 'km from Earth'}
            />
          </div>
        )}

        {/* Moon above/below indicator */}
        {optimalTime.moonAboveHorizon && (
          <div className="mt-8 flex items-center gap-2 text-moon-glow/50 text-xs font-light animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-moon-glow animate-pulse" />
            Moon visible at this time — {moonPosition.azimuth.toFixed(0)}° azimuth · {moonPosition.altitude.toFixed(0)}° altitude
          </div>
        )}

        {/* Full optimal time reasons */}
        <div className="mt-6 max-w-lg w-full animate-fade-in-up" style={{ animationDelay: '0.85s' }}>
          <p className="text-xs font-light tracking-wide text-moon-mid/50 uppercase mb-2 text-center">Why this time?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {optimalTime.reasons.map((reason, i) => (
              <span key={i} className="text-xs font-light text-moon-light/60 bg-night-light/20 border border-moon-mid/10 rounded-full px-3 py-1.5">
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col items-center bg-night-light/20 backdrop-blur-sm border border-moon-mid/15 rounded-xl py-4 px-3 text-center">
      <div className="text-moon-glow/60 mb-2">{icon}</div>
      <p className="text-xs font-light text-moon-mid/50 tracking-wide uppercase">{label}</p>
      <p className="text-lg font-light text-moon-light mt-1">{value}</p>
      <p className="text-xs font-light text-moon-mid/40 mt-0.5 truncate max-w-full">{sub}</p>
    </div>
  );
}

function TimeCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-night-light/20 backdrop-blur-sm border border-moon-mid/12 rounded-xl py-3 px-2 text-center">
      <div className="text-moon-glow/50 mb-1">{icon}</div>
      <p className="text-[10px] font-light text-moon-mid/50 tracking-wide uppercase">{label}</p>
      <p className="text-sm font-light text-moon-light mt-0.5">{value}</p>
    </div>
  );
}
