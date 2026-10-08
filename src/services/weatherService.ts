export interface WeatherConditions {
  vpdKpa: number;
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windGustsKmh: number;
  atmosphericPressureHpa: number;
  droughtCode: number;
  source: string;
}

export const getRegionalWeather = (): WeatherConditions => {
  return {
    vpdKpa: 3.8,
    temperatureC: 34.6,
    relativeHumidityPct: 22,
    windSpeedKmh: 31,
    windDirectionDeg: 68,
    windGustsKmh: 44,
    atmosphericPressureHpa: 1011.8,
    droughtCode: 420,
    source: 'Open-Meteo High-Resolution NWP Assimilation',
  };
};
