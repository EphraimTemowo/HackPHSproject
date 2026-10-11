import { X, Waves, Cloud, Wind, Moon, Link2, TrendingUp, Droplet, Thermometer, Eye, Compass, Clock, Sparkles, Fish, Zap, Snowflake, Orbit, Globe, Sun } from 'lucide-react';
import MoonPhaseSVG from './MoonPhaseSVG';
import TideChart from './TideChart';
import type { MoonPhaseInfo, MoonPositionInfo, OptimalTimeInfo, TideInfo, TidePoint, NextPhaseInfo } from '@/lib/astronomy';
import { getTideRangeFromPhase, getLibration } from '@/lib/astronomy';
import type { WeatherData } from '@/lib/api';
import { weatherCodeToString } from '@/lib/api';

interface MoonInfoModalProps {
  open: boolean;
  onClose: () => void;
  moonPhase: MoonPhaseInfo;
  moonPosition: MoonPositionInfo;
  optimalTime: OptimalTimeInfo;
  tideInfo: TideInfo;
  weather: WeatherData | null;
  beachName: string;
  tidePoints: TidePoint[];
  nextPhase: NextPhaseInfo;
  moonrise: Date | null;
  moonset: Date | null;
  date: Date;
  lat: number;
  lon: number;
}

export default function MoonInfoModal({
  open,
  onClose,
  moonPhase,
  moonPosition,
  optimalTime,
  tideInfo,
  weather,
  beachName,
  tidePoints,
  nextPhase,
  moonrise,
  moonset,
  date,
  lat,
  lon,
}: MoonInfoModalProps) {
  if (!open) return null;

  const illuminationPct = Math.round(moonPhase.illumination * 100);
  const tideRange = getTideRangeFromPhase(moonPhase.phaseFraction);
  const libration = getLibration(date);
  const timeStr = optimalTime.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const nextPhaseDays = Math.round(nextPhase.daysUntil);

  const fmtTime = (d: Date | null) => {
    if (!d) return '—';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);
  const optimalMinutes = (optimalTime.time.getTime() - localMidnight.getTime()) / 60000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-night-deep/80 backdrop-blur-md" />

      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto custom-scroll bg-gradient-to-b from-night-dark to-night-deep border border-moon-mid/20 rounded-3xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-night-light/40 hover:bg-night-light/70 text-moon-mid hover:text-moon-light transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(244,228,188,0.15) 0%, transparent 70%)',
                  transform: 'scale(1.3)',
                }}
              />
              <MoonPhaseSVG phaseFraction={moonPhase.phaseFraction} size={120} glow />
            </div>
            <h3 className="font-serif text-3xl font-light text-moon-light moon-text-glow">
              {moonPhase.phaseName}
            </h3>
            <p className="text-sm font-light text-moon-mid/60 mt-1">
              {illuminationPct}% illuminated · {moonPhase.age.toFixed(1)} days into the cycle
            </p>
            {moonPhase.isNearPerigee && (
              <p className="text-xs font-light text-moon-glow/60 mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Super moon conditions — {moonPhase.distancePercent.toFixed(0)}% of average distance
              </p>
            )}
            {moonPhase.isNearApogee && (
              <p className="text-xs font-light text-moon-mid/50 mt-1 flex items-center justify-center gap-1">
                <Orbit className="w-3 h-3" /> Micro moon conditions — {moonPhase.distancePercent.toFixed(0)}% of average distance
              </p>
            )}
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            <MiniStat icon={<Compass className="w-4 h-4" />} label="Azimuth" value={`${moonPosition.azimuth.toFixed(0)}°`} />
            <MiniStat icon={<TrendingUp className="w-4 h-4" />} label="Altitude" value={`${moonPosition.altitude.toFixed(0)}°`} />
            <MiniStat icon={<Moon className="w-4 h-4" />} label="Distance" value={`${Math.round(moonPhase.distance).toLocaleString()} km`} />
            <MiniStat icon={<Sun className="w-4 h-4" />} label="Angular Ø" value={`${moonPhase.angularDiameter.toFixed(2)}°`} />
            <MiniStat icon={<Sparkles className="w-4 h-4" />} label="Libration" value={`λ${libration.longitude.toFixed(1)}°`} />
            <MiniStat icon={<Clock className="w-4 h-4" />} label="Next phase" value={`${nextPhaseDays}d`} />
          </div>

          {/* Moonrise / Moonset */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm font-light text-moon-mid/60">
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-moon-glow/50" /> Moonrise: {fmtTime(moonrise)}</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-moon-mid/40 rotate-180" /> Moonset: {fmtTime(moonset)}</span>
          </div>

          {/* Why this is the optimal time */}
          <Section title="Why this is the optimal time" icon={<Clock />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              At <span className="text-moon-glow">{timeStr}</span>, the conditions at {beachName} align for
              the best beach experience today. Here's what the Moon's position means:
            </p>
            <ul className="mt-3 space-y-2">
              {optimalTime.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-light text-moon-light/70">
                  <span className="text-moon-glow/60 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Tides — expanded */}
          <Section title="The Moon's effect on tides" icon={<Waves />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              The Moon is the primary driver of ocean tides. Its gravitational pull creates two tidal
              bulges in the ocean: one on the side of Earth facing the Moon (direct gravitational
              attraction) and one on the opposite side (inertial/centrifugal effect). As the Earth
              rotates, coastlines pass through these bulges, experiencing two high tides and two low
              tides roughly every 24 hours and 50 minutes — the extra 50 minutes comes from the Moon's
              own orbital motion, which shifts the bulges slightly eastward each day.
            </p>

            {/* Tide chart */}
            <div className="mt-4 bg-night-light/15 border border-moon-mid/10 rounded-xl p-3">
              <p className="text-xs font-light text-moon-mid/50 mb-2 text-center">Estimated tide curve — 24 hours</p>
              <TideChart points={tidePoints} optimalTimeMinutes={optimalMinutes} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoBox
                label="Current tide"
                value={tideInfo.state.charAt(0).toUpperCase() + tideInfo.state.slice(1)}
                desc={tideInfo.description}
              />
              <InfoBox
                label="Tide type today"
                value={tideRange.type === 'spring' ? 'Spring' : tideRange.type === 'neap' ? 'Neap' : 'Transitional'}
                desc={tideRange.rangeDescription}
              />
            </div>

            <div className="mt-4 space-y-3 text-sm font-light text-moon-light/70">
              <TideMechanicRow
                title="Spring tides"
                desc="During new and full moons, the Sun and Moon align their gravitational pull along the same axis. This alignment amplifies the tidal range — higher high tides and lower low tides. The name comes from the tide 'springing forth,' not the season."
                active={tideRange.type === 'spring'}
              />
              <TideMechanicRow
                title="Neap tides"
                desc="During first and last quarter moons, the Sun and Moon pull at right angles to each other. Their gravitational forces partially cancel out, producing the smallest tidal range — lower high tides and higher low tides."
                active={tideRange.type === 'neap'}
              />
              <TideMechanicRow
                title="Lunitidal interval"
                desc="High tide doesn't occur exactly when the Moon is overhead — it lags by a location-specific delay called the lunitidal interval. This delay (ranging from minutes to hours) depends on ocean depth, coastline shape, and seafloor topography. Our estimates approximate this delay."
                active={false}
              />
              <TideMechanicRow
                title="Perigean tides"
                desc="When a spring tide coincides with lunar perigee (closest approach), the tide range is further amplified by about 5%. These 'king tides' can cause minor coastal flooding, especially during storm surges."
                active={moonPhase.isNearPerigee && tideRange.type === 'spring'}
              />
            </div>
          </Section>

          {/* Atmosphere — expanded */}
          <Section title="The Moon's effect on the atmosphere" icon={<Wind />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              While the Sun dominates atmospheric heating, the Moon has subtle but measurable effects
              on our atmosphere that ripple through the beach experience:
            </p>
            <ul className="mt-3 space-y-3 text-sm font-light text-moon-light/70">
              <li className="flex items-start gap-2">
                <Droplet className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Atmospheric tides:</strong> Just as the
                  Moon creates ocean tides, it creates daily pressure variations in the atmosphere of about
                  0.1–0.2 hPa (hectopascals). While tiny compared to weather-driven pressure changes, these
                  lunar atmospheric tides are measurable with sensitive barometers and are most pronounced
                  in equatorial regions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Wind className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Wind patterns:</strong> Lunar
                  gravitational effects contribute to very slight daily wind cycles. While these are
                  overwhelmed by thermal winds (sea breezes, land breezes), they can subtly influence the
                  timing of coastal wind shifts — particularly on calm, clear nights when thermal winds
                  are weak.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Night sky brightness:</strong> With{' '}
                  {illuminationPct}% illumination, the Moon{" "}
                  {illuminationPct > 60
                    ? 'significantly brightens the night sky, reducing star visibility (especially near the Moon) but creating beautiful moonlit landscapes with distinct shadows and silvery reflections on the water.'
                    : illuminationPct > 20
                    ? 'moderately brightens the night, offering a balance between star visibility and moonlit ambiance. The Milky Way may be partially visible away from the Moon.'
                    : 'leaves the sky dark, ideal for stargazing and deep-sky observation. Beaches far from city lights become premier astronomy sites under these conditions.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Earth's atmosphere refraction:</strong>{" "}
                  When the Moon is near the horizon (rising or setting), Earth's atmosphere bends its light
                  by about 0.5°, making it appear higher than it actually is. This also distorts the Moon
                  into an oval shape and can give it a reddish-orange tint — the same effect that causes
                  red sunsets. Beach horizons offer an unobstructed view of this phenomenon.
                </span>
              </li>
            </ul>
          </Section>

          {/* Weather — expanded */}
          <Section title="The Moon and weather" icon={<Cloud />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              The Moon's influence on weather is subtle and indirect, but it ties into the beach
              experience in several important ways:
            </p>
            <ul className="mt-3 space-y-3 text-sm font-light text-moon-light/70">
              <li className="flex items-start gap-2">
                <Thermometer className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Temperature regulation:</strong>{" "}
                  Moonlit nights with clear skies allow more infrared radiation to escape into space,
                  making them slightly cooler than cloudy nights. A bright full moon can raise the
                  surface temperature by an immeasurably tiny amount (its reflected light carries
                  negligible heat), but the real effect is psychological — moonlit beaches feel less
                  foreboding, encouraging longer evening visits.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Waves className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Coastal flooding &amp; king tides:</strong>{" "}
                  Spring tides during full and new moons — especially at perigee — can cause higher-than-normal
                  water levels called king tides. Combined with onshore winds and low atmospheric pressure,
                  this can lead to minor coastal flooding. Beachgoers should be aware that the dry sand
                  area may be significantly reduced during these events.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Thunderstorm correlation:</strong>{" "}
                  Some studies suggest a weak statistical correlation between lunar phases and rainfall
                  patterns, possibly linked to the atmospheric tide. The effect is small (~1% variation)
                  but has been detected in long-term tropical rainfall data.
                </span>
              </li>
              {weather && (
                <li className="flex items-start gap-2">
                  <Cloud className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="font-medium text-moon-light/90">Current conditions at {beachName}:</strong>{" "}
                    {weatherCodeToString(weather.current.weatherCode)} at{' '}
                    {weather.current.temperature.toFixed(0)}°C with{' '}
                    {weather.current.windSpeed.toFixed(0)} km/h winds,{' '}
                    {weather.current.humidity.toFixed(0)}% humidity, and{' '}
                    {weather.current.cloudCover.toFixed(0)}% cloud cover.{' '}
                    {weather.current.cloudCover < 30
                      ? 'Clear skies mean excellent moon viewing tonight.'
                      : weather.current.cloudCover < 70
                      ? 'Partly cloudy — the Moon may peek through gaps in the clouds, creating dramatic light shafts.'
                      : 'Overcast — the Moon will be diffused behind cloud cover, but its glow may still illuminate the cloud bottoms.'}
                  </span>
                </li>
              )}
            </ul>
          </Section>

          {/* Marine life — new section */}
          <Section title="The Moon and marine life" icon={<Fish />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              The Moon's gravitational rhythm governs life in the ocean as much as it governs the tides
              themselves. Many marine species have evolved to synchronize their behavior with lunar cycles:
            </p>
            <ul className="mt-3 space-y-3 text-sm font-light text-moon-light/70">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Bioluminescent plankton:</strong>{" "}
                  Many beaches around the world glow with blue light from bioluminescent dinoflagellates.
                  These organisms are most active during new moon periods (dark skies) and after wave
                  disturbance — making moonless, post-surf nights the best time to see this glow.
                  A {illuminationPct > 50 ? 'bright' : 'dark'} Moon tonight means bioluminescence will be{' '}
                  {illuminationPct > 50 ? 'harder to see — the moonlight washes out the glow' : 'more visible against the dark sky'}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Fish className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Coral spawning:</strong> Many coral
                  species release eggs and sperm en masse during specific moon phases — typically a few
                  nights after a full moon in summer. This synchronized release turns the water milky
                  and is one of nature's most spectacular mass breeding events, timed to the lunar cycle
                  for maximum fertilization success.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Waves className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Grunion runs:</strong> On certain
                  California beaches, small silvery fish called grunion ride the high spring tides onto
                  the sand to spawn — literally flopping out of the water. This happens only during the
                  few nights following a full or new moon, timed precisely to the highest tides.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Snowflake className="w-4 h-4 text-moon-glow/50 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="font-medium text-moon-light/90">Horseshoe crab mating:</strong> On
                  Atlantic coast beaches, horseshoe crabs come ashore to lay eggs during spring tides
                  around the full and new moon in May and June. Their eggs are a critical food source
                  for migrating shorebirds, making these lunar-scheduled events ecologically vital.
                </span>
              </li>
            </ul>
          </Section>

          {/* Perigee / Apogee — new section */}
          <Section title="Lunar distance &amp; super moons" icon={<Orbit />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              The Moon's orbit is elliptical, not circular. Its distance from Earth varies by about
              42,000 km over each orbit:
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <InfoBox
                label="Current distance"
                value={`${Math.round(moonPhase.distance).toLocaleString()} km`}
                desc={`${moonPhase.distancePercent.toFixed(0)}% of average (${Math.round(moonPhase.angularDiameter * 60)}′ apparent size)`}
              />
              <InfoBox
                label="Perigee (closest)"
                value="~363,300 km"
                desc={moonPhase.isNearPerigee ? 'Currently near perigee' : 'Moon appears ~14% larger than at apogee'}
              />
              <InfoBox
                label="Apogee (farthest)"
                value="~405,500 km"
                desc={moonPhase.isNearApogee ? 'Currently near apogee' : 'Moon appears ~12% smaller than at perigee'}
              />
            </div>
            <p className="mt-3 text-xs font-light text-moon-mid/50 leading-relaxed">
              When a full or new moon coincides with perigee, it's called a supermoon. The Moon appears
              up to 14% larger and 30% brighter than at apogee. This also amplifies tide ranges by
              roughly 5%. The Moon's current angular diameter is {moonPhase.angularDiameter.toFixed(3)}°
              ({Math.round(moonPhase.angularDiameter * 60)} arcminutes) — compare this to the Sun's
              ~30 arcminutes, which is why solar eclipses can be total or annular depending on the
              Moon's distance.
            </p>
          </Section>

          {/* How it all connects — expanded */}
          <Section title="How it all ties together" icon={<Link2 />}>
            <p className="text-sm font-light text-moon-light/80 leading-relaxed">
              The Moon's phase, position, distance, and gravitational influence form an interconnected
              system that shapes every aspect of your beach experience:
            </p>
            <div className="mt-4 space-y-3">
              <ConnectionRow from="Moon phase" to="Tide range" desc="Spring tides at new and full moon create the most dramatic tidal swings — wider beaches at low tide, but higher flood risk and stronger currents." />
              <ConnectionRow from="Moon position" to="Tide timing" desc="High tide follows the Moon's transit (highest point in the sky) by a location-specific delay called the lunitidal interval, typically 1–3 hours." />
              <ConnectionRow from="Moon illumination" to="Night visibility" desc="A bright Moon extends usable beach hours into the night, making evening visits safer and more magical — but reduces star and bioluminescence visibility." />
              <ConnectionRow from="Tide state" to="Beach width" desc="Low tide exposes more sand, tide pools, and marine life. The optimal time favors falling or low tide for maximum beach space and exploration." />
              <ConnectionRow from="Moon + Sun" to="Golden hour magic" desc="When the Moon is visible during golden hour, you get warm sunset light and moonlight simultaneously — the most photogenic beach conditions possible." />
              <ConnectionRow from="Moon distance" to="Tide amplitude" desc="At perigee, the Moon's gravitational pull is stronger, amplifying tide ranges by ~5%. Combined with spring tide alignment, this creates king tides." />
              <ConnectionRow from="Moon phase" to="Marine life" desc="Coral spawning, grunion runs, and horseshoe crab mating are all timed to specific moon phases, making certain nights uniquely biodiverse on the beach." />
              <ConnectionRow from="Moon altitude" to="Shadow length" desc="A high Moon casts short shadows; a low Moon casts long, dramatic shadows across the sand — changing the entire visual mood of the beach." />
              <ConnectionRow from="Atmospheric refraction" to="Moon color" desc="Near the horizon, the Moon appears flattened and reddened by atmospheric refraction — the same effect as a red sunset, creating stunning moonrise views over the ocean." />
            </div>
          </Section>

          {/* Astronomical data table — expanded */}
          <div className="mt-8 pt-6 border-t border-moon-mid/15">
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-moon-mid/50 mb-4">
              Astronomical data
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
              <DataRow label="Phase angle" value={`${(moonPhase.phaseFraction * 360).toFixed(1)}°`} />
              <DataRow label="Illumination" value={`${illuminationPct}%`} />
              <DataRow label="Moon age" value={`${moonPhase.age.toFixed(1)} days`} />
              <DataRow label="Distance" value={`${Math.round(moonPhase.distance).toLocaleString()} km`} />
              <DataRow label="Angular diameter" value={`${moonPhase.angularDiameter.toFixed(3)}°`} />
              <DataRow label="Apparent size" value={`${Math.round(moonPhase.angularDiameter * 60)}′`} />
              <DataRow label="Declination" value={`${moonPosition.declination.toFixed(1)}°`} />
              <DataRow label="Right ascension" value={`${moonPosition.rightAscension.toFixed(2)}h`} />
              <DataRow label="Ecliptic longitude" value={`${moonPosition.eclipticLongitude.toFixed(1)}°`} />
              <DataRow label="Azimuth" value={`${moonPosition.azimuth.toFixed(0)}°`} />
              <DataRow label="Altitude" value={`${moonPosition.altitude.toFixed(1)}°`} />
              <DataRow label="Libration (lon)" value={`${libration.longitude.toFixed(1)}°`} />
              <DataRow label="Libration (lat)" value={`${libration.latitude.toFixed(1)}°`} />
              <DataRow label="Synodic month" value="29.5306 days" />
              <DataRow label="Next: " value={`${nextPhase.name} (${nextPhaseDays}d)`} />
              <DataRow label="Tide range" value={tideRange.rangeMultiplier > 1 ? 'Spring (amplified)' : tideRange.rangeMultiplier < 1 ? 'Neap (reduced)' : 'Transitional'} />
              <DataRow label="Moonrise" value={fmtTime(moonrise)} />
              <DataRow label="Moonset" value={fmtTime(moonset)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-moon-glow/70">{icon}</span>
        <h4 className="font-serif text-lg font-light text-moon-light">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-night-light/20 border border-moon-mid/10 rounded-xl py-2.5 px-1">
      <div className="text-moon-glow/50 mb-1">{icon}</div>
      <p className="text-[10px] font-light text-moon-mid/40 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-light text-moon-light mt-0.5">{value}</p>
    </div>
  );
}

function InfoBox({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="bg-night-light/20 border border-moon-mid/10 rounded-xl p-3">
      <p className="text-xs font-light text-moon-mid/50 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-moon-light mt-1">{value}</p>
      <p className="text-xs font-light text-moon-mid/50 mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

function TideMechanicRow({ title, desc, active }: { title: string; desc: string; active: boolean }) {
  return (
    <div className={`rounded-xl p-3 border ${active ? 'bg-moon-glow/5 border-moon-glow/20' : 'bg-night-light/10 border-moon-mid/8'}`}>
      <p className="text-sm font-medium text-moon-light/90 mb-1 flex items-center gap-2">
        {title}
        {active && <span className="text-[10px] text-moon-glow/70 bg-moon-glow/10 rounded px-1.5 py-0.5">NOW</span>}
      </p>
      <p className="text-xs font-light text-moon-mid/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function ConnectionRow({ from, to, desc }: { from: string; to: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-night-light/15 border border-moon-mid/8 rounded-xl p-3">
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
        <span className="text-xs font-medium text-moon-glow/80 bg-moon-glow/10 rounded px-2 py-1">{from}</span>
        <span className="text-moon-mid/40 text-xs">→</span>
        <span className="text-xs font-medium text-moon-light/80 bg-night-light/40 rounded px-2 py-1">{to}</span>
      </div>
      <p className="text-xs font-light text-moon-mid/60 leading-relaxed flex-1">{desc}</p>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-light text-moon-mid/50">{label}</span>
      <span className="text-xs font-light text-moon-light/80">{value}</span>
    </div>
  );
}
