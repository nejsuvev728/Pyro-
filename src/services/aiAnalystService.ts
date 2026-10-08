import { ForestSector } from '../types/intelligence';

export interface AnalystQueryResponse {
  query: string;
  response: string;
  keyDrivers: { label: string; value: string; impact: 'HIGH' | 'MODERATE' | 'LOW' }[];
  sources: string[];
  recommendation: string;
  confidence: number;
}

export const getAnalystResponse = async (
  prompt: string,
  selectedSector: ForestSector
): Promise<AnalystQueryResponse> => {
  const normalized = prompt.toLowerCase();

  // Pipeline P-18 high risk inquiry
  if (normalized.includes('p-18') && (normalized.includes('why') || normalized.includes('risk') || normalized.includes('exposure'))) {
    return {
      query: prompt,
      response: `Pipeline Segment P-18 (South Ridge Pass Corridor) currently exhibits an Asset Exposure score of 87 / 100 (HIGH EXPOSURE).\n\nKey exposure drivers:\n1. Direct Intersection: The 42.6 km corridor traverses Sector 07 where surrounding forest Fuel Volatility is 91.\n2. Dielectric Moisture Deficit: SAR observation reveals a +18.7% rapid canopy desiccation anomaly.\n3. Severe Atmospheric Evaporation: Regional Vapor Pressure Deficit (VPD) is elevated at 2.8 kPa.\n4. Wind Tunneling: Mountain saddle alignment channels 24 km/h prevailing gusts directly along the pipeline right-of-way.\n5. Historical Analogy: Current environmental conditions match historical pre-ignition patterns with 76% similarity.`,
      keyDrivers: [
        { label: 'Asset Exposure Rating', value: '87 / 100 (HIGH)', impact: 'HIGH' },
        { label: 'Surrounding Forest Volatility', value: '91 (Sector 07)', impact: 'HIGH' },
        { label: 'SAR Canopy Desiccation', value: '+18.7% Anomaly', impact: 'HIGH' },
        { label: 'Corridor Wind Channeling', value: '24 km/h (Ridge Pass)', impact: 'MODERATE' },
      ],
      sources: ['PYRO Orbital Radar Engine', 'Sentinel-1 C-SAR Swath', 'National Pipeline Asset GIS'],
      recommendation:
        'Initiate operator-defined emergency review; notify Pipeline Operations Control and verify telemetry on upstream valve V17 and downstream valve V18.',
      confidence: 93,
    };
  }

  // Pipeline what changed inquiry
  if (normalized.includes('what changed') && (normalized.includes('yesterday') || normalized.includes('pipeline') || normalized.includes('p-18'))) {
    return {
      query: prompt,
      response: `Over the past 24 hours, Pipeline P-18 exposure surged from 64 to 82 (+18 point delta).\n\nPrimary delta drivers:\n• Atmospheric VPD increased by +0.8 kPa (reaching 2.8 kPa).\n• Sustained wind velocities increased by +8 km/h along the saddle.\n• C-band radar backscatter confirmed an additional +4.2% dielectric foliar water loss.\n\nThis rapid transition moved P-18 from a moderate monitoring watch into active pre-ignition response review.`,
      keyDrivers: [
        { label: 'Exposure Delta (24h)', value: '64 → 82 (+18 pts)', impact: 'HIGH' },
        { label: 'Atmospheric VPD Surge', value: '+0.8 kPa Expansion', impact: 'HIGH' },
        { label: 'Dielectric Loss Velocity', value: '+4.2% Drying Shift', impact: 'HIGH' },
      ],
      sources: ['Sentinel-1 C-SAR Interferometry', 'Regional Weather Assimilation Grid'],
      recommendation:
        'Issue heightened vigilance advisory to field inspection drone crews along Mile 48 NH-766 crossing.',
      confidence: 91,
    };
  }

  // Which segment has the highest exposure inquiry
  if (normalized.includes('highest exposure') || normalized.includes('which segment')) {
    return {
      query: prompt,
      response: `Across the 1,284 km monitored network, two segments exceed elevated hazard thresholds:\n\n1. Priority 1 — Segment P-19 (Western Pass Descent, Pipeline C): Exposure 92 / 100 (CRITICAL). Direct intersection with Sector 05 (Fuel Volatility 93, 36 km/h wind).\n2. Priority 2 — Segment P-18 (South Ridge Pass, Pipeline C): Exposure 87 / 100 (HIGH). Rapid desiccation in Sector 07 across 42.6 km between valves V17 and V18.\n3. Priority 3 — Segment P-11 (Central Glade Lateral, Pipeline B): Exposure 54 / 100 (MODERATE).`,
      keyDrivers: [
        { label: 'Peak Exposed Segment', value: 'P-19 (Score: 92 CRITICAL)', impact: 'HIGH' },
        { label: 'Secondary Hotspot', value: 'P-18 (Score: 87 HIGH)', impact: 'HIGH' },
        { label: 'Network Total Elevated', value: '7 of 24 Segments', impact: 'MODERATE' },
      ],
      sources: ['PYRO Asset-Level Exposure Engine', 'Copernicus Sentinel-1 SAR'],
      recommendation:
        'Focus immediate response review on Pipeline C corridor (Segments P-18 and P-19).',
      confidence: 92,
    };
  }

  // What assets are near P-18 inquiry
  if (normalized.includes('assets') && (normalized.includes('near') || normalized.includes('p-18') || normalized.includes('nearby'))) {
    return {
      query: prompt,
      response: `The 42.6 km Exposure Evaluation Corridor for Segment P-18 contains 6 identified infrastructure nodes:\n\n• 3 Critical Energy Assets:\n  1. Gas Compression Node 3 (0.3 km offset from centerline)\n  2. Pumping Station Alpha-7 (0.6 km offset)\n  3. High-Voltage Substation Beta Intertie (0.8 km offset)\n\n• 2 Road Crossings:\n  1. NH-766 Highway Crossing Mile 48 (0.2 km)\n  2. Forest Patrol Ridge Access Cut #3 (0.5 km)\n\n• 1 WUI Settlement:\n  1. Gundlupet Forest Fringe Settlement (1.8 km downwind, ~2,400 residents)`,
      keyDrivers: [
        { label: 'Critical Energy Nodes', value: '3 Stations within 1.0 km', impact: 'HIGH' },
        { label: 'Highway Intersection', value: 'NH-766 Mile 48 (0.2 km)', impact: 'HIGH' },
        { label: 'Settlement Buffer', value: 'Gundlupet WUI (1.8 km)', impact: 'MODERATE' },
      ],
      sources: ['State Utility GIS Asset Grid', 'National Highway Transportation DB'],
      recommendation:
        'Verify deluge fire-suppression systems at Gas Compression Node 3 and alert regional highway patrol.',
      confidence: 94,
    };
  }

  // Configured isolation boundary inquiry
  if (normalized.includes('isolation boundary') || normalized.includes('v17') || normalized.includes('v18') || normalized.includes('valves')) {
    return {
      query: prompt,
      response: `Configured Isolation Boundary Topology for P-18:\n\nUpstream Isolation: Valve V17 (Western Saddle Block Valve, Armed Remote)\nDownstream Isolation: Valve V18 (Eastern Escarpment Gate, Armed Remote)\nAffected Pipe Length: 42.6 km\n\nOperational Isolation Assessment:\nIsolating V17 and V18 restricts potential hazard exposure to a localized 42.6 km segment, protecting the remaining 275.4 km of Pipeline C and preserving supply across unaffected sectors.\n\n*Note: PYRO provides decision support. Autonomous physical valve shutdown is neither claimed nor executed; all actions require human operator authorization.*`,
      keyDrivers: [
        { label: 'Configured Boundary', value: 'V17 ── P-18 ── V18', impact: 'HIGH' },
        { label: 'Isolated Run', value: '42.6 km (vs 1,284 km network)', impact: 'HIGH' },
        { label: 'Valve Control Status', value: 'Armed Remote / Operator Auth', impact: 'LOW' },
      ],
      sources: ['Pipeline SCADA System Architecture', 'PYRO Isolation Topology Engine'],
      recommendation:
        'Confirm SCADA line pack pressure between V17 and V18; ensure manual override personnel are stationed if needed.',
      confidence: 95,
    };
  }

  // Driving 72-hour forecast inquiry
  if (normalized.includes('forecast') && (normalized.includes('72') || normalized.includes('driving') || normalized.includes('trajectory'))) {
    return {
      query: prompt,
      response: `72-Hour Pipeline Exposure Trajectory for P-18:\n• NOW: 72\n• +24H: 78\n• +48H: 84\n• +72H: 86\nStatus: RISK INCREASING\n\nPrimary meteorological and satellite drivers:\n1. Persistent High VPD: Forecast atmospheric dryness remains above 2.8 kPa for the next 48 hours.\n2. Sustained Ridge Channeling: High diurnal thermal winds will sustain 24–32 km/h gusts through the pass.\n3. Cumulative Dielectric Loss: Soil and leaf moisture will continue dropping without precipitation relief.\n\nPeak exposure is projected at +72 hours, warranting proactive contingency staging rather than waiting for ground ignition.`,
      keyDrivers: [
        { label: 'Projected Exposure Peak', value: '86 (+14 pts over 72h)', impact: 'HIGH' },
        { label: 'Atmospheric Drying Duration', value: '48+ Hours Unrelieved', impact: 'HIGH' },
        { label: 'Wind Corridor Forecast', value: '24–32 km/h Channeling', impact: 'MODERATE' },
      ],
      sources: ['Open-Meteo High-Resolution NWP Assimilation', 'PYRO Pre-Ignition Forecasting Model'],
      recommendation:
        'Pre-stage regional fire suppression resources at Sector 07 access road within 24 hours.',
      confidence: 88,
    };
  }

  // Sector 07 specific inquiry
  if (normalized.includes('sector 07') || normalized.includes('why is sector 07') || normalized.includes('high risk')) {
    return {
      query: prompt,
      response: `Sector 07 currently exhibits an elevated Fuel Volatility Score of 87 (HIGH), positioned within the upper quartile of regional fire susceptibility.\n\nThe volatility surge is driven by a critical compounding alignment:\n\n1. Canopy Dielectric Moisture Deficit: A relative moisture loss of 18.4% indicates depleted cellular hydration in upper foliage.\n2. Atmospheric Vapor Deficit (VPD): VPD reached 3.8 kPa, far exceeding the typical 2.0 kPa threshold where vegetation enters forced stomatal closure and accelerated drying.\n3. Ridge Wind Exposure: Sustained gusts of 31 km/h along the crest exacerbate foliar moisture stripping.\n4. SAR Microwave Anomaly: Sentinel-1 C-band backscatter delta of -2.41 dB confirms physical dielectric loss through persistent microwave penetration.\n\nCurrent conditions correlate with historical pre-ignition patterns with an 82% similarity coefficient.`,
      keyDrivers: [
        { label: 'Canopy Moisture Loss', value: '-18.4% Relative', impact: 'HIGH' },
        { label: 'VPD Atmospheric Stress', value: '3.8 kPa', impact: 'HIGH' },
        { label: 'SAR Dielectric Shift', value: '-2.41 dB Delta', impact: 'HIGH' },
        { label: 'Crest Wind Exposure', value: '31 km/h ENE', impact: 'MODERATE' },
      ],
      sources: ['Sentinel-1 C-SAR (Copernicus)', 'Open-Meteo High-Res Assimilation', 'Historical Fire Ignition Archive'],
      recommendation:
        'Maintain heightened ground watch; dispatch utility line inspection for Line 17 right-of-way; stage suppression assets at South Ridge access road.',
      confidence: 87,
    };
  }

  // Last observation inquiry
  if (normalized.includes('last observation') || normalized.includes('what changed')) {
    return {
      query: prompt,
      response: `During the latest Sentinel-1 pass at 06:42 UTC, backscatter reflectance dropped by an additional -0.38 dB across Sector 07 and -0.42 dB across Sector 05.\n\nThis confirms that canopy water loss has accelerated over the past 12 hours. Concurrently, regional VPD expanded from 3.2 kPa to 3.8 kPa, widening the fuel volatility envelope northward toward the Sector 03 plateau border.`,
      keyDrivers: [
        { label: 'SAR Delta (12h)', value: '-0.38 dB Shift', impact: 'HIGH' },
        { label: 'VPD Expansion', value: '+0.6 kPa (Past 12h)', impact: 'HIGH' },
        { label: 'Observation Quality', value: '87% Radiometric Calibration', impact: 'LOW' },
      ],
      sources: ['Sentinel-1 C-SAR Interferometry', 'Regional Weather Assimilation'],
      recommendation:
        'Recalibrate predictive ignition models at 12:00 UTC pass; update aerial patrol coordinates.',
      confidence: 91,
    };
  }

  // Which sector needs attention
  if (normalized.includes('which sector') || normalized.includes('attention') || normalized.includes('priority')) {
    return {
      query: prompt,
      response: `Priority Order for Immediate Forestry & Operations Attention:\n\n1. Priority 1 — Sector 05 (Escarpment Pass): Fuel Volatility 93 (CRITICAL), VPD 4.2 kPa, 36 km/h wind corridor. Direct intersection with Transmission Line 17 (0.4 km offset).\n\n2. Priority 2 — Sector 07 (South Ridge Crest): Fuel Volatility 87 (HIGH), rapid moisture drop of -18.4%, high historical similarity (0.82) to historical fire events.\n\n3. Priority 3 — Sector 03 (Northern Plateau): Fuel Volatility 81 (HIGH), fastest drying velocity over last 24h (+4.2% acceleration).`,
      keyDrivers: [
        { label: 'Top Priority Sector', value: 'Sector 05 (Score: 93)', impact: 'HIGH' },
        { label: 'Secondary Priority', value: 'Sector 07 (Score: 87)', impact: 'HIGH' },
        { label: 'Direct Threat', value: 'Line 17 Corridor', impact: 'HIGH' },
      ],
      sources: ['Pyro Pre-Ignition Composite Matrix', 'NASA FIRMS Spatial Baselines'],
      recommendation:
        'Direct ground crews to Western Escarpment Pass (Sector 05) immediately for vegetation clearance verification.',
      confidence: 89,
    };
  }

  // Infrastructure inquiry
  if (normalized.includes('infrastructure') || normalized.includes('power') || normalized.includes('line 17')) {
    return {
      query: prompt,
      response: `Critical Infrastructure Intersection Analysis:\n\n• Transmission Line 17 (220kV): Right-of-way directly intersects Sector 05 and Sector 07 high-volatility envelope (0.4 km margin). Vegetation clearance is currently degraded (-42% margin), presenting severe hazard in the event of wind gusts exceeding 35 km/h.\n\n• Substation Beta (Escarpment Step-Up): Situated 0.2 km from critical dryness boundary. Automatic sprinkler perimeter defence is on standby.\n\n• Gundlupet Settlement Border: Located 1.8 km downwind from Sector 07 ridge. Pre-ignition bulletin advised.`,
      keyDrivers: [
        { label: 'Line 17 Fuel Exposure', value: '92 / 100 Hazard Index', impact: 'HIGH' },
        { label: 'Line 17 Clearance Margin', value: '-42% Below Optimal', impact: 'HIGH' },
        { label: 'Substation Proximity', value: '0.2 km to Critical Zone', impact: 'HIGH' },
      ],
      sources: ['State Utility GIS Asset Grid', 'Pyro Exposure Engine'],
      recommendation:
        'Issue decision-support advisory to utility dispatch for visual drone inspection. Avoid automated shutdowns without human validation.',
      confidence: 93,
    };
  }

  // Generic or other sector inquiry
  return {
    query: prompt,
    response: `Analysis for ${selectedSector.name} (${selectedSector.code}):\n\nCurrent Fuel Volatility Score is ${selectedSector.fuelVolatility} (${selectedSector.riskLevel}).\n\n• Canopy Moisture Anomaly: ${selectedSector.moistureAnomaly}% relative to seasonal baseline.\n• Atmospheric Vapor Pressure Deficit: ${selectedSector.vpd} kPa.\n• Surface Wind: ${selectedSector.windSpeed} km/h (${selectedSector.windDirection}).\n• SAR Radar Backscatter Anomaly: ${selectedSector.sarAnomaly} dB.\n\nContributing weights indicate canopy water stress accounts for ${selectedSector.driverBreakdown.canopyMoisture}% of the localized risk rating.`,
    keyDrivers: [
      { label: 'Fuel Volatility Score', value: `${selectedSector.fuelVolatility} (${selectedSector.riskLevel})`, impact: selectedSector.fuelVolatility > 75 ? 'HIGH' : 'MODERATE' },
      { label: 'Moisture Anomaly', value: `${selectedSector.moistureAnomaly}%`, impact: selectedSector.moistureAnomaly < -15 ? 'HIGH' : 'MODERATE' },
      { label: 'VPD Dryness', value: `${selectedSector.vpd} kPa`, impact: selectedSector.vpd > 3.0 ? 'HIGH' : 'MODERATE' },
    ],
    sources: ['Sentinel-1 SAR C-band', 'Open-Meteo Weather Assimilation', 'Regional Historical Baselines'],
    recommendation:
      selectedSector.fuelVolatility > 75
        ? 'Sector is under active pre-ignition watch. Prioritize visual scouting and fuel moisture sampling.'
        : 'Conditions remain within manageable operational thresholds. Continue standard orbital monitoring.',
    confidence: selectedSector.observationConfidence,
  };
};
