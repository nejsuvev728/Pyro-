import { SystemAlert } from '../types/intelligence';

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-1093',
    timestamp: '6 mins ago',
    severity: 'CRITICAL',
    title: 'Pipeline P-18 Corridor Exposure Escalation',
    message:
      'Critical energy pipeline segment P-18 (South Ridge Pass) exposure index surged to 87/100 due to canopy moisture anomaly in Sector 07. Review configured isolation boundary V17–V18.',
    sectorId: 'SEC-07',
    isRead: false,
  },
  {
    id: 'ALT-1092',
    timestamp: '14 mins ago',
    severity: 'CRITICAL',
    title: 'Fuel Volatility Crossed Critical Threshold',
    message:
      'Sector 07 (South Ridge Crest) fuel volatility reached 87. Synthetic Aperture Radar anomaly detected at -2.41 dB with 3.8 kPa VPD.',
    sectorId: 'SEC-07',
    isRead: false,
  },
  {
    id: 'ALT-1091',
    timestamp: '28 mins ago',
    severity: 'HIGH',
    title: 'Rapid Moisture Decline Flagged',
    message:
      'Sector 03 shows accelerated canopy desiccation of -16.2% over consecutive 12-hour Sentinel-1 observation window.',
    sectorId: 'SEC-03',
    isRead: false,
  },
  {
    id: 'ALT-1090',
    timestamp: '42 mins ago',
    severity: 'CRITICAL',
    title: 'High-Voltage Corridor Exposure',
    message:
      'Transmission Line 17 right-of-way intersects Sector 05 critical drying zone (0.4 km proximity). Human inspection advised.',
    sectorId: 'SEC-05',
    isRead: false,
  },
  {
    id: 'ALT-1089',
    timestamp: '1h 12m ago',
    severity: 'INFO',
    title: 'Sentinel-1 SAR Orbit Pass Processed',
    message:
      'Copernicus Sentinel-1 SAR C-band interferometric data ingested. Calibration confidence 87% at 06:42 UTC.',
    isRead: true,
  },
];
