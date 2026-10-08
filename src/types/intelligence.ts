export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface ForestSector {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  center: [number, number]; // relative map coordinates (0-100)
  polygon: [number, number][]; // relative polygon points
  elevation: {
    min: number;
    max: number;
    avg: number;
  };
  areaKm2: number;
  vegetationType: string;
  fuelVolatility: number; // 0 - 100
  moistureAnomaly: number; // percentage change, e.g. -18.4%
  vpd: number; // Vapor Pressure Deficit in kPa
  windSpeed: number; // km/h
  windDirection: string; // e.g. "ENE 62°"
  windDegrees: number;
  sarAnomaly: number; // backscatter delta in dB, e.g. -2.41 dB
  historicalSimilarity: number; // 0 - 1.0 (e.g. 0.82)
  riskLevel: RiskLevel;
  lastObservationUtc: string;
  observationConfidence: number; // 0 - 100%
  driverBreakdown: {
    canopyMoisture: number; // 0-100 contribution weight
    vpdDryness: number;
    windExposure: number;
    sarBackscatter: number;
    historicalPattern: number;
  };
  explanationPoints: {
    title: string;
    description: string;
    metric: string;
  }[];
  forecast72h: {
    time: string;
    offsetHours: number;
    risk: number;
    vpd: number;
    wind: number;
  }[];
}

export interface MonitoredRegion {
  id: string;
  name: string;
  country: string;
  totalAreaKm2: number;
  centerCoords: string;
  activeRiskZones: {
    critical: number;
    high: number;
    elevated: number;
    moderate: number;
    low: number;
  };
  avgFuelVolatility: number;
  sarOrbitStatus: 'ONLINE' | 'ACQUIRING' | 'SCHEDULED';
  sectors: ForestSector[];
}

export interface TimeWarpStep {
  stepId: string;
  label: string; // e.g. "T-48H"
  hoursFromEvent: number; // -48, -36, -24, -12, 0, +3
  timestamp: string;
  fuelVolatility: number;
  moistureAnomaly: number;
  vpd: number;
  windSpeed: number;
  sarAnomalyDb: number;
  riskLevel: RiskLevel;
  headline: string;
  summary: string;
  sectorRisks: Record<string, { risk: number; level: RiskLevel }>;
  ignitionActive?: boolean;
  ignitionCoords?: [number, number];
}

export interface HistoricalEvent {
  id: string;
  name: string;
  forestName: string;
  date: string;
  description: string;
  ignitionCauseRecorded: string;
  steps: TimeWarpStep[];
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'TRANSMISSION_LINE' | 'SUBSTATION' | 'SETTLEMENT' | 'ROAD_CORRIDOR';
  riskLevel: RiskLevel;
  fuelExposure: number; // 0-100
  windExposure: number; // 0-100
  vegetationExposure: number; // 0-100
  distanceToHighRiskKm: number;
  intersectingSectorId: string;
  path?: [number, number][]; // coordinates for lines/roads
  point?: [number, number]; // coordinate for point assets
  clearanceMarginPct: number; // e.g. -42%
  recommendedResponse: string;
  actionTakenStatus: 'PENDING_REVIEW' | 'INSPECTION_DISPATCHED' | 'MONITORING';
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'INFO';
  title: string;
  message: string;
  sectorId?: string;
  isRead: boolean;
}

export interface LayerVisibilityState {
  forest: boolean;
  fuelVolatility: boolean;
  riskZones: boolean;
  wind: boolean;
  sarAnomaly: boolean;
  historicalFires: boolean;
  pipelines: boolean;
  isolationValves: boolean;
  roads: boolean;
  settlements: boolean;
  criticalInfrastructure: boolean;
  sarMoisture?: boolean;
  powerInfrastructure?: boolean;
  vpd?: boolean;
}

export type PipelineResponseStatus =
  | 'DETECTED'
  | 'UNDER_REVIEW'
  | 'NOTIFIED'
  | 'ISOLATION_REQUESTED'
  | 'OPERATOR_AUTHORIZED'
  | 'RESOLVED';

export interface IsolationValve {
  id: string; // e.g. "V17", "V18"
  name: string; // e.g. "Valve V17 (Western Saddle Cutoff)"
  position: [number, number]; // relative map coordinates
  type: 'MAINLINE_BLOCK_VALVE' | 'CHECK_VALVE' | 'STATION_ISOLATION';
  status: 'ARMED_REMOTE' | 'STANDBY' | 'MANUAL_OVERRIDE_AVAILABLE';
  operatorAuthorizationRequired: boolean;
}

export interface NearbyAsset {
  id: string;
  name: string;
  type: 'CRITICAL_ASSET' | 'ROAD_CROSSING' | 'SETTLEMENT';
  distanceKm: number;
  position: [number, number];
  description: string;
}

export interface PipelineSegment {
  id: string; // e.g. "P-18"
  pipelineId: string; // e.g. "PIPE-C"
  name: string;
  forestSectorId: string; // e.g. "SEC-07"
  forestSectorName: string;
  riskLevel: RiskLevel;
  assetExposure: number; // 0 - 100
  fuelVolatility: number; // 0 - 100 (separate from asset exposure!)
  moistureAnomalyPct: number;
  vpdKpa: number;
  windKmh: number;
  historicalSimilarityPct: number;
  affectedLengthKm: number;
  upstreamValve: IsolationValve;
  downstreamValve: IsolationValve;
  corridorPath: [number, number][];
  exposureCorridorPolygon?: [number, number][];
  nearbyAssets: NearbyAsset[];
  responseStatus: PipelineResponseStatus;
  recommendedActions: string[];
  forecast72h: {
    time: string;
    offsetHours: number;
    exposure: number;
  }[];
  deltaFromYesterday: {
    previousExposure: number;
    currentExposure: number;
    drivers: string[];
  };
  timeWarpReplay: {
    t48h: { exposure: number; level: RiskLevel };
    t24h: { exposure: number; level: RiskLevel };
    now: { exposure: number; level: RiskLevel };
  };
}

export interface PipelineNetwork {
  pipeline_id: string;
  name: string;
  operator: string;
  total_length: number;
  status: RiskLevel;
  segments: PipelineSegment[];
}

