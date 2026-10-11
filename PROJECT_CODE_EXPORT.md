# Praia da Lúa — Complete Project Code Export

**Date exported:** 2026-10-11
**Project:** Moon phase, beach, and tide visualization app
**Stack:** React + TypeScript + Vite + Tailwind CSS + Lucide React

---

## Table of Contents

1. [index.html](#indexhtml)
2. [package.json](#packagejson)
3. [vite.config.ts](#viteconfigts)
4. [tsconfig.json](#tsconfigjson)
5. [tsconfig.app.json](#tsconfigappjson)
6. [tsconfig.node.json](#tsconfignodejson)
7. [tailwind.config.js](#tailwindconfigjs)
8. [postcss.config.js](#postcssconfigjs)
9. [eslint.config.js](#eslintconfigjs)
10. [src/main.tsx](#srcmaintsx)
11. [src/index.css](#srcindexcss)
12. [src/App.tsx](#srcapptsx)
13. [src/lib/astronomy.ts](#srclibastronomyts)
14. [src/lib/api.ts](#srclibapits)
15. [src/components/HeroScene.tsx](#srccomponentsheroscenetsx)
16. [src/components/SearchSection.tsx](#srccomponentssearchsectiontsx)
17. [src/components/ResultsSection.tsx](#srccomponentsresultssectiontsx)
18. [src/components/MoonInfoModal.tsx](#srccomponentsmooninfomodaltsx)
19. [src/components/MoonPhaseSVG.tsx](#srccomponentsmoonphasesvgtsx)
20. [src/components/MoonTimeline.tsx](#srccomponentsmoontimelinetsx)
21. [src/components/TideChart.tsx](#srccomponentstidecharttsx)
22. [src/components/Starfield.tsx](#srccomponentsstarfieldtsx)

---

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Praia da Lúa</title>
    <meta property="og:image" content="https://bolt.new/static/og_default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://bolt.new/static/og_default.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@200;300;400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## package.json

```json
{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.app.json"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "lucide-react": "^0.446.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.1",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

---

## vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

---

## tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

---

## tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

## tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

---

## tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        moon: {
          glow: '#f4e4bc',
          light: '#fdf6e3',
          mid: '#d4c5a0',
          dark: '#8a7e62',
          shadow: '#3a3530',
        },
        night: {
          deep: '#050714',
          dark: '#0a0f24',
          mid: '#131a38',
          light: '#1e2750',
        },
        ocean: {
          deep: '#0a1929',
          dark: '#0f2847',
          mid: '#1a3a5c',
          light: '#2a5a82',
          foam: '#4a8ab5',
        },
        sand: {
          light: '#e8dcc0',
          mid: '#c9b896',
          dark: '#9a8a6a',
        },
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'fade-in': 'fade-in 1.2s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25px) scaleY(1.05)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## eslint.config.js

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

---

## src/main.tsx

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: 'Outfit', sans-serif;
    background-color: #050714;
    overflow-x: hidden;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Moon glow text */
.moon-text-glow {
  text-shadow: 0 0 20px rgba(244, 228, 188, 0.5), 0 0 40px rgba(244, 228, 188, 0.2);
}

/* Custom scrollbar for modal */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(10, 15, 36, 0.5);
  border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(244, 228, 188, 0.3);
  border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(244, 228, 188, 0.5);
}

/* Water shimmer reflection */
.water-shimmer {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(74, 138, 181, 0.05) 30%,
    rgba(74, 138, 181, 0.1) 50%,
    rgba(74, 138, 181, 0.05) 70%,
    transparent 100%
  );
  background-size: 100% 4px;
  animation: shimmer-move 3s linear infinite;
}

@keyframes shimmer-move {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #fdf6e3 0%, #f4e4bc 50%, #d4c5a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Moon surface texture */
.moon-surface {
  background:
    radial-gradient(circle at 30% 30%, rgba(0,0,0,0.08) 1px, transparent 2px),
    radial-gradient(circle at 65% 45%, rgba(0,0,0,0.06) 1.5px, transparent 2.5px),
    radial-gradient(circle at 45% 65%, rgba(0,0,0,0.05) 1px, transparent 2px),
    radial-gradient(circle at 70% 70%, rgba(0,0,0,0.04) 1px, transparent 1.5px),
    radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0.8px, transparent 1.5px);
  background-size: 100% 100%;
}
```

---

## src/App.tsx

```typescript
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
```

---

## src/lib/astronomy.ts

```typescript
/**
 * Moon astronomy calculations — all based on well-known astronomical algorithms.
 * References: Jean Meeus, "Astronomical Algorithms" (1991).
 */

export interface MoonPhaseInfo {
  /** 0–1, fraction of the lunation cycle (0 = new, 0.5 = full) */
  phaseFraction: number;
  /** Illuminated fraction 0–1 */
  illumination: number;
  /** Human-readable phase name */
  phaseName: string;
  /** Emoji-style descriptor for logging */
  phaseEmoji: string;
  /** Moon age in days since last new moon */
  age: number;
  /** Angular diameter in degrees */
  angularDiameter: number;
  /** Distance from Earth in km */
  distance: number;
  /** Whether the Moon is near perigee (closest approach) */
  isNearPerigee: boolean;
  /** Whether the Moon is near apogee (farthest point) */
  isNearApogee: boolean;
  /** Percentage of average distance (100 = average) */
  distancePercent: number;
}

export interface AltitudePoint {
  /** Minutes from local midnight */
  minutes: number;
  /** Moon altitude in degrees */
  moonAltitude: number;
  /** Sun altitude in degrees */
  sunAltitude: number;
  /** Hour of day (0–23.99) */
  hour: number;
}

export interface NextPhaseInfo {
  name: string;
  /** Days until the next phase event */
  daysUntil: number;
  /** Estimated date of the next phase */
  date: Date;
  /** Current phase fraction target */
  targetFraction: number;
}

export interface TidePoint {
  /** Minutes from local midnight */
  minutes: number;
  /** Estimated tide height in meters */
  height: number;
  /** Hour of day */
  hour: number;
}

export interface MoonPositionInfo {
  /** Apparent ecliptic longitude in degrees */
  eclipticLongitude: number;
  /** Apparent geocentric right ascension in degrees */
  rightAscension: number;
  /** Apparent geocentric declination in degrees */
  declination: number;
  /** Azimuth in degrees (0 = North, 90 = East) */
  azimuth: number;
  /** Altitude above horizon in degrees */
  altitude: number;
}

export interface MoonriseSetInfo {
  moonrise: Date | null;
  moonset: Date | null;
}

// ---- Utility math ----

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}
function mod24(x: number): number {
  return ((x % 24) + 24) % 24;
}

/** Julian Day from a JS Date (UTC). */
function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Julian centuries from J2000.0 */
function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/** Mean sidereal time at Greenwich in degrees. */
function greenwichSiderealTime(jd: number): number {
  const T = julianCentury(jd);
  let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - (T * T * T) / 38710000;
  return mod360(theta);
}

// ---- Moon position (simplified Meeus) ----

/**
 * Geocentric ecliptic longitude of the Moon (simplified).
 * Accurate to ~0.3° — sufficient for visualization and beach planning.
 */
function moonEclipticLongitude(jd: number): number {
  const T = julianCentury(jd);
  const T2 = T * T;
  const T3 = T2 * T;

  // Mean longitude
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841;
  // Mean elongation
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868;
  // Mean anomaly of the Sun
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 - T3 / 24490000;
  // Mean anomaly of the Moon
  let Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699;
  // Argument of latitude
  let F = 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000;

  L = mod360(L);
  D = mod360(D);
  M = mod360(M);
  Mp = mod360(Mp);
  F = mod360(F);

  // Major periodic terms (summation of biggest terms from Meeus Table 47.A)
  const args: number[] = [D, M, Mp, F];
  function angle(dMul: number, mMul: number, mpMul: number, fMul: number): number {
    return (
      dMul * args[0] +
      mMul * args[1] +
      mpMul * args[2] +
      fMul * args[3]
    );
  }

  // Periodic terms for longitude (selected, biggest amplitudes)
  const terms: Array<[number, number, number, number, number]> = [
    [0, 0, 1, 0, 6288774],
    [2, 0, -1, 0, 1274027],
    [2, 0, 0, 0, 658322],
    [0, 0, 2, 0, 213618],
    [0, 1, 0, 0, -185116],
    [0, 0, 0, 2, -114332],
    [4, 0, -1, 0, 58793],
    [0, 0, 1, -2, 57066],
    [4, 0, -2, 0, 53322],
    [2, 1, -1, 0, 45758],
    [2, 1, 0, 0, -40923],
    [0, 1, -1, 0, -34720],
    [1, 0, 0, 0, -30383],
    [2, 0, 1, 0, 15327],
    [2, 0, -2, 0, -12528],
    [4, 0, 0, 0, 10980],
    [0, 0, 2, 2, 10675],
    [0, 2, 0, 0, 10034],
    [0, 1, 0, 2, -8548],
  ];

  let sum = 0;
  for (const [dM, mM, mpM, fM, coeff] of terms) {
    const a = angle(dM, mM, mpM, fM);
    sum += coeff * Math.sin(toRad(a));
  }

  const longitude = L + sum / 1000000;
  return mod360(longitude);
}

/** Moon ecliptic latitude (simplified — a few biggest terms). */
function moonEclipticLatitude(jd: number): number {
  const T = julianCentury(jd);
  const T2 = T * T;

  let D = mod360(297.8501921 + 445267.1114034 * T - 0.0018819 * T2);
  let Mp = mod360(134.9633964 + 477198.8675055 * T + 0.0087414 * T2);
  let F = mod360(93.272095 + 483202.0175233 * T - 0.0036539 * T2);

  function angle(dMul: number, mpMul: number, fMul: number): number {
    return dMul * D + mpMul * Mp + fMul * F;
  }

  const terms: Array<[number, number, number, number]> = [
    [0, 0, 1, 4889],
    [0, 1, 1, -2380],
    [2, 0, -1, -2364],
    [2, 0, 1, 1052],
    [0, 0, 3, 412],
    [2, 1, -1, -290],
  ];

  let sum = 0;
  for (const [dM, mpM, fM, coeff] of terms) {
    sum += coeff * Math.sin(toRad(angle(dM, mpM, fM)));
  }

  return sum / 1000000;
}

/** Moon distance in km (simplified). */
function moonDistance(jd: number): number {
  const T = julianCentury(jd);
  const T2 = T * T;

  let D = mod360(297.8501921 + 445267.1114034 * T - 0.0018819 * T2);
  let Mp = mod360(134.9633964 + 477198.8675055 * T + 0.0087414 * T2);
  let F = mod360(93.272095 + 483202.0175233 * T - 0.0036539 * T2);

  function angle(dMul: number, mpMul: number, fMul: number): number {
    return dMul * D + mpMul * Mp + fMul * F;
  }

  const terms: Array<[number, number, number, number]> = [
    [2, 0, 0, -20905355],
    [0, 0, 2, -3699111],
    [2, 0, -2, -2955968],
    [0, 1, 0, -569925],
    [0, 0, 1, 48888],
    [2, 0, 1, -3149],
  ];

  let sum = 0;
  for (const [dM, mpM, fM, coeff] of terms) {
    sum += coeff * Math.cos(toRad(angle(dM, mpM, fM)));
  }

  return 385000.56 + sum / 1000;
}

// ---- Equatorial coordinates from ecliptic ----

function eclipticToEquatorial(
  lambdaDeg: number,
  betaDeg: number,
  epsilonDeg: number
): { ra: number; dec: number } {
  const lam = toRad(lambdaDeg);
  const beta = toRad(betaDeg);
  const eps = toRad(epsilonDeg);

  const sinDec =
    Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lam);
  const dec = Math.asin(sinDec);

  const y = Math.sin(lam) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps);
  const x = Math.cos(lam);
  let ra = Math.atan2(y, x);
  ra = mod360(toDeg(ra)) / 15; // in hours

  return { ra, dec: toDeg(dec) };
}

/** Obliquity of the ecliptic in degrees. */
function obliquity(jd: number): number {
  const T = julianCentury(jd);
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T;
}

// ---- Horizontal coordinates ----

function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date
): { azimuth: number; altitude: number } {
  const jd = julianDay(date);
  const gst = greenwichSiderealTime(jd);
  const lst = mod24(gst / 15 + lonDeg / 15);
  const ha = mod24(lst - raHours) * 15;

  const lat = toRad(latDeg);
  const dec = toRad(decDeg);
  const har = toRad(ha);

  const sinAlt =
    Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(har);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

  const y = Math.sin(har);
  const x = Math.cos(har) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat);
  let az = Math.atan2(y, x);
  az = mod360(toDeg(az) + 180);

  return { azimuth: az, altitude: toDeg(alt) };
}

// ---- Moon phase ----

export function getMoonPhase(date: Date): MoonPhaseInfo {
  const jd = julianDay(date);
  const T = julianCentury(jd);

  const M = mod360(357.5291092 + 35999.0502909 * T);
  const L0 = mod360(280.4664567 + 360007.6982779 * T + 0.03032028 * T * T);
  const sunLong = mod360(L0 + 1.914666471 * Math.sin(toRad(M)) + 0.019994643 * Math.sin(toRad(2 * M)));
  const moonLong = moonEclipticLongitude(jd);

  const elongation = mod360(moonLong - sunLong);
  const phaseFraction = mod360(elongation) / 360;

  const illumination = (1 - Math.cos(toRad(elongation))) / 2;

  const synodicMonth = 29.530588853;
  const age = phaseFraction * synodicMonth;

  const distance = moonDistance(jd);
  const angularDiameter = (3474.8 / distance) * (180 / Math.PI);

  const avgDistance = 385000;
  const distancePercent = (distance / avgDistance) * 100;
  const isNearPerigee = distance < 370000;
  const isNearApogee = distance > 402000;

  let phaseName = '';
  let phaseEmoji = '';
  if (phaseFraction < 0.03 || phaseFraction > 0.97) {
    phaseName = 'New Moon';
    phaseEmoji = '🌑';
  } else if (phaseFraction < 0.22) {
    phaseName = 'Waxing Crescent';
    phaseEmoji = '🌒';
  } else if (phaseFraction < 0.28) {
    phaseName = 'First Quarter';
    phaseEmoji = '🌓';
  } else if (phaseFraction < 0.47) {
    phaseName = 'Waxing Gibbous';
    phaseEmoji = '🌔';
  } else if (phaseFraction < 0.53) {
    phaseName = 'Full Moon';
    phaseEmoji = '🌕';
  } else if (phaseFraction < 0.72) {
    phaseName = 'Waning Gibbous';
    phaseEmoji = '🌖';
  } else if (phaseFraction < 0.78) {
    phaseName = 'Last Quarter';
    phaseEmoji = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    phaseEmoji = '🌘';
  }

  return {
    phaseFraction,
    illumination,
    phaseName,
    phaseEmoji,
    age,
    angularDiameter,
    distance,
    isNearPerigee,
    isNearApogee,
    distancePercent,
  };
}

// ---- Moon position at a given location ----

export function getMoonPosition(
  date: Date,
  latDeg: number,
  lonDeg: number
): MoonPositionInfo {
  const jd = julianDay(date);
  const eps = obliquity(jd);
  const lambda = moonEclipticLongitude(jd);
  const beta = moonEclipticLatitude(jd);

  const { ra, dec } = eclipticToEquatorial(lambda, beta, eps);
  const { azimuth, altitude } = equatorialToHorizontal(
    ra,
    dec,
    latDeg,
    lonDeg,
    date
  );

  return {
    eclipticLongitude: lambda,
    rightAscension: ra,
    declination: dec,
    azimuth,
    altitude,
  };
}

// ---- Moonrise / Moonset ----

export function getMoonriseMoonset(
  date: Date,
  latDeg: number,
  lonDeg: number
): MoonriseSetInfo {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  let moonrise: Date | null = null;
  let moonset: Date | null = null;

  let prevAlt = getMoonPosition(localMidnight, latDeg, lonDeg).altitude;

  for (let min = 1; min <= 48 * 60; min++) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const alt = getMoonPosition(t, latDeg, lonDeg).altitude;

    if (prevAlt < 0 && alt >= 0 && !moonrise) {
      moonrise = new Date(t);
    }
    if (prevAlt >= 0 && alt < 0 && !moonset) {
      moonset = new Date(t);
    }

    prevAlt = alt;

    if (moonrise && moonset) break;
  }

  return { moonrise, moonset };
}

// ---- Optimal beach time ----

export interface OptimalTimeInfo {
  time: Date;
  score: number;
  reasons: string[];
  moonAltitude: number;
  moonAzimuth: number;
  moonAboveHorizon: boolean;
}

export function getOptimalBeachTime(
  date: Date,
  latDeg: number,
  lonDeg: number,
  weatherData?: WeatherForOptimal | null
): OptimalTimeInfo {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  let best: OptimalTimeInfo = {
    time: new Date(localMidnight.getTime() + 16 * 3600000),
    score: -Infinity,
    reasons: [],
    moonAltitude: 0,
    moonAzimuth: 0,
    moonAboveHorizon: false,
  };

  const sunTimes = getSunriseSunset(date, latDeg, lonDeg);
  const phaseInfo = getMoonPhase(date);

  for (let min = 5 * 60; min <= 23 * 60; min += 15) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const pos = getMoonPosition(t, latDeg, lonDeg);
    let score = 0;
    const reasons: string[] = [];

    const hour = t.getHours() + t.getMinutes() / 60;

    // 1. Moon visibility score
    if (pos.altitude > 0) {
      score += Math.min(pos.altitude * 2, 30);
      reasons.push(`Moon is ${pos.altitude.toFixed(1)}° above the horizon`);
    } else {
      score -= 5;
    }

    // 2. Moon illumination
    if (phaseInfo.illumination > 0.5 && hour > 18) {
      score += phaseInfo.illumination * 20;
      reasons.push(`${(phaseInfo.illumination * 100).toFixed(0)}% illuminated Moon lights the beach`);
    } else if (phaseInfo.illumination > 0.25) {
      score += phaseInfo.illumination * 10;
    }

    // 3. Golden hour proximity
    if (sunTimes.sunrise && sunTimes.sunset) {
      const minAfterSunrise = (t.getTime() - sunTimes.sunrise.getTime()) / 60000;
      const minAfterSunset = (t.getTime() - sunTimes.sunset.getTime()) / 60000;

      if (minAfterSunset >= -30 && minAfterSunset <= 60) {
        score += 25;
        reasons.push('Golden hour — warm light just after sunset');
      } else if (minAfterSunrise >= -30 && minAfterSunrise <= 60) {
        score += 20;
        reasons.push('Golden hour — warm light around sunrise');
      } else if (minAfterSunset > 60 && minAfterSunset < 120) {
        score += 10;
        reasons.push('Blue hour — serene twilight');
      }
    }

    // 4. General time-of-day preference
    if (hour >= 16 && hour <= 20) {
      score += 8;
      reasons.push('Late afternoon to evening — comfortable for beach');
    } else if (hour >= 6 && hour <= 9) {
      score += 5;
      reasons.push('Morning — fresh and calm');
    } else if (hour >= 21 && hour <= 23) {
      score += 4;
      if (pos.altitude > 0 && phaseInfo.illumination > 0.3) {
        score += 10;
        reasons.push('Moonlit night stroll');
      }
    } else if (hour >= 11 && hour <= 15) {
      score -= 3;
    }

    // 5. Weather scoring
    if (weatherData) {
      const wScore = scoreWeatherAtTime(weatherData, t);
      if (wScore.tempBonus !== 0) {
        score += wScore.tempBonus;
        reasons.push(wScore.tempReason);
      }
      if (wScore.windPenalty !== 0) {
        score += wScore.windPenalty;
        reasons.push(wScore.windReason);
      }
      if (wScore.rainPenalty !== 0) {
        score += wScore.rainPenalty;
        reasons.push(wScore.rainReason);
      }
      if (wScore.cloudPenalty !== 0) {
        score += wScore.cloudPenalty;
        reasons.push(wScore.cloudReason);
      }
    }

    // 6. Tide estimation
    const tideState = getTideState(t, latDeg, lonDeg);
    if (tideState.state === 'low' || tideState.state === 'falling') {
      score += 5;
      reasons.push(`${tideState.state === 'low' ? 'Low' : 'Falling'} tide — wider beach`);
    } else if (tideState.state === 'high') {
      score -= 3;
    }

    if (score > best.score) {
      best = {
        time: new Date(t),
        score,
        reasons,
        moonAltitude: pos.altitude,
        moonAzimuth: pos.azimuth,
        moonAboveHorizon: pos.altitude > 0,
      };
    }
  }

  best.reasons = [...new Set(best.reasons)];
  return best;
}

export interface WeatherForOptimal {
  hourly: {
    time: string[];
    temperature: number[];
    windSpeed: number[];
    precipitation: number[];
    cloudCover: number[];
  };
}

function scoreWeatherAtTime(data: WeatherForOptimal, t: Date): {
  tempBonus: number; tempReason: string;
  windPenalty: number; windReason: string;
  rainPenalty: number; rainReason: string;
  cloudPenalty: number; cloudReason: string;
} {
  const isoHour = new Date(t);
  isoHour.setMinutes(0, 0, 0);
  const isoStr = isoHour.toISOString().slice(0, 13);

  let idx = data.hourly.time.findIndex((ti) => ti.slice(0, 13) === isoStr);
  if (idx < 0) {
    let minDiff = Infinity;
    for (let i = 0; i < data.hourly.time.length; i++) {
      const diff = Math.abs(new Date(data.hourly.time[i]).getTime() - t.getTime());
      if (diff < minDiff) { minDiff = diff; idx = i; }
    }
  }
  if (idx < 0) return { tempBonus: 0, tempReason: '', windPenalty: 0, windReason: '', rainPenalty: 0, rainReason: '', cloudPenalty: 0, cloudReason: '' };

  const temp = data.hourly.temperature[idx];
  const wind = data.hourly.windSpeed[idx];
  const rain = data.hourly.precipitation[idx];
  const cloud = data.hourly.cloudCover[idx];

  let tempBonus = 0; let tempReason = '';
  if (temp >= 22 && temp <= 30) { tempBonus = 15; tempReason = `Ideal temperature: ${temp.toFixed(0)}°C`; }
  else if (temp >= 18 && temp <= 33) { tempBonus = 8; tempReason = `Comfortable temperature: ${temp.toFixed(0)}°C`; }
  else if (temp < 10) { tempBonus = -15; tempReason = `Cold: ${temp.toFixed(0)}°C`; }
  else if (temp > 35) { tempBonus = -12; tempReason = `Very hot: ${temp.toFixed(0)}°C`; }

  let windPenalty = 0; let windReason = '';
  if (wind < 15) { windPenalty = 5; windReason = `Gentle breeze: ${wind.toFixed(0)} km/h`; }
  else if (wind < 25) { windPenalty = 0; windReason = ''; }
  else if (wind < 40) { windPenalty = -8; windReason = `Windy: ${wind.toFixed(0)} km/h`; }
  else { windPenalty = -20; windReason = `Strong wind: ${wind.toFixed(0)} km/h`; }

  let rainPenalty = 0; let rainReason = '';
  if (rain > 5) { rainPenalty = -25; rainReason = `Heavy rain: ${rain.toFixed(1)} mm`; }
  else if (rain > 1) { rainPenalty = -15; rainReason = `Rain: ${rain.toFixed(1)} mm`; }
  else if (rain > 0.1) { rainPenalty = -5; rainReason = `Light drizzle`; }

  let cloudPenalty = 0; let cloudReason = '';
  if (cloud > 80) { cloudPenalty = -5; cloudReason = `Overcast skies`; }
  else if (cloud < 20) { cloudPenalty = 5; cloudReason = `Clear skies`; }

  return { tempBonus, tempReason, windPenalty, windReason, rainPenalty, rainReason, cloudPenalty, cloudReason };
}

// ---- Sun times (simplified) ----

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
}

export function getSunriseSunset(date: Date, latDeg: number, lonDeg: number): SunTimes {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  const jd = julianDay(localMidnight);
  const T = julianCentury(jd);
  const M = mod360(357.5291092 + 35999.0502909 * T);
  const L0 = mod360(280.4664567 + 360007.6982779 * T);
  const sunLong = mod360(L0 + 1.914666471 * Math.sin(toRad(M)) + 0.019994643 * Math.sin(toRad(2 * M)));
  const eps = obliquity(jd);

  const { ra, dec } = eclipticToEquatorial(sunLong, 0, eps);

  const eot = -1.914666471 * Math.sin(toRad(M)) + 0.019994643 * Math.sin(toRad(2 * M));

  const lat = toRad(latDeg);
  const decR = toRad(dec);
  const cosH = -Math.tan(lat) * Math.tan(decR);

  let sunrise: Date | null = null;
  let sunset: Date | null = null;

  if (cosH >= -1 && cosH <= 1) {
    const H = toDeg(Math.acos(cosH));
    const solarNoonUT = 12 - lonDeg / 15 - (eot * 4) / 60;
    const sunriseUT = solarNoonUT - H / 15;
    const sunsetUT = solarNoonUT + H / 15;

    const baseDate = new Date(localMidnight);
    sunrise = new Date(baseDate.getTime() + sunriseUT * 3600000);
    sunset = new Date(baseDate.getTime() + sunsetUT * 3600000);
  }

  return { sunrise, sunset };
}

// ---- Tides ----

export interface TideInfo {
  state: 'rising' | 'falling' | 'high' | 'low';
  heightEstimate: number;
  description: string;
}

export function getTideState(date: Date, latDeg: number, lonDeg: number): TideInfo {
  const pos = getMoonPosition(date, latDeg, lonDeg);
  const alt = pos.altitude;

  const before = getMoonPosition(
    new Date(date.getTime() - 30 * 60000),
    latDeg,
    lonDeg
  ).altitude;
  const after = getMoonPosition(
    new Date(date.getTime() + 30 * 60000),
    latDeg,
    lonDeg
  ).altitude;

  const isRising = after > before;

  let state: TideInfo['state'];
  let description: string;

  if (alt > 50) {
    state = 'high';
    description = 'Near high tide — water is close to the dune line';
  } else if (alt < 5 && alt > -5) {
    state = 'low';
    description = 'Near low tide — wide beach exposed';
  } else if (isRising) {
    state = 'rising';
    description = 'Tide is coming in — water advancing up the beach';
  } else {
    state = 'falling';
    description = 'Tide is going out — water retreating, beach widening';
  }

  const heightEstimate = Math.max(0, (alt + 10) / 100 * 3 + 0.5);

  return { state, heightEstimate, description };
}

export function getTideRangeFromPhase(phaseFraction: number): {
  type: 'spring' | 'neap' | 'transitional';
  rangeDescription: string;
  rangeMultiplier: number;
} {
  const illumination = (1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2;

  if (phaseFraction < 0.06 || phaseFraction > 0.94 || (phaseFraction > 0.44 && phaseFraction < 0.56)) {
    return {
      type: 'spring',
      rangeDescription: 'Spring tide — Sun and Moon aligned, amplifying the tidal range. Higher highs, lower lows.',
      rangeMultiplier: 1.25,
    };
  } else if ((phaseFraction > 0.19 && phaseFraction < 0.31) || (phaseFraction > 0.69 && phaseFraction < 0.81)) {
    return {
      type: 'neap',
      rangeDescription: 'Neap tide — Sun and Moon at right angles, minimizing the tidal range. Lower highs, higher lows.',
      rangeMultiplier: 0.75,
    };
  }
  return {
    type: 'transitional',
    rangeDescription: 'Transitional tide — tidal range is between spring and neap extremes.',
    rangeMultiplier: 1.0,
  };
}

// ---- 24-hour altitude timeline ----

export function getAltitudeTimeline(
  date: Date,
  latDeg: number,
  lonDeg: number
): AltitudePoint[] {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  const points: AltitudePoint[] = [];
  const sunTimes = getSunriseSunset(date, latDeg, lonDeg);

  for (let min = 0; min <= 24 * 60; min += 30) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const moonPos = getMoonPosition(t, latDeg, lonDeg);

    let sunAlt = 0;
    if (sunTimes.sunrise && sunTimes.sunset) {
      const sunriseMin = (sunTimes.sunrise.getTime() - localMidnight.getTime()) / 60000;
      const sunsetMin = (sunTimes.sunset.getTime() - localMidnight.getTime()) / 60000;
      if (min < sunriseMin || min > sunsetMin) {
        sunAlt = -10 - 10 * Math.abs(
          Math.sin(((min - sunriseMin) / (sunsetMin - sunriseMin)) * Math.PI)
        );
      } else {
        const dayProgress = (min - sunriseMin) / (sunsetMin - sunriseMin);
        sunAlt = Math.sin(dayProgress * Math.PI) * 65;
      }
    }

    points.push({
      minutes: min,
      moonAltitude: moonPos.altitude,
      sunAltitude: sunAlt,
      hour: min / 60,
    });
  }
  return points;
}

// ---- 24-hour tide curve ----

export function getTideCurve(
  date: Date,
  latDeg: number,
  lonDeg: number
): TidePoint[] {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  const phaseInfo = getMoonPhase(date);
  const tideRange = getTideRangeFromPhase(phaseInfo.phaseFraction);
  const rangeMul = tideRange.rangeMultiplier;

  const points: TidePoint[] = [];
  for (let min = 0; min <= 24 * 60; min += 15) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const pos = getMoonPosition(t, latDeg, lonDeg);

    const baseHeight = (pos.altitude + 90) / 180;
    const scaledHeight = baseHeight * 2.5 * rangeMul + 0.3;

    points.push({
      minutes: min,
      height: Math.max(0, scaledHeight),
      hour: min / 60,
    });
  }

  const smoothed: TidePoint[] = points.map((p, i) => {
    const window = points.slice(Math.max(0, i - 1), Math.min(points.length, i + 2));
    const avg = window.reduce((sum, w) => sum + w.height, 0) / window.length;
    return { ...p, height: avg };
  });

  return smoothed;
}

// ---- Next phase prediction ----

export function getNextPhase(currentDate: Date): NextPhaseInfo {
  const phaseBoundaries: Array<{ name: string; fraction: number }> = [
    { name: 'New Moon', fraction: 0 },
    { name: 'First Quarter', fraction: 0.25 },
    { name: 'Full Moon', fraction: 0.5 },
    { name: 'Last Quarter', fraction: 0.75 },
    { name: 'New Moon', fraction: 1.0 },
  ];

  const currentPhase = getMoonPhase(currentDate).phaseFraction;

  let nextBoundary = phaseBoundaries[0];
  for (const b of phaseBoundaries) {
    if (b.fraction > currentPhase + 0.01) {
      nextBoundary = b;
      break;
    }
  }

  const synodicMonth = 29.530588853;
  const maxDays = synodicMonth;
  for (let h = 1; h <= maxDays * 24; h++) {
    const t = new Date(currentDate.getTime() + h * 3600000);
    const phase = getMoonPhase(t).phaseFraction;

    const normalizedPhase = phase >= 0.99 ? phase - 1 : phase;

    if (nextBoundary.fraction === 0 || nextBoundary.fraction === 1) {
      if (phase > 0.99 || phase < 0.01) {
        return {
          name: 'New Moon',
          daysUntil: h / 24,
          date: t,
          targetFraction: 0,
        };
      }
    } else if (Math.abs(normalizedPhase - nextBoundary.fraction) < 0.01) {
      return {
        name: nextBoundary.name,
        daysUntil: h / 24,
        date: t,
        targetFraction: nextBoundary.fraction,
      };
    }
  }

  return {
    name: nextBoundary.name,
    daysUntil: 7,
    date: new Date(currentDate.getTime() + 7 * 86400000),
    targetFraction: nextBoundary.fraction,
  };
}

// ---- Lunar libration estimate ----

export function getLibration(date: Date): { longitude: number; latitude: number } {
  const jd = julianDay(date);
  const T = julianCentury(jd);
  const F = mod360(93.272095 + 483202.0175233 * T);
  const libLon = -3.66 * Math.sin(toRad(F)) + 0.76 * Math.sin(toRad(2 * F));
  const libLat = 6.77 * Math.sin(toRad(F));
  return { longitude: libLon, latitude: libLat };
}

// ---- Moon transit time ----

export function getMoonTransit(date: Date, latDeg: number, lonDeg: number): Date | null {
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  let maxAlt = -Infinity;
  let transitTime: Date | null = null;

  for (let min = 0; min <= 24 * 60; min += 5) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const alt = getMoonPosition(t, latDeg, lonDeg).altitude;
    if (alt > maxAlt) {
      maxAlt = alt;
      transitTime = new Date(t);
    }
  }
  return transitTime;
}
```

---

## src/lib/api.ts

```typescript
/**
 * Beach geocoding and weather data APIs.
 * Uses Nominatim (OpenStreetMap) for geocoding and Open-Meteo for weather.
 * Both are free, no API key required.
 */

export interface BeachLocation {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  countryCode: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    cloudCover: number;
    humidity: number;
    weatherCode: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    windSpeed: number[];
    precipitation: number[];
    cloudCover: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    tempMax: number[];
    tempMin: number[];
    sunrise: string[];
    sunset: string[];
  };
  timezone: string;
}

/**
 * Search for a beach by name using Nominatim geocoding.
 */
export async function searchBeach(query: string): Promise<BeachLocation[]> {
  const searchQuery = query.trim().toLowerCase().includes('beach')
    ? query.trim()
    : `${query.trim()} beach`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    searchQuery
  )}&limit=10&addressdetails=1&feature_type=natural`;

  try {
    const resp = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    if (!resp.ok) throw new Error(`Geocoding failed: ${resp.status}`);
    const data = await resp.json();

    return (data as any[]).map((item) => ({
      name: item.display_name.split(',')[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      countryCode: item.address?.country_code?.toUpperCase() || '',
    }));
  } catch (err) {
    console.error('Beach search error:', err);
    throw new Error('Could not find that beach. Try a different name.');
  }
}

/**
 * Get weather data for a location using Open-Meteo.
 */
export async function getWeather(
  lat: number,
  lon: number,
  date?: Date
): Promise<WeatherData> {
  const today = date || new Date();
  const dateStr = today.toISOString().slice(0, 10);

  const startDate = dateStr;
  const endDate = new Date(today.getTime() + 2 * 86400000)
    .toISOString()
    .slice(0, 10);

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover,relative_humidity_2m,weather_code` +
    `&hourly=temperature_2m,wind_speed_10m,precipitation,cloud_cover` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
    `&timezone=auto&start_date=${startDate}&end_date=${endDate}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Weather fetch failed: ${resp.status}`);
    const data = await resp.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        precipitation: data.current.precipitation,
        cloudCover: data.current.cloud_cover,
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        windSpeed: data.hourly.wind_speed_10m,
        precipitation: data.hourly.precipitation,
        cloudCover: data.hourly.cloud_cover,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
        sunrise: data.daily.sunrise,
        sunset: data.daily.sunset,
      },
      timezone: data.timezone,
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    throw new Error('Could not fetch weather data for this location.');
  }
}

/**
 * Get the timezone offset estimate from longitude.
 */
export function getTimezoneOffset(lat: number, lon: number, date: Date): number {
  const estimatedOffset = Math.round(lon / 15);
  return estimatedOffset;
}

/**
 * Convert a WMO weather code to a human-readable description.
 */
export function weatherCodeToString(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return map[code] || 'Unknown conditions';
}

/**
 * Get a Lucide icon name suggestion from weather code.
 */
export function weatherCodeToIcon(code: number): string {
  if (code === 0) return 'Sun';
  if (code <= 2) return 'CloudSun';
  if (code === 3) return 'Cloud';
  if (code <= 48) return 'CloudFog';
  if (code <= 67) return 'CloudRain';
  if (code <= 77) return 'CloudSnow';
  if (code <= 82) return 'CloudDrizzle';
  if (code >= 95) return 'CloudLightning';
  return 'Cloud';
}
```

---

## src/components/HeroScene.tsx

```typescript
import Starfield from './Starfield';
import MoonPhaseSVG from './MoonPhaseSVG';
import { getMoonPhase } from '@/lib/astronomy';
import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSceneProps {
  onScrollDown: () => void;
}

/**
 * The hero scene: a night beach with the Moon rising above the ocean,
 * with approximately 30% of the Moon covered by water.
 */
export default function HeroScene({ onScrollDown }: HeroSceneProps) {
  const moonPhase = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-night-deep">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-deep via-night-dark to-night-mid" />

      {/* Stars */}
      <Starfield count={180} />

      {/* Moon glow on the sky */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(244,228,188,0.15) 0%, rgba(244,228,188,0.05) 30%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* The Moon — positioned so ~30% overlaps with the water below */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        <MoonPhaseSVG
          phaseFraction={moonPhase.phaseFraction}
          size={220}
          glow
        />
      </div>

      {/* Moonlight reflection on water */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: '15%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '200px',
          background: 'linear-gradient(180deg, rgba(244,228,188,0.25) 0%, rgba(244,228,188,0.08) 50%, transparent 100%)',
          filter: 'blur(8px)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Ocean — starts below the moon, covering ~30% of it */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '42%' }}>
        {/* Deep ocean gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-mid via-ocean-dark to-ocean-deep" />

        {/* Water surface shimmer */}
        <div
          className="absolute top-0 left-0 right-0 water-shimmer"
          style={{ height: '60px' }}
        />

        {/* Wave layers */}
        <WaveLayer
          color="rgba(74, 138, 181, 0.15)"
          height="50px"
          bottom="55%"
          duration="7s"
          delay="0s"
        />
        <WaveLayer
          color="rgba(74, 138, 181, 0.2)"
          height="60px"
          bottom="35%"
          duration="6s"
          delay="1s"
        />
        <WaveLayer
          color="rgba(42, 90, 130, 0.3)"
          height="70px"
          bottom="15%"
          duration="8s"
          delay="0.5s"
        />
        <WaveLayer
          color="rgba(26, 58, 92, 0.5)"
          height="80px"
          bottom="0%"
          duration="9s"
          delay="2s"
        />

        {/* Foam line at the water's edge */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '-2px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(200,220,240,0.4) 20%, rgba(200,220,240,0.6) 50%, rgba(200,220,240,0.4) 80%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Beach sand at the very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '8%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(154,138,106,0.3) 20%, rgba(201,184,150,0.6) 60%, rgba(232,220,192,0.8) 100%)',
          clipPath: 'polygon(0 30%, 15% 15%, 35% 25%, 55% 10%, 75% 20%, 100% 12%, 100% 100%, 0 100%)',
        }}
      />

      {/* Title overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-start pt-[12vh] px-4">
        <h1 className="font-serif text-6xl md:text-8xl font-light tracking-wide text-moon-light moon-text-glow text-balance text-center animate-fade-in">
          Praia da Lúa
        </h1>
        <p className="mt-4 font-sans text-sm md:text-base font-light tracking-[0.3em] uppercase text-moon-mid/80 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Moon · Beach · Tides
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-moon-mid/60 hover:text-moon-light transition-colors duration-300 animate-fade-in"
        style={{ animationDelay: '1s' }}
        aria-label="Scroll down to search"
      >
        <span className="text-xs font-light tracking-widest uppercase">Find your beach</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,7,20,0.5) 100%)',
        }}
      />
    </section>
  );
}

function WaveLayer({
  color,
  height,
  bottom,
  duration,
  delay,
}: {
  color: string;
  height: string;
  bottom: string;
  duration: string;
  delay: string;
}) {
  return (
    <div
      className="absolute left-0 right-0"
      style={{ bottom, height }}
    >
      <svg
        className="absolute inset-0 w-[200%] h-full"
        style={{ animation: `wave ${duration} ease-in-out ${delay} infinite` }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <path
          d="M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
```

---

## src/components/SearchSection.tsx

```typescript
import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, MapPin, X } from 'lucide-react';
import { searchBeach, type BeachLocation } from '@/lib/api';

interface SearchSectionProps {
  onBeachSelect: (beach: BeachLocation) => void;
  loading: boolean;
}

export default function SearchSection({ onBeachSelect, loading }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BeachLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setError(null);
      try {
        const beaches = await searchBeach(query);
        if (beaches.length === 0) {
          setError('No beaches found. Try a different name.');
        } else {
          setResults(beaches);
          setShowResults(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close results on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(beach: BeachLocation) {
    setQuery(beach.name);
    setShowResults(false);
    setResults([]);
    onBeachSelect(beach);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  }

  return (
    <section
      id="search-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-night-deep via-night-dark to-night-mid"
    >
      {/* Subtle starfield continuation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-moon-light/90 mb-3 text-center animate-fade-in-up">
          Find your beach
        </h2>
        <p className="font-sans text-sm font-light tracking-wide text-moon-mid/60 mb-12 text-center max-w-md animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          Search any beach in the world. We'll show you the Moon's phase and the
          best time to visit today.
        </p>

        <div ref={containerRef} className="relative w-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-moon-mid/50"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="e.g. Bondi Beach, Copacabana, Praia da Rocha..."
                className="w-full bg-night-light/40 backdrop-blur-md border border-moon-mid/20 rounded-full pl-14 pr-12 py-5 text-moon-light text-lg font-light placeholder:text-moon-mid/40 focus:outline-none focus:border-moon-glow/50 focus:ring-2 focus:ring-moon-glow/20 transition-all duration-300 shadow-2xl"
                disabled={loading}
              />
              {searching && (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-moon-mid/50 animate-spin" />
              )}
              {query && !searching && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-moon-mid/50 hover:text-moon-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-night-dark/95 backdrop-blur-lg border border-moon-mid/20 rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-80 overflow-y-auto custom-scroll">
              {results.map((beach, i) => (
                <button
                  key={`${beach.name}-${i}`}
                  onClick={() => handleSelect(beach)}
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-night-light/40 transition-colors text-left border-b border-moon-mid/10 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-moon-glow/60 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-moon-light font-light text-sm truncate">
                      {beach.name}
                    </p>
                    <p className="text-moon-mid/50 text-xs font-light truncate mt-0.5">
                      {beach.displayName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && !showResults && (
            <p className="mt-4 text-center text-sm text-amber-400/70 font-light">
              {error}
            </p>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-moon-mid/60">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-light">Calculating Moon phase and optimal time...</span>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {!query && !loading && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <span className="text-xs text-moon-mid/40 font-light tracking-wide">Try:</span>
            {['Bondi Beach', 'Copacabana', 'Malibu', 'Praia da Rocha', 'Whitehaven Beach'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs font-light text-moon-glow/70 bg-moon-glow/5 border border-moon-glow/15 rounded-full px-3 py-1.5 hover:bg-moon-glow/10 hover:border-moon-glow/30 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## src/components/ResultsSection.tsx

```typescript
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

      {/* Date picker button */}
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
```

---

## src/components/MoonInfoModal.tsx

```typescript
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

          {/* Marine life */}
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

          {/* Perigee / Apogee */}
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

          {/* How it all connects */}
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

          {/* Astronomical data table */}
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
```

---

## src/components/MoonPhaseSVG.tsx

```typescript
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
    const phase = phaseFraction;
    const isWax = phase < 0.5;
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

    const terminatorX = r * Math.abs(1 - 2 * illumination);
    const isLitOnRight = isWax;

    let path = '';

    if (illumination >= 0.999) {
      path = '';
    } else if (illumination <= 0.001) {
      path = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy} Z`;
    } else {
      const litOnRight = isLitOnRight;

      if (litOnRight) {
        if (illumination < 0.5) {
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 0 ${cx} ${cy - r} Z`;
        } else {
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 1 ${cx} ${cy - r} Z`;
        }
      } else {
        if (illumination < 0.5) {
          path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${terminatorX} ${r} 0 0 1 ${cx} ${cy - r} Z`;
        } else {
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
```

---

## src/components/MoonTimeline.tsx

```typescript
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
```

---

## src/components/TideChart.tsx

```typescript
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
```

---

## src/components/Starfield.tsx

```typescript
import { useMemo } from 'react';

interface StarfieldProps {
  count?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function Starfield({ count = 150, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 70,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }
    return arr;
  }, [count]);

  const brightStars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 50,
        size: Math.random() * 1.5 + 2,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 3,
        opacity: 0.8,
      });
    }
    return arr;
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      {brightStars.map((star, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full bg-moon-light"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: '0 0 6px rgba(253, 246, 227, 0.8), 0 0 12px rgba(253, 246, 227, 0.4)',
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
```

---

## Note

The file `src/vite-env.d.ts` contains a standard Vite environment type declaration (`/// <reference types="vite/client" />`) and is not shown here as it contains no custom code.
