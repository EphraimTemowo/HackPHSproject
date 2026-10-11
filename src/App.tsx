import { useState, useCallback, useEffect, useMemo } from 'react';
import HeroScene from './components/HeroScene';
import SearchSection from './components/SearchSection';
import ResultsSection from './components/ResultsSection';
import MoonInfoModal from './components/MoonInfoModal';
import {
  getMoonPhase,
  getMoonPosition,
  getOptimalBeachTime,
  getTideState,
  type MoonPhaseInfo,
  type MoonPositionInfo,
  type OptimalTimeInfo,
  type TideInfo,
} from './lib/astronomy';
import {
  getWeather,
  type BeachLocation,
  type WeatherData,
} from './lib/api';

export default function App() {
  const [beach, setBeach] = useState<BeachLocation | null>(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Computed moon data
  const moonPhase: MoonPhaseInfo | null = useMemo(() => {
    if (!beach) return null;
    return getMoonPhase(date);
  }, [beach, date]);

  const moonPosition: MoonPositionInfo | null = useMemo(() => {
    if (!beach) return null;
    return getMoonPosition(date, beach.lat, beach.lon);
  }, [beach, date]);

  const optimalTime: OptimalTimeInfo | null = useMemo(() => {
    if (!beach) return null;
    // Use weather for scoring if we have it
    const weatherForOptimal = weather
      ? {
          hourly: {
            time: weather.hourly.time,
            temperature: weather.hourly.temperature,
            windSpeed: weather.hourly.windSpeed,
            precipitation: weather.hourly.precipitation,
            cloudCover: weather.hourly.cloudCover,
          },
        }
      : null;
    return getOptimalBeachTime(date, beach.lat, beach.lon, weatherForOptimal);
  }, [beach, date, weather]);

  const tideInfo: TideInfo | null = useMemo(() => {
    if (!beach) return null;
    return getTideState(optimalTime?.time || date, beach.lat, beach.lon);
  }, [beach, date, optimalTime]);

  // Fetch weather when beach or date changes
  useEffect(() => {
    if (!beach) return;
    let cancelled = false;
    setWeatherLoading(true);
    getWeather(beach.lat, beach.lon, date)
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
        }
      })
      .catch((err) => {
        console.error('Weather fetch failed:', err);
        if (!cancelled) setWeather(null);
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [beach, date]);

  // Handle beach selection
  const handleBeachSelect = useCallback((selected: BeachLocation) => {
    setLoading(true);
    setBeach(selected);
    // Scroll to results after a brief moment for state to update
    setTimeout(() => {
      setLoading(false);
      const resultsEl = document.getElementById('results-section');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Scroll to search section
  const scrollToSearch = useCallback(() => {
    const el = document.getElementById('search-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-night-deep">
      {/* Hero scene — always visible at top */}
      <HeroScene onScrollDown={scrollToSearch} />

      {/* Search section */}
      <SearchSection onBeachSelect={handleBeachSelect} loading={loading} />

      {/* Results section — shown when a beach is selected */}
      {beach && moonPhase && moonPosition && optimalTime && tideInfo && (
        <div id="results-section">
          <ResultsSection
            beach={beach}
            date={date}
            moonPhase={moonPhase}
            moonPosition={moonPosition}
            optimalTime={optimalTime}
            tideInfo={tideInfo}
            weather={weather}
            weatherLoading={weatherLoading}
            onMoonClick={() => setModalOpen(true)}
            onDateChange={setDate}
            datePickerOpen={datePickerOpen}
            setDatePickerOpen={setDatePickerOpen}
          />
        </div>
      )}

      {/* Moon info modal */}
      {beach && moonPhase && moonPosition && optimalTime && tideInfo && (
        <MoonInfoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          moonPhase={moonPhase}
          moonPosition={moonPosition}
          optimalTime={optimalTime}
          tideInfo={tideInfo}
          weather={weather}
          beachName={beach.name}
        />
      )}

      {/* Footer */}
      {beach && (
        <footer className="bg-night-deep py-8 px-4 text-center border-t border-moon-mid/10">
          <p className="font-serif text-lg font-light text-moon-mid/40">
            Praia da Lúa
          </p>
          <p className="text-xs font-light text-moon-mid/30 mt-1">
            Moon phase, position, and tide calculations based on astronomical algorithms.
            Tide estimates are approximate — consult local tide tables for precise data.
          </p>
        </footer>
      )}
    </div>
  );
}
