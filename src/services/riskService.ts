import { ForestSector, RiskLevel } from '../types/intelligence';

export interface FuelVolatilityWeights {
  canopyMoistureWeight: number; // e.g. 0.30
  vpdWeight: number; // e.g. 0.25
  windWeight: number; // e.g. 0.20
  sarAnomalyWeight: number; // e.g. 0.15
  historicalWeight: number; // e.g. 0.10
}

export const DEFAULT_WEIGHTS: FuelVolatilityWeights = {
  canopyMoistureWeight: 0.3,
  vpdWeight: 0.25,
  windWeight: 0.2,
  sarAnomalyWeight: 0.15,
  historicalWeight: 0.1,
};

export const calculateCompositeRisk = (
  moistureAnomalyPct: number,
  vpdKpa: number,
  windSpeedKmh: number,
  sarAnomalyDb: number,
  historicalSim: number,
  weights = DEFAULT_WEIGHTS
): { score: number; level: RiskLevel } => {
  // Normalize each factor to a 0-100 hazard index
  const moistureHazard = Math.min(100, Math.max(0, Math.abs(moistureAnomalyPct) * 4.5));
  const vpdHazard = Math.min(100, Math.max(0, (vpdKpa / 4.5) * 100));
  const windHazard = Math.min(100, Math.max(0, (windSpeedKmh / 45) * 100));
  const sarHazard = Math.min(100, Math.max(0, (Math.abs(sarAnomalyDb) / 3.0) * 100));
  const histHazard = Math.min(100, Math.max(0, historicalSim * 100));

  const composite = Math.round(
    moistureHazard * weights.canopyMoistureWeight +
      vpdHazard * weights.vpdWeight +
      windHazard * weights.windWeight +
      sarHazard * weights.sarAnomalyWeight +
      histHazard * weights.historicalWeight
  );

  let level: RiskLevel = 'LOW';
  if (composite >= 90) level = 'CRITICAL';
  else if (composite >= 75) level = 'HIGH';
  else if (composite >= 60) level = 'ELEVATED';
  else if (composite >= 40) level = 'MODERATE';

  return { score: composite, level };
};

export const getSectorStatusColor = (level: RiskLevel) => {
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-[#96382E]/15',
        text: 'text-[#96382E]',
        border: 'border-[#96382E]/40',
        hex: '#96382E',
        glow: 'rgba(150, 56, 46, 0.35)',
      };
    case 'HIGH':
      return {
        bg: 'bg-[#C95D35]/15',
        text: 'text-[#C95D35]',
        border: 'border-[#C95D35]/40',
        hex: '#C95D35',
        glow: 'rgba(201, 93, 53, 0.3)',
      };
    case 'ELEVATED':
      return {
        bg: 'bg-[#E58A3A]/15',
        text: 'text-[#C95D35]',
        border: 'border-[#E58A3A]/40',
        hex: '#E58A3A',
        glow: 'rgba(229, 138, 58, 0.25)',
      };
    case 'MODERATE':
      return {
        bg: 'bg-[#87946C]/15',
        text: 'text-[#526B45]',
        border: 'border-[#87946C]/40',
        hex: '#87946C',
        glow: 'rgba(135, 148, 108, 0.2)',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-[#526B45]/15',
        text: 'text-[#263D2C]',
        border: 'border-[#526B45]/30',
        hex: '#526B45',
        glow: 'rgba(82, 107, 69, 0.15)',
      };
  }
};
