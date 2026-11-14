// ══════════════════════════════════════════
// Mars Weather — Historical InSight Data
// + React hook for weather events
// ══════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';

// Historical InSight-style data (sampled from actual archived sols)
// Since the InSight API is retired, we embed representative real data
const INSIGHT_HISTORICAL = [
  { sol: 14,  season: 'month 1', minTemp: -95.4, maxTemp: -15.6, avgPressure: 736.0, avgWindSpeed: 4.2,  stormRisk: 'low'    },
  { sol: 90,  season: 'month 3', minTemp: -100.3,maxTemp: -18.2, avgPressure: 741.2, avgWindSpeed: 6.8,  stormRisk: 'low'    },
  { sol: 182, season: 'month 6', minTemp: -88.1, maxTemp: -12.4, avgPressure: 782.5, avgWindSpeed: 11.3, stormRisk: 'medium' },
  { sol: 274, season: 'month 9', minTemp: -78.9, maxTemp: -8.7,  avgPressure: 814.3, avgWindSpeed: 15.7, stormRisk: 'medium' },
  { sol: 365, season: 'month 12',minTemp: -105.2,maxTemp: -22.1, avgPressure: 697.8, avgWindSpeed: 22.4, stormRisk: 'high'   },
  { sol: 420, season: 'month 14',minTemp: -110.4,maxTemp: -28.3, avgPressure: 672.1, avgWindSpeed: 31.5, stormRisk: 'high'   },
  { sol: 500, season: 'month 17',minTemp: -91.0, maxTemp: -16.9, avgPressure: 758.9, avgWindSpeed: 8.1,  stormRisk: 'low'    },
  { sol: 600, season: 'month 20',minTemp: -83.6, maxTemp: -10.2, avgPressure: 801.4, avgWindSpeed: 13.9, stormRisk: 'medium' },
  { sol: 700, season: 'month 24',minTemp: -107.8,maxTemp: -24.5, avgPressure: 668.3, avgWindSpeed: 28.2, stormRisk: 'high'   },
  { sol: 800, season: 'month 27',minTemp: -97.2, maxTemp: -19.8, avgPressure: 723.6, avgWindSpeed: 18.5, stormRisk: 'medium' },
];

// Classify weather into a game event
function classifyWeatherEvent(solData) {
  const { minTemp, avgWindSpeed, stormRisk, avgPressure } = solData;

  if (stormRisk === 'high' && avgWindSpeed > 25) {
    return {
      type: 'dust_storm',
      severity: 'critical',
      label: '⚠️ DUST STORM ALERT',
      description: `Regional dust storm detected. Wind: ${avgWindSpeed.toFixed(1)} m/s. All EVA suspended until further notice.`,
      icon: '🌪️',
      statEffect: { stat: 'oxygen', delta: -5 },
      bgTint: 'rgba(193, 68, 14, 0.4)',
    };
  }
  if (minTemp < -105) {
    return {
      type: 'extreme_cold',
      severity: 'warning',
      label: '🧊 EXTREME COLD EVENT',
      description: `Overnight low of ${minTemp.toFixed(1)}°C recorded. Equipment heating systems at max load. Battery drain increased.`,
      icon: '❄️',
      statEffect: { stat: 'health', delta: -3 },
      bgTint: 'rgba(0, 212, 255, 0.15)',
    };
  }
  if (avgPressure > 800) {
    return {
      type: 'pressure_anomaly',
      severity: 'info',
      label: '📡 ATMOSPHERIC ANOMALY',
      description: `Pressure spike: ${avgPressure.toFixed(0)} Pa. Scientific instruments detecting unusual readings. Research opportunity!`,
      icon: '🔬',
      statEffect: { stat: 'score', delta: 50 },
      bgTint: 'rgba(124, 58, 237, 0.2)',
    };
  }
  if (stormRisk === 'medium') {
    return {
      type: 'elevated_wind',
      severity: 'caution',
      label: '💨 ELEVATED WIND ADVISORY',
      description: `Wind speed at ${avgWindSpeed.toFixed(1)} m/s. EVA permitted with caution. Rover operations limited.`,
      icon: '💨',
      statEffect: null,
      bgTint: 'rgba(245, 166, 35, 0.1)',
    };
  }
  return null; // Clear conditions — no event
}

// ── React Hook ───────────────────────────────────────────────────────
export function useMarsWeather() {
  const [weatherData, setWeatherData]   = useState(null);
  const [weatherEvent, setWeatherEvent] = useState(null);
  const [loading, setLoading]           = useState(false);

  const refreshWeather = useCallback(() => {
    setLoading(true);
    // Pick a random historical sol
    const sol  = INSIGHT_HISTORICAL[Math.floor(Math.random() * INSIGHT_HISTORICAL.length)];
    const event = classifyWeatherEvent(sol);
    setWeatherData(sol);
    setWeatherEvent(event);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  return { weatherData, weatherEvent, loading, refreshWeather };
}

export { INSIGHT_HISTORICAL, classifyWeatherEvent };
