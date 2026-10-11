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
    // [D, M, M', F, coefficient]
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

/**
 * Convert equatorial coordinates to horizontal (azimuth, altitude).
 * @param raHours Right ascension in hours
 * @param decDeg Declination in degrees
 * @param latDeg Observer latitude in degrees
 * @param lonDeg Observer longitude in degrees (east positive)
 * @param date JS Date
 */
function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date
): { azimuth: number; altitude: number } {
  const jd = julianDay(date);
  const gst = greenwichSiderealTime(jd);
  const lst = mod24(gst / 15 + lonDeg / 15); // local sidereal time in hours
  const ha = mod24(lst - raHours) * 15; // hour angle in degrees

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

/**
 * Compute the Moon's phase using the elongation (Sun–Moon angular separation).
 * Returns phase fraction (0–1), illumination, age, distance, and more.
 */
export function getMoonPhase(date: Date): MoonPhaseInfo {
  const jd = julianDay(date);
  const T = julianCentury(jd);

  // Sun mean anomaly
  const M = mod360(357.5291092 + 35999.0502909 * T);
  // Sun mean longitude
  const L0 = mod360(280.4664567 + 360007.6982779 * T + 0.03032028 * T * T);
  // Sun ecliptic longitude (approx)
  const sunLong = mod360(L0 + 1.914666471 * Math.sin(toRad(M)) + 0.019994643 * Math.sin(toRad(2 * M)));
  // Moon ecliptic longitude
  const moonLong = moonEclipticLongitude(jd);

  // Phase angle (elongation)
  const elongation = mod360(moonLong - sunLong);
  const phaseFraction = mod360(elongation) / 360;

  // Illuminated fraction: (1 - cos(elongation)) / 2
  const illumination = (1 - Math.cos(toRad(elongation))) / 2;

  // Moon age
  const synodicMonth = 29.530588853;
  const age = phaseFraction * synodicMonth;

  // Distance
  const distance = moonDistance(jd);

  // Angular diameter
  const angularDiameter = (3474.8 / distance) * (180 / Math.PI);

  // Perigee/apogee detection
  // Average distance ~385,000 km. Perigee ~363,300, Apogee ~405,500
  const avgDistance = 385000;
  const distancePercent = (distance / avgDistance) * 100;
  const isNearPerigee = distance < 370000;
  const isNearApogee = distance > 402000;

  // Phase name
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

/**
 * Find moonrise and moonset for a given date and location.
 * Searches in 1-minute increments over a 48-hour window.
 */
export function getMoonriseMoonset(
  date: Date,
  latDeg: number,
  lonDeg: number
): MoonriseSetInfo {
  // Start at midnight local time on the given date
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  let moonrise: Date | null = null;
  let moonset: Date | null = null;

  let prevAlt = getMoonPosition(localMidnight, latDeg, lonDeg).altitude;

  // Scan 48 hours in 1-minute steps
  for (let min = 1; min <= 48 * 60; min++) {
    const t = new Date(localMidnight.getTime() + min * 60000);
    const alt = getMoonPosition(t, latDeg, lonDeg).altitude;

    if (prevAlt < 0 && alt >= 0 && !moonrise) {
      // Rising
      moonrise = new Date(t);
    }
    if (prevAlt >= 0 && alt < 0 && !moonset) {
      // Setting
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

/**
 * Score every 15-minute interval from 6:00 to 22:00 local time on the given
 * date, and return the time with the highest "beach quality" score.
 *
 * Factors:
 *  - Moon visibility (altitude when above horizon)
 *  - Moon illumination (more illuminated = more scenic at night)
 *  - Golden-hour proximity (sunrise/sunset ±45 min)
 *  - Temperature comfort (from weather forecast, if available)
 *  - Low wind and no rain
 *  - Tide state (low tide = wider beach)
 */
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

  // Sun times for golden hour proximity
  const sunTimes = getSunriseSunset(date, latDeg, lonDeg);

  const phaseInfo = getMoonPhase(date);

  // Check every 15 minutes from 5:00 to 23:00
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

    // 2. Moon illumination — full moons at night are spectacular
    if (phaseInfo.illumination > 0.5 && hour > 18) {
      score += phaseInfo.illumination * 20;
      reasons.push(`${(phaseInfo.illumination * 100).toFixed(0)}% illuminated Moon lights the beach`);
    } else if (phaseInfo.illumination > 0.25) {
      score += phaseInfo.illumination * 10;
    }

    // 3. Golden hour proximity (sunrise/sunset ±45 min)
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
      score -= 3; // midday sun penalty
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

  // Deduplicate reasons
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
  // Find closest hourly entry
  const isoHour = new Date(t);
  isoHour.setMinutes(0, 0, 0);
  const isoStr = isoHour.toISOString().slice(0, 13);

  let idx = data.hourly.time.findIndex((ti) => ti.slice(0, 13) === isoStr);
  if (idx < 0) {
    // Find nearest
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

  // Equation of time (approximate)
  const eot = -1.914666471 * Math.sin(toRad(M)) + 0.019994643 * Math.sin(toRad(2 * M)); // simplified

  const lat = toRad(latDeg);
  const decR = toRad(dec);
  const cosH = -Math.tan(lat) * Math.tan(decR);

  let sunrise: Date | null = null;
  let sunset: Date | null = null;

  if (cosH >= -1 && cosH <= 1) {
    const H = toDeg(Math.acos(cosH)); // degrees
    // Solar noon in UT: 12 - lon/15 - EOT/60 (EOT in minutes ~ eot in degrees * 4 min/deg)
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
  heightEstimate: number; // approximate, meters
  description: string;
}

/**
 * Estimate tide state using the lunar semi-diurnal period (12h 25min).
 * This is an approximation — real tides depend on local bathymetry.
 */
export function getTideState(date: Date, latDeg: number, lonDeg: number): TideInfo {
  // Tides are primarily driven by the Moon. The semi-diurnal tide period is
  // 12 hours 25 minutes (half the lunar day). We use the Moon's transit
  // time as a reference for high tide.

  const pos = getMoonPosition(date, latDeg, lonDeg);

  // When the Moon is at its highest (transit), it's roughly high tide.
  // When it's rising or setting, it's roughly low tide.
  // We approximate using the Moon's altitude as a proxy.

  const alt = pos.altitude;

  // Also check derivative — scan 30 min before and after
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

  // Rough height estimate based on altitude
  const heightEstimate = Math.max(0, (alt + 10) / 100 * 3 + 0.5);

  return { state, heightEstimate, description };
}

/**
 * Detailed tide range estimate based on Moon phase.
 * Spring tides occur at new and full moon; neap tides at quarters.
 */
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

/**
 * Generate a 24-hour timeline of Moon and Sun altitudes at 30-minute intervals.
 * Used for the visual altitude chart in the results section.
 */
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

    // Sun altitude (simplified — use sunrise/sunset to interpolate)
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

/**
 * Generate a 24-hour tide height curve at 15-minute intervals.
 * Uses the Moon's altitude as a proxy for tide height, scaled by the
 * phase-based range multiplier (spring vs. neap).
 */
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

    // Map altitude (-90 to +90) to tide height (0 to ~3m)
    // High altitude = high tide, low/negative altitude = low tide
    const baseHeight = (pos.altitude + 90) / 180; // 0 to 1
    const scaledHeight = baseHeight * 2.5 * rangeMul + 0.3;

    points.push({
      minutes: min,
      height: Math.max(0, scaledHeight),
      hour: min / 60,
    });
  }

  // Smooth the curve with a simple moving average
  const smoothed: TidePoint[] = points.map((p, i) => {
    const window = points.slice(Math.max(0, i - 1), Math.min(points.length, i + 2));
    const avg = window.reduce((sum, w) => sum + w.height, 0) / window.length;
    return { ...p, height: avg };
  });

  return smoothed;
}

// ---- Next phase prediction ----

/**
 * Predict the next major lunar phase event (new, first quarter, full, or last quarter).
 * Scans forward in 1-hour increments until the phase fraction crosses a boundary.
 */
export function getNextPhase(currentDate: Date): NextPhaseInfo {
  const phaseBoundaries: Array<{ name: string; fraction: number }> = [
    { name: 'New Moon', fraction: 0 },
    { name: 'First Quarter', fraction: 0.25 },
    { name: 'Full Moon', fraction: 0.5 },
    { name: 'Last Quarter', fraction: 0.75 },
    { name: 'New Moon', fraction: 1.0 },
  ];

  const currentPhase = getMoonPhase(currentDate).phaseFraction;

  // Find the next boundary we'll cross
  let nextBoundary = phaseBoundaries[0];
  for (const b of phaseBoundaries) {
    if (b.fraction > currentPhase + 0.01) {
      nextBoundary = b;
      break;
    }
  }

  // Scan forward in 1-hour increments
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

  // Fallback
  return {
    name: nextBoundary.name,
    daysUntil: 7,
    date: new Date(currentDate.getTime() + 7 * 86400000),
    targetFraction: nextBoundary.fraction,
  };
}

// ---- Lunar libration estimate ----

/**
 * Estimate the lunar libration in longitude, which affects which part of
 * the Moon's far side is visible from Earth. Simplified calculation.
 */
export function getLibration(date: Date): { longitude: number; latitude: number } {
  const jd = julianDay(date);
  const T = julianCentury(jd);
  const F = mod360(93.272095 + 483202.0175233 * T);
  const libLon = -3.66 * Math.sin(toRad(F)) + 0.76 * Math.sin(toRad(2 * F));
  const libLat = 6.77 * Math.sin(toRad(F));
  return { longitude: libLon, latitude: libLat };
}

// ---- Moon transit time ----

/**
 * Find the Moon's transit (highest altitude) time for a given date and location.
 */
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
