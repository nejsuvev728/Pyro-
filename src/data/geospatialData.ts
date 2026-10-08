// Geospatial datasets for Bandipur Forest Complex / Western Ghats Range
// Centered around 11.662° N, 76.629° E (realistic geographic coordinates)

export interface GeoJsonFeature<G = any, P = any> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJsonFeatureCollection<G = any, P = any> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<G, P>[];
}

// Center point of Bandipur Forest Complex
export const BANDIPUR_CENTER_COORDS: [number, number] = [76.629, 11.662]; // [lng, lat]
export const BANDIPUR_BOUNDS: [[number, number], [number, number]] = [
  [76.500, 11.560], // Southwest [lng, lat]
  [76.750, 11.770], // Northeast [lng, lat]
];

// 1. Forest Sector Polygons (Realistic geographic forest polygons)
export const FOREST_SECTORS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'SEC-07',
        code: 'SEC-07',
        name: 'Sector 07 - South Ridge Crest',
        riskLevel: 'HIGH',
        fuelVolatility: 91,
        sarAnomaly: '+18.7%',
        vpd: '2.8 kPa',
        wind: '24 km/h',
        historicalSimilarity: '76%',
        vegetationType: 'Dry Deciduous / Bamboo Breaks',
        areaKm2: 68.4,
        avgElevation: 1180,
        pipelineExposure: 'P-18 (High Exposure)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.602, 11.648],
            [76.624, 11.674],
            [76.658, 11.672],
            [76.666, 11.650],
            [76.645, 11.632],
            [76.618, 11.635],
            [76.602, 11.648],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-05',
        code: 'SEC-05',
        name: 'Sector 05 - Western Escarpment Pass',
        riskLevel: 'CRITICAL',
        fuelVolatility: 93,
        sarAnomaly: '+21.2%',
        vpd: '4.2 kPa',
        wind: '36 km/h',
        historicalSimilarity: '89%',
        vegetationType: 'Teak Plantation / Mixed Scrub',
        areaKm2: 54.2,
        avgElevation: 1010,
        pipelineExposure: 'P-19 (Critical Exposure)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.562, 11.678],
            [76.592, 11.705],
            [76.608, 11.692],
            [76.598, 11.665],
            [76.572, 11.660],
            [76.562, 11.678],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-03',
        code: 'SEC-03',
        name: 'Sector 03 - Northern Plateau Border',
        riskLevel: 'HIGH',
        fuelVolatility: 81,
        sarAnomaly: '+16.2%',
        vpd: '3.4 kPa',
        wind: '28 km/h',
        historicalSimilarity: '77%',
        vegetationType: 'Dry Thorn Scrub',
        areaKm2: 61.8,
        avgElevation: 840,
        pipelineExposure: 'Transmission Corridor 04',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.620, 11.708],
            [76.655, 11.738],
            [76.682, 11.725],
            [76.668, 11.695],
            [76.634, 11.692],
            [76.620, 11.708],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-01',
        code: 'SEC-01',
        name: 'Sector 01 - Moyar River Basin',
        riskLevel: 'LOW',
        fuelVolatility: 24,
        sarAnomaly: '-2.1%',
        vpd: '1.4 kPa',
        wind: '14 km/h',
        historicalSimilarity: '18%',
        vegetationType: 'Riparian Woodland / Semi-Evergreen',
        areaKm2: 59.0,
        avgElevation: 720,
        pipelineExposure: 'P-04 (Lowland River Run)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.578, 11.605],
            [76.612, 11.624],
            [76.638, 11.615],
            [76.625, 11.595],
            [76.592, 11.588],
            [76.578, 11.605],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-02',
        code: 'SEC-02',
        name: 'Sector 02 - Central Sanctuary Glade',
        riskLevel: 'MODERATE',
        fuelVolatility: 58,
        sarAnomaly: '+9.8%',
        vpd: '2.6 kPa',
        wind: '21 km/h',
        historicalSimilarity: '54%',
        vegetationType: 'Moist Deciduous / Open Grassland',
        areaKm2: 48.7,
        avgElevation: 860,
        pipelineExposure: 'P-11 (Central Glade Lateral)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.595, 11.635],
            [76.622, 11.648],
            [76.632, 11.632],
            [76.615, 11.618],
            [76.598, 11.624],
            [76.595, 11.635],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-04',
        code: 'SEC-04',
        name: 'Sector 04 - Eastern Foothills',
        riskLevel: 'MODERATE',
        fuelVolatility: 62,
        sarAnomaly: '+11.4%',
        vpd: '2.9 kPa',
        wind: '23 km/h',
        historicalSimilarity: '61%',
        vegetationType: 'Dry Deciduous / Scrub',
        areaKm2: 56.4,
        avgElevation: 910,
        pipelineExposure: 'Agricultural Buffer Interface',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.662, 11.665],
            [76.698, 11.685],
            [76.715, 11.662],
            [76.688, 11.642],
            [76.662, 11.665],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-06',
        code: 'SEC-06',
        name: 'Sector 06 - Southern Nilgiri Foothills',
        riskLevel: 'LOW',
        fuelVolatility: 38,
        sarAnomaly: '+3.5%',
        vpd: '1.8 kPa',
        wind: '17 km/h',
        historicalSimilarity: '29%',
        vegetationType: 'Submontane Evergreen Fringe',
        areaKm2: 64.1,
        avgElevation: 1250,
        pipelineExposure: 'South Reserve Lateral',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.635, 11.605],
            [76.668, 11.625],
            [76.682, 11.595],
            [76.648, 11.582],
            [76.635, 11.605],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SEC-08',
        code: 'SEC-08',
        name: 'Sector 08 - Western Reserve Border',
        riskLevel: 'LOW',
        fuelVolatility: 31,
        sarAnomaly: '+4.3%',
        vpd: '1.7 kPa',
        wind: '16 km/h',
        historicalSimilarity: '24%',
        vegetationType: 'Mixed Moist Evergreen & Teak',
        areaKm2: 52.1,
        avgElevation: 820,
        pipelineExposure: 'P-07 (Valley Basin Spur)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.540, 11.690],
            [76.568, 11.715],
            [76.572, 11.675],
            [76.545, 11.660],
            [76.540, 11.690],
          ],
        ],
      },
    },
  ],
};

// 2. Wildfire Continuous Risk Heatmap & Multi-Ring Contours
// Dense geographic risk sampling points across the forest topography
export const RISK_HEATMAP_POINTS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Sector 05 - Western Escarpment Pass (CRITICAL: 0.90 - 0.98)
    { type: 'Feature', properties: { riskWeight: 0.96, level: 'CRITICAL', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.582, 11.691] } },
    { type: 'Feature', properties: { riskWeight: 0.94, level: 'CRITICAL', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.586, 11.688] } },
    { type: 'Feature', properties: { riskWeight: 0.92, level: 'CRITICAL', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.578, 11.682] } },
    { type: 'Feature', properties: { riskWeight: 0.91, level: 'CRITICAL', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.592, 11.695] } },
    { type: 'Feature', properties: { riskWeight: 0.88, level: 'HIGH', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.570, 11.676] } },
    { type: 'Feature', properties: { riskWeight: 0.85, level: 'HIGH', sectorId: 'SEC-05' }, geometry: { type: 'Point', coordinates: [76.600, 11.678] } },

    // Sector 07 - South Ridge Crest (HIGH / CRITICAL POCKET: 0.82 - 0.93)
    { type: 'Feature', properties: { riskWeight: 0.92, level: 'CRITICAL', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.632, 11.662] } },
    { type: 'Feature', properties: { riskWeight: 0.89, level: 'HIGH', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.626, 11.658] } },
    { type: 'Feature', properties: { riskWeight: 0.87, level: 'HIGH', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.640, 11.664] } },
    { type: 'Feature', properties: { riskWeight: 0.84, level: 'HIGH', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.618, 11.652] } },
    { type: 'Feature', properties: { riskWeight: 0.82, level: 'HIGH', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.648, 11.655] } },
    { type: 'Feature', properties: { riskWeight: 0.78, level: 'HIGH', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.612, 11.644] } },
    { type: 'Feature', properties: { riskWeight: 0.75, level: 'ELEVATED', sectorId: 'SEC-07' }, geometry: { type: 'Point', coordinates: [76.656, 11.646] } },

    // Sector 03 - Northern Plateau Border (HIGH / ELEVATED: 0.72 - 0.84)
    { type: 'Feature', properties: { riskWeight: 0.82, level: 'HIGH', sectorId: 'SEC-03' }, geometry: { type: 'Point', coordinates: [76.645, 11.724] } },
    { type: 'Feature', properties: { riskWeight: 0.79, level: 'HIGH', sectorId: 'SEC-03' }, geometry: { type: 'Point', coordinates: [76.638, 11.716] } },
    { type: 'Feature', properties: { riskWeight: 0.74, level: 'ELEVATED', sectorId: 'SEC-03' }, geometry: { type: 'Point', coordinates: [76.656, 11.718] } },
    { type: 'Feature', properties: { riskWeight: 0.69, level: 'ELEVATED', sectorId: 'SEC-03' }, geometry: { type: 'Point', coordinates: [76.668, 11.712] } },

    // Sector 02 - Central Glade (MODERATE / ELEVATED: 0.52 - 0.65)
    { type: 'Feature', properties: { riskWeight: 0.62, level: 'ELEVATED', sectorId: 'SEC-02' }, geometry: { type: 'Point', coordinates: [76.611, 11.649] } },
    { type: 'Feature', properties: { riskWeight: 0.56, level: 'NORMAL', sectorId: 'SEC-02' }, geometry: { type: 'Point', coordinates: [76.604, 11.638] } },
    { type: 'Feature', properties: { riskWeight: 0.52, level: 'NORMAL', sectorId: 'SEC-02' }, geometry: { type: 'Point', coordinates: [76.618, 11.632] } },

    // Sector 04 - Eastern Foothills (MODERATE: 0.55 - 0.68)
    { type: 'Feature', properties: { riskWeight: 0.66, level: 'ELEVATED', sectorId: 'SEC-04' }, geometry: { type: 'Point', coordinates: [76.685, 11.678] } },
    { type: 'Feature', properties: { riskWeight: 0.58, level: 'NORMAL', sectorId: 'SEC-04' }, geometry: { type: 'Point', coordinates: [76.674, 11.668] } },
    { type: 'Feature', properties: { riskWeight: 0.53, level: 'NORMAL', sectorId: 'SEC-04' }, geometry: { type: 'Point', coordinates: [76.696, 11.662] } },

    // Sector 01 - Moyar River Basin (LOW: 0.20 - 0.32)
    { type: 'Feature', properties: { riskWeight: 0.28, level: 'LOW', sectorId: 'SEC-01' }, geometry: { type: 'Point', coordinates: [76.598, 11.618] } },
    { type: 'Feature', properties: { riskWeight: 0.24, level: 'LOW', sectorId: 'SEC-01' }, geometry: { type: 'Point', coordinates: [76.612, 11.610] } },
    { type: 'Feature', properties: { riskWeight: 0.21, level: 'LOW', sectorId: 'SEC-01' }, geometry: { type: 'Point', coordinates: [76.586, 11.602] } },

    // Sector 06 & 08 (LOW: 0.25 - 0.38)
    { type: 'Feature', properties: { riskWeight: 0.35, level: 'LOW', sectorId: 'SEC-06' }, geometry: { type: 'Point', coordinates: [76.655, 11.602] } },
    { type: 'Feature', properties: { riskWeight: 0.30, level: 'LOW', sectorId: 'SEC-08' }, geometry: { type: 'Point', coordinates: [76.554, 11.685] } },
  ],
};

// 3. Subtle Risk Contours (Elevated, High, Critical transitions)
export const RISK_CONTOURS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Sector 07 Ridge - High / Critical Contours
    {
      type: 'Feature',
      properties: { level: 'CRITICAL', color: '#96382E', strokeWidth: 1.8, label: 'CRITICAL RIDGE CREST' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.620, 11.665],
          [76.628, 11.668],
          [76.638, 11.666],
          [76.644, 11.660],
          [76.640, 11.654],
          [76.628, 11.656],
          [76.620, 11.665],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { level: 'HIGH', color: '#C95D35', strokeWidth: 1.4, label: 'HIGH RISK CONTOUR' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.612, 11.660],
          [76.624, 11.672],
          [76.646, 11.670],
          [76.654, 11.656],
          [76.648, 11.646],
          [76.626, 11.648],
          [76.612, 11.660],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { level: 'ELEVATED', color: '#E5A33A', strokeWidth: 1.2, label: 'ELEVATED TRANSITION' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.605, 11.652],
          [76.622, 11.676],
          [76.656, 11.674],
          [76.664, 11.652],
          [76.652, 11.638],
          [76.618, 11.640],
          [76.605, 11.652],
        ],
      },
    },

    // Sector 05 Escarpment - Critical & High Contours
    {
      type: 'Feature',
      properties: { level: 'CRITICAL', color: '#96382E', strokeWidth: 2.0, label: 'CRITICAL ESCARPMENT PASS' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.574, 11.686],
          [76.586, 11.696],
          [76.596, 11.692],
          [76.592, 11.680],
          [76.580, 11.680],
          [76.574, 11.686],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { level: 'HIGH', color: '#C95D35', strokeWidth: 1.4, label: 'HIGH RISK ESCARPMENT' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.568, 11.682],
          [76.588, 11.702],
          [76.604, 11.696],
          [76.598, 11.674],
          [76.576, 11.672],
          [76.568, 11.682],
        ],
      },
    },
  ],
};

// 4. Critical Red Zones (High-Risk Polygons with subtle pulse effect)
export const CRITICAL_RED_ZONES_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'CRIT-ZONE-SEC07',
        sectorId: 'SEC-07',
        name: 'CRITICAL ZONE · SECTOR 07 CREST',
        fuelRisk: 91,
        color: '#96382E',
        pipelineExposure: 'P-18',
        label: 'CRITICAL ZONE\nFUEL RISK: 91\nSECTOR 07',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.620, 11.665],
            [76.628, 11.668],
            [76.638, 11.666],
            [76.644, 11.660],
            [76.640, 11.654],
            [76.628, 11.656],
            [76.620, 11.665],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'CRIT-ZONE-SEC05',
        sectorId: 'SEC-05',
        name: 'CRITICAL ZONE · SECTOR 05 PASS',
        fuelRisk: 93,
        color: '#96382E',
        pipelineExposure: 'P-19',
        label: 'CRITICAL ZONE\nFUEL RISK: 93\nSECTOR 05',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.574, 11.686],
            [76.586, 11.696],
            [76.596, 11.692],
            [76.592, 11.680],
            [76.580, 11.680],
            [76.574, 11.686],
          ],
        ],
      },
    },
  ],
};

// 5. Pipeline Network & Operational Segments (P-16, P-17, P-18, P-19)
export const PIPELINE_SEGMENTS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // P-16: Valley Intake Corridor (Low Risk)
    {
      type: 'Feature',
      properties: {
        id: 'P-16',
        segmentId: 'P-16',
        pipelineId: 'PIPE-C',
        name: 'P-16 (Valley Basin Feeder)',
        riskLevel: 'LOW',
        color: '#526B45',
        assetExposure: 28,
        fuelVolatility: 32,
        sarAnomaly: '+2.4%',
        vpd: '1.6 kPa',
        wind: '16 km/h',
        affectedLengthKm: 34.5,
        isolationBoundary: 'V15 → V16',
        upstreamValveId: 'V15',
        downstreamValveId: 'V16',
        forestSectorId: 'SEC-01',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.550, 11.600],
          [76.568, 11.608],
          [76.585, 11.616],
        ],
      },
    },
    // P-17: Moyar Saddle Link (Moderate / Elevated)
    {
      type: 'Feature',
      properties: {
        id: 'P-17',
        segmentId: 'P-17',
        pipelineId: 'PIPE-C',
        name: 'P-17 (Moyar Saddle Link)',
        riskLevel: 'MODERATE',
        color: '#E5A33A',
        assetExposure: 58,
        fuelVolatility: 64,
        sarAnomaly: '+9.2%',
        vpd: '2.5 kPa',
        wind: '20 km/h',
        affectedLengthKm: 28.2,
        isolationBoundary: 'V16 → V17',
        upstreamValveId: 'V16',
        downstreamValveId: 'V17',
        forestSectorId: 'SEC-02',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.585, 11.616],
          [76.598, 11.632],
          [76.615, 11.650],
        ],
      },
    },
    // P-18: South Ridge Pass Corridor (HIGH EXPOSURE - Focal Segment)
    {
      type: 'Feature',
      properties: {
        id: 'P-18',
        segmentId: 'P-18',
        pipelineId: 'PIPE-C',
        name: 'P-18 (South Ridge Pass Corridor)',
        riskLevel: 'HIGH',
        color: '#C95D35',
        assetExposure: 87,
        fuelVolatility: 91,
        sarAnomaly: '+18.7%',
        vpd: '2.8 kPa',
        wind: '24 km/h',
        historicalSimilarity: '76%',
        affectedLengthKm: 42.6,
        isolationBoundary: 'V17 → V18',
        upstreamValveId: 'V17',
        downstreamValveId: 'V18',
        forestSectorId: 'SEC-07',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.615, 11.650],
          [76.626, 11.658],
          [76.638, 11.664],
          [76.650, 11.668],
          [76.665, 11.670],
        ],
      },
    },
    // P-19: Western Pass Descent (CRITICAL EXPOSURE)
    {
      type: 'Feature',
      properties: {
        id: 'P-19',
        segmentId: 'P-19',
        pipelineId: 'PIPE-C',
        name: 'P-19 (Western Pass Descent)',
        riskLevel: 'CRITICAL',
        color: '#96382E',
        assetExposure: 92,
        fuelVolatility: 93,
        sarAnomaly: '+21.2%',
        vpd: '4.2 kPa',
        wind: '36 km/h',
        historicalSimilarity: '89%',
        affectedLengthKm: 38.4,
        isolationBoundary: 'V18 → V19',
        upstreamValveId: 'V18',
        downstreamValveId: 'V19',
        forestSectorId: 'SEC-05',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.665, 11.670],
          [76.680, 11.682],
          [76.695, 11.690],
          [76.715, 11.700],
        ],
      },
    },
  ],
};

// 6. Isolation Valves Markers (V16, V17, V18, V19)
export const ISOLATION_VALVES_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'V16',
        name: 'Isolation Valve V16',
        role: 'Segment Boundary Valve',
        pipeline: 'P-16 / P-17',
        status: 'OPERATIONAL',
        type: 'Mainline Block Valve',
        statusColor: '#526B45',
        elevationM: 780,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.585, 11.616],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'V17',
        name: 'Isolation Valve V17',
        role: 'Upstream Isolation for P-18',
        pipeline: 'P-18 (South Ridge Pass)',
        status: 'ARMED_REMOTE',
        type: 'Remote Actuated Gate Valve',
        statusColor: '#C95D35',
        elevationM: 1040,
        subtext: 'Upstream Isolation Boundary',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.615, 11.650],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'V18',
        name: 'Isolation Valve V18',
        role: 'Downstream Isolation for P-18',
        pipeline: 'P-18 (South Ridge Pass)',
        status: 'ARMED_REMOTE',
        type: 'Mainline Block Valve',
        statusColor: '#C95D35',
        elevationM: 1120,
        subtext: 'Downstream Isolation Boundary',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.665, 11.670],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'V19',
        name: 'Isolation Valve V19',
        role: 'Escarpment Safety Valve',
        pipeline: 'P-19 (Western Pass Descent)',
        status: 'ARMED_REMOTE',
        type: 'Emergency Relief & Isolation',
        statusColor: '#96382E',
        elevationM: 980,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.715, 11.700],
      },
    },
  ],
};

// 7. Critical Infrastructure (Compressor nodes, Substations, Power Transmission Lines)
export const CRITICAL_INFRASTRUCTURE_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-COMP-3',
        name: 'Gas Compression Node 3',
        type: 'COMPRESSOR_STATION',
        icon: 'zap',
        riskLevel: 'HIGH',
        exposureScore: 89,
        distanceToP18: '0.3 km',
        description: 'Mainline booster station with dedicated dual deluge backup.',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.634, 11.663],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-PUMP-A7',
        name: 'Pumping Station Alpha-7',
        type: 'PUMP_STATION',
        icon: 'activity',
        riskLevel: 'HIGH',
        exposureScore: 84,
        distanceToP18: '0.6 km',
        description: 'Intermediate pressure regulating substation with 36h backup generator.',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.622, 11.654],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-SUB-BETA',
        name: 'High-Voltage Substation Beta Intertie',
        type: 'SUBSTATION',
        icon: 'zap',
        riskLevel: 'CRITICAL',
        exposureScore: 92,
        distanceToP18: '0.8 km',
        description: '220kV grid step-down facility serving regional compressors.',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.645, 11.666],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-TOWER-GOPALA',
        name: 'Gopalaswamy Peak Wildfire Tower',
        type: 'FIRE_WATCH_TOWER',
        icon: 'radio',
        riskLevel: 'HIGH',
        exposureScore: 78,
        distanceToP18: '2.4 km',
        description: 'High-altitude optical & infrared automated thermal camera perch.',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.602, 11.722],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-RANGER-HQ',
        name: 'Bandipur Forestry Operations HQ',
        type: 'EMERGENCY_FACILITY',
        icon: 'shield',
        riskLevel: 'LOW',
        exposureScore: 36,
        distanceToP18: '1.9 km',
        description: 'Regional rapid forest firefighting response depot & air tanker pad.',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.632, 11.668],
      },
    },
    // Transmission Line 17 (220kV Ridge Intertie)
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-LINE-17',
        name: 'Transmission Line 17 (220kV Ridge Intertie)',
        type: 'TRANSMISSION_LINE',
        riskLevel: 'CRITICAL',
        color: '#96382E',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.565, 11.675],
          [76.585, 11.685],
          [76.615, 11.670],
          [76.645, 11.666],
          [76.675, 11.658],
          [76.710, 11.650],
        ],
      },
    },
    // Transmission Line 04 (110kV Northern Feeder)
    {
      type: 'Feature',
      properties: {
        id: 'INFRA-LINE-04',
        name: 'Transmission Line 04 (110kV Northern Feeder)',
        type: 'TRANSMISSION_LINE',
        riskLevel: 'HIGH',
        color: '#C95D35',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.618, 11.705],
          [76.640, 11.720],
          [76.670, 11.730],
          [76.710, 11.735],
        ],
      },
    },
  ],
};

// 8. Roads & Transport Corridors (Highways, Major Roads, Forest Access)
export const ROADS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'ROAD-NH766',
        name: 'National Highway NH-766 (Mysuru–Ooty Pass)',
        category: 'HIGHWAY',
        color: '#5C5446',
        width: 3.0,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.545, 11.745],
          [76.585, 11.730],
          [76.630, 11.675],
          [76.650, 11.645],
          [76.670, 11.615],
          [76.690, 11.580],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'ROAD-SH181',
        name: 'State Highway SH-181 (Ghat Cutoff)',
        category: 'MAJOR_ROAD',
        color: '#7A7264',
        width: 2.0,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.580, 11.670],
          [76.605, 11.660],
          [76.635, 11.650],
          [76.660, 11.642],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'ROAD-PATROL-3',
        name: 'Forest Patrol Ridge Access Cut #3',
        category: 'FOREST_ACCESS',
        color: '#9E9484',
        width: 1.5,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.620, 11.654],
          [76.635, 11.662],
          [76.650, 11.665],
        ],
      },
    },
  ],
};

// 9. Settlements & WUI Buffer Zones
export const SETTLEMENTS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'SETTLE-GUNDLUPET',
        name: 'Gundlupet WUI Buffer',
        category: 'TOWN',
        population: '2,400 residents',
        distanceToP18: '1.8 km',
        riskLevel: 'HIGH',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.685, 11.720],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SETTLE-MASINAGUDI',
        name: 'Masinagudi Valley Settlement',
        category: 'VILLAGE',
        population: '1,650 residents',
        distanceToP18: '4.2 km',
        riskLevel: 'LOW',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.640, 11.575],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SETTLE-BANDIPUR',
        name: 'Bandipur Reserve Village',
        category: 'VILLAGE',
        population: '540 residents',
        distanceToP18: '1.2 km',
        riskLevel: 'HIGH',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.632, 11.668],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'SETTLE-MANGALA',
        name: 'Mangala Eco-Hamlet',
        category: 'VILLAGE',
        population: '320 residents',
        distanceToP18: '2.1 km',
        riskLevel: 'MODERATE',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.648, 11.642],
      },
    },
  ],
};

// 10. Historical Fire Locations
export const HISTORICAL_FIRES_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'HIST-2024-08',
        date: '18 Aug 2024',
        sector: '07 (South Ridge)',
        distanceKm: 3.2,
        similarity: '76%',
        burnedAreaHa: 142,
        ignitionType: 'Dry Lightning / Foliar Arcing',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.638, 11.664],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'HIST-2021-03',
        date: '12 Mar 2021',
        sector: '05 (Western Pass)',
        distanceKm: 4.8,
        similarity: '89%',
        burnedAreaHa: 265,
        ignitionType: 'High Wind Utility Spark',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.582, 11.691],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'HIST-2019-02',
        date: '24 Feb 2019',
        sector: '07 (South Saddle)',
        distanceKm: 2.1,
        similarity: '82%',
        burnedAreaHa: 380,
        ignitionType: 'Severe VPD Foliar Desiccation Ignition',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.626, 11.658],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'HIST-2023-04',
        date: '05 Apr 2023',
        sector: '04 (Foothill Brush)',
        distanceKm: 5.4,
        similarity: '64%',
        burnedAreaHa: 98,
        ignitionType: 'Roadside Debris Conduction',
      },
      geometry: {
        type: 'Point',
        coordinates: [76.685, 11.678],
      },
    },
  ],
};

// 11. SAR Observation Layer (Copernicus Sentinel-1 C-SAR pass footprint & dielectric anomaly)
export const SAR_OBSERVATION_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Sentinel-1 radar ground swath footprint
    {
      type: 'Feature',
      properties: {
        satellite: 'Sentinel-1B C-SAR',
        orbitPass: 'Pass 148 Ascending',
        timestampUtc: '06:42 UTC',
        polarization: 'VV + VH Cross-Pol',
        type: 'SWATH_BOUNDARY',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.540, 11.750],
            [76.730, 11.750],
            [76.710, 11.580],
            [76.520, 11.580],
            [76.540, 11.750],
          ],
        ],
      },
    },
    // Backscatter moisture collapse anomaly polygon (Restrained cyan/teal #1F7A8C)
    {
      type: 'Feature',
      properties: {
        anomaly: '+18.7% Dielectric Desiccation',
        deltaDb: '-2.41 dB Delta',
        confidence: '88% Confidence',
        label: 'SAR ANOMALY\n+18.7% DESICCATION',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.580, 11.685],
            [76.645, 11.675],
            [76.655, 11.650],
            [76.610, 11.652],
            [76.575, 11.670],
            [76.580, 11.685],
          ],
        ],
      },
    },
  ],
};

// 12. Spatial Wind Vectors (Directional wind field: 24 km/h NW → SE across Bandipur)
export const WIND_VECTORS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Grid of directional wind vector lines and flow arrows (NW -> SE, 135° Azimuth)
    // Sector 05 - Western Escarpment Pass (Channeling 32 km/h)
    {
      type: 'Feature',
      properties: { id: 'WIND-01', speedKmh: 32, direction: 'NW → SE', angle: 132, ridgeChanneling: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.560, 11.695],
          [76.576, 11.682],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-02', speedKmh: 30, direction: 'NW → SE', angle: 132, ridgeChanneling: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.580, 11.710],
          [76.596, 11.697],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-03', speedKmh: 28, direction: 'NW → SE', angle: 135, ridgeChanneling: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.595, 11.680],
          [76.611, 11.667],
        ],
      },
    },

    // Sector 07 - South Ridge Crest (Focal High-Risk Corridor, 24 km/h)
    {
      type: 'Feature',
      properties: { id: 'WIND-04', speedKmh: 24, direction: 'NW → SE', angle: 135, corridorFocal: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.610, 11.665],
          [76.626, 11.652],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-05', speedKmh: 26, direction: 'NW → SE', angle: 135, corridorFocal: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.625, 11.675],
          [76.641, 11.662],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-06', speedKmh: 25, direction: 'NW → SE', angle: 138, corridorFocal: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.640, 11.685],
          [76.656, 11.671],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-07', speedKmh: 24, direction: 'NW → SE', angle: 135, corridorFocal: true },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.645, 11.655],
          [76.661, 11.642],
        ],
      },
    },

    // Sector 03 - Northern Plateau Border (26 km/h)
    {
      type: 'Feature',
      properties: { id: 'WIND-08', speedKmh: 26, direction: 'NW → SE', angle: 130 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.630, 11.725],
          [76.646, 11.712],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-09', speedKmh: 27, direction: 'NW → SE', angle: 133 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.655, 11.740],
          [76.671, 11.726],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-10', speedKmh: 24, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.675, 11.720],
          [76.691, 11.707],
        ],
      },
    },

    // Central & Basin Sectors (16 - 20 km/h)
    {
      type: 'Feature',
      properties: { id: 'WIND-11', speedKmh: 18, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.570, 11.625],
          [76.584, 11.613],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-12', speedKmh: 20, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.595, 11.640],
          [76.610, 11.628],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-13', speedKmh: 22, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.670, 11.660],
          [76.685, 11.648],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-14', speedKmh: 24, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.690, 11.685],
          [76.705, 11.672],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'WIND-15', speedKmh: 21, direction: 'NW → SE', angle: 135 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.615, 11.610],
          [76.629, 11.598],
        ],
      },
    },
  ],
};

// 13. Pipeline Segment Midpoint Labels (for displaying segment IDs directly on map lines)
export const PIPELINE_LABEL_POINTS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        segmentId: 'P-16',
        name: 'P-16',
        color: '#526B45',
        riskLevel: 'LOW',
        exposure: 28,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.568, 11.608],
      },
    },
    {
      type: 'Feature',
      properties: {
        segmentId: 'P-17',
        name: 'P-17',
        color: '#E5A33A',
        riskLevel: 'MODERATE',
        exposure: 58,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.600, 11.633],
      },
    },
    {
      type: 'Feature',
      properties: {
        segmentId: 'P-18',
        name: 'P-18',
        color: '#C95D35',
        riskLevel: 'HIGH',
        exposure: 87,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.638, 11.664],
      },
    },
    {
      type: 'Feature',
      properties: {
        segmentId: 'P-19',
        name: 'P-19',
        color: '#96382E',
        riskLevel: 'CRITICAL',
        exposure: 92,
      },
      geometry: {
        type: 'Point',
        coordinates: [76.690, 11.686],
      },
    },
  ],
};
