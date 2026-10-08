export interface SatellitePassInfo {
  satelliteName: string;
  orbitPassId: string;
  sensor: string;
  frequencyBand: string;
  polarization: string;
  utcTimestamp: string;
  groundResolution: string;
  orbitHeading: string;
  status: 'ONLINE' | 'PROCESSING' | 'ACQUIRING';
  confidence: number;
}

export const getLatestSatellitePass = (): SatellitePassInfo => {
  return {
    satelliteName: 'Sentinel-1B (Copernicus)',
    orbitPassId: 'PASS-7842-DESCENDING',
    sensor: 'C-SAR (Synthetic Aperture Radar)',
    frequencyBand: '5.405 GHz (C-Band)',
    polarization: 'VV + VH Dual-Pol',
    utcTimestamp: '06:42 UTC',
    groundResolution: '10m × 10m Pixel Gridded',
    orbitHeading: '192.4° (Descending Track)',
    status: 'ONLINE',
    confidence: 87,
  };
};

export const simulateSARScan = async (): Promise<{ durationMs: number; status: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ durationMs: 1200, status: 'ACQUIRED_AND_FUSED' });
    }, 1200);
  });
};
