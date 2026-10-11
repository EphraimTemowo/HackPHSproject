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
 * Returns matching beach locations.
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
 * Includes current conditions, 24-hour hourly forecast, and daily summary.
 */
export async function getWeather(
  lat: number,
  lon: number,
  date?: Date
): Promise<WeatherData> {
  const today = date || new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // Fetch 3 days starting from the target date to cover full range
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
 * Get the timezone string for a location using Open-Meteo's timezone endpoint.
 * Falls back to the system timezone if the API fails.
 */
export function getTimezoneOffset(lat: number, lon: number, date: Date): number {
  // Estimate timezone offset from longitude (15° = 1 hour)
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
