import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, Popup, LngLatBoundsLike } from 'maplibre-gl';

if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
}
import {
  ForestSector,
  LayerVisibilityState,
  RiskLevel,
  TimeWarpStep,
  InfrastructureAsset,
} from '../../types/intelligence';
import { getSectorStatusColor } from '../../services/riskService';
import {
  FOREST_SECTORS_GEOJSON,
  RISK_HEATMAP_POINTS_GEOJSON,
  RISK_CONTOURS_GEOJSON,
  CRITICAL_RED_ZONES_GEOJSON,
  PIPELINE_SEGMENTS_GEOJSON,
  ISOLATION_VALVES_GEOJSON,
  CRITICAL_INFRASTRUCTURE_GEOJSON,
  ROADS_GEOJSON,
  SETTLEMENTS_GEOJSON,
  HISTORICAL_FIRES_GEOJSON,
  SAR_OBSERVATION_GEOJSON,
  WIND_VECTORS_GEOJSON,
  PIPELINE_LABEL_POINTS_GEOJSON,
  BANDIPUR_CENTER_COORDS,
  BANDIPUR_BOUNDS,
} from '../../data/geospatialData';
import {
  Trees,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  Radio,
  History,
  ShieldAlert,
  Flame,
  Wind,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  ExternalLink,
  MapPin,
  Check,
  ZoomIn,
  ZoomOut,
  Crosshair,
  AlertTriangle,
} from 'lucide-react';

export type BasemapMode = 'topo' | 'satellite' | 'muted';

export interface GeospatialTerrainMapProps {
  sectors: ForestSector[];
  selectedSector: ForestSector;
  onSelectSector: (sector: ForestSector) => void;
  layers?: LayerVisibilityState;
  onToggleLayer?: (key: keyof LayerVisibilityState) => void;
  sarActive: boolean;
  timeWarpStep?: TimeWarpStep;
  pitch?: number;
  bearing?: number;
  zoom?: number;
  infrastructureAssets?: InfrastructureAsset[];
  onOpenTimeWarp?: () => void;
  onNavigateToPipeline?: () => void;
  onNavigateToSectorDeepDive?: () => void;
  compactSectorPanel?: boolean;
}

export const GeospatialTerrainMap: React.FC<GeospatialTerrainMapProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  layers: externalLayers,
  onToggleLayer: externalOnToggleLayer,
  sarActive,
  timeWarpStep,
  pitch: initialPitch = 36,
  bearing: initialBearing = 20,
  zoom: initialZoom = 12.0,
  infrastructureAssets = [],
  onOpenTimeWarp,
  onNavigateToPipeline,
  onNavigateToSectorDeepDive,
  compactSectorPanel = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const isMapLoadedRef = useRef<boolean>(false);

  // Basemap style & mode
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('topo');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLayerControlOpen, setIsLayerControlOpen] = useState<boolean>(false);
  const [showSectorCard, setShowSectorCard] = useState<boolean>(!compactSectorPanel);

  // Interactive selection state
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>('P-18');
  const [selectedValveId, setSelectedValveId] = useState<string | null>(null);
  const [selectedHistoricalFire, setSelectedHistoricalFire] = useState<any | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<any | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<{ type: string; title: string; subtitle?: string } | null>(null);

  // Local layer visibility toggles matching Requirement 3:
  // Forest, Fuel Volatility, Risk Zones, Wind, SAR Anomaly, Historical Fires, Pipelines, Isolation Valves, Roads, Settlements, Critical Infrastructure
  const [localLayers, setLocalLayers] = useState({
    forest: externalLayers?.forest ?? true,
    fuelVolatility: externalLayers?.fuelVolatility ?? true,
    riskZones: externalLayers?.riskZones ?? true,
    wind: externalLayers?.wind ?? false,
    sarAnomaly: externalLayers?.sarAnomaly ?? sarActive,
    historicalFires: externalLayers?.historicalFires ?? false,
    pipelines: externalLayers?.pipelines ?? true,
    isolationValves: externalLayers?.isolationValves ?? true,
    roads: externalLayers?.roads ?? false,
    settlements: externalLayers?.settlements ?? false,
    criticalInfrastructure: externalLayers?.criticalInfrastructure ?? false,
  });

  // State for Highlight Risky Area
  const [isHighlightRiskyActive, setIsHighlightRiskyActive] = useState<boolean>(false);

  // Keep external layer toggles and SAR active prop in sync
  useEffect(() => {
    if (externalLayers) {
      setLocalLayers((prev) => ({
        ...prev,
        forest: externalLayers.forest ?? prev.forest,
        fuelVolatility: externalLayers.fuelVolatility ?? prev.fuelVolatility,
        riskZones: externalLayers.riskZones ?? prev.riskZones,
        wind: externalLayers.wind ?? prev.wind,
        sarAnomaly: externalLayers.sarAnomaly ?? (sarActive || prev.sarAnomaly),
        historicalFires: externalLayers.historicalFires ?? prev.historicalFires,
        pipelines: externalLayers.pipelines ?? prev.pipelines,
        isolationValves: externalLayers.isolationValves ?? prev.isolationValves,
        roads: externalLayers.roads ?? prev.roads,
        settlements: externalLayers.settlements ?? prev.settlements,
        criticalInfrastructure: externalLayers.criticalInfrastructure ?? prev.criticalInfrastructure,
      }));
    } else {
      setLocalLayers((prev) => ({ ...prev, sarAnomaly: sarActive }));
    }
  }, [externalLayers, sarActive]);

  // Construct map style spec for MapLibre
  const getMapStyle = (mode: BasemapMode): maplibregl.StyleSpecification => {
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; Esri, HERE, Garmin, USGS';

    if (mode === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri, Maxar, Earthstar Geographics';
    } else if (mode === 'muted') {
      tileUrl = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap contributors &copy; CARTO';
    }

    return {
      version: 8,
      sources: {
        'base-tiles': {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution,
        },
      },
      layers: [
        {
          id: 'base-tiles-layer',
          type: 'raster',
          source: 'base-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  };

  // Add / Re-add PYRO Geospatial Layers
  const addPyroGeospatialLayers = useCallback((map: MapLibreMap) => {
    if (!map) return;

    // 1. Forest Sectors GeoJSON
    if (!map.getSource('forest-sectors')) {
      map.addSource('forest-sectors', {
        type: 'geojson',
        data: FOREST_SECTORS_GEOJSON,
      });

      // Forest Soft Fill with Botanical + Amber Risk Transition Palette
      map.addLayer({
        id: 'forest-sectors-fill',
        type: 'fill',
        source: 'forest-sectors',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'fuelVolatility'],
            20, 'rgba(82, 107, 69, 0.40)', // LOW #526B45 Green
            42, 'rgba(82, 107, 69, 0.50)', // LOW #526B45 Green
            52, 'rgba(135, 148, 108, 0.58)', // NORMAL / SAGE #87946C
            67, 'rgba(229, 163, 58, 0.68)', // ELEVATED #E5A33A Amber
            79, 'rgba(201, 93, 53, 0.78)', // HIGH #C95D35 Burnt Orange
            91, 'rgba(150, 56, 46, 0.88)', // CRITICAL #96382E Deep Red
          ],
          'fill-opacity': 0.85,
        },
      });

      // Forest Boundary
      map.addLayer({
        id: 'forest-sectors-border',
        type: 'line',
        source: 'forest-sectors',
        paint: {
          'line-color': '#263D2C',
          'line-width': 1.6,
          'line-opacity': 0.75,
        },
      });

      // Selected Sector Highlight Ring
      map.addLayer({
        id: 'forest-sectors-highlight',
        type: 'line',
        source: 'forest-sectors',
        paint: {
          'line-color': '#E58A3A',
          'line-width': 3.5,
          'line-opacity': 0.95,
        },
        filter: ['==', ['get', 'id'], selectedSector?.id || 'SEC-07'],
      });
    }

    // 2. Continuous Wildfire Risk Heatmap Layer
    if (!map.getSource('risk-heatmap-points')) {
      map.addSource('risk-heatmap-points', {
        type: 'geojson',
        data: RISK_HEATMAP_POINTS_GEOJSON,
      });

      map.addLayer({
        id: 'risk-heatmap-layer',
        type: 'heatmap',
        source: 'risk-heatmap-points',
        paint: {
          'heatmap-weight': ['get', 'riskWeight'],
          'heatmap-intensity': 1.35,
          'heatmap-radius': 42,
          'heatmap-opacity': 0.65,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0.0,
            'rgba(82, 107, 69, 0.0)',
            0.15,
            'rgba(82, 107, 69, 0.25)', // LOW: Deep Forest Green #526B45
            0.35,
            'rgba(135, 148, 108, 0.40)', // NORMAL: Sage Green #87946C
            0.55,
            'rgba(229, 163, 58, 0.55)', // ELEVATED: Amber #E5A33A
            0.75,
            'rgba(201, 93, 53, 0.70)', // HIGH: Burnt Orange #C95D35
            1.0,
            'rgba(150, 56, 46, 0.85)', // CRITICAL: Deep Red #96382E
          ],
        },
      });
    }

    // 3. Subtle Risk Contours
    if (!map.getSource('risk-contours')) {
      map.addSource('risk-contours', {
        type: 'geojson',
        data: RISK_CONTOURS_GEOJSON,
      });

      map.addLayer({
        id: 'risk-contours-layer',
        type: 'line',
        source: 'risk-contours',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'strokeWidth'],
          'line-opacity': 0.75,
          'line-dasharray': [3, 1.5],
        },
      });
    }

    // 4. Critical Red Zones (Dynamically colored based on Time Warp risk!)
    if (!map.getSource('critical-red-zones')) {
      map.addSource('critical-red-zones', {
        type: 'geojson',
        data: CRITICAL_RED_ZONES_GEOJSON,
      });

      map.addLayer({
        id: 'critical-red-zones-fill',
        type: 'fill',
        source: 'critical-red-zones',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'fuelRisk'],
            20, 'rgba(82, 107, 69, 0.25)',
            42, 'rgba(82, 107, 69, 0.40)', // GREEN at T-48H
            52, 'rgba(135, 148, 108, 0.50)', // SAGE at T-36H
            67, 'rgba(229, 163, 58, 0.65)', // AMBER at T-24H
            79, 'rgba(201, 93, 53, 0.78)', // ORANGE at T-12H
            91, 'rgba(150, 56, 46, 0.90)', // DEEP RED at NOW
          ],
          'fill-outline-color': ['get', 'color'],
        },
      });

      map.addLayer({
        id: 'critical-red-zones-outline',
        type: 'line',
        source: 'critical-red-zones',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.4,
          'line-opacity': 0.9,
        },
      });
    }

    // 5. Spatial Wind Vectors (Directional wind field: 24 km/h NW → SE)
    if (!map.getSource('wind-vectors')) {
      map.addSource('wind-vectors', {
        type: 'geojson',
        data: WIND_VECTORS_GEOJSON,
      });

      // Wind Vector Flow Lines
      map.addLayer({
        id: 'wind-vectors-halo',
        type: 'line',
        source: 'wind-vectors',
        paint: {
          'line-color': '#87946C',
          'line-width': 4.5,
          'line-opacity': 0.4,
          'line-blur': 1.0,
        },
      });

      map.addLayer({
        id: 'wind-vectors-line',
        type: 'line',
        source: 'wind-vectors',
        paint: {
          'line-color': '#263D2C',
          'line-width': 2.2,
          'line-opacity': 0.85,
          'line-dasharray': [6, 4],
        },
      });
    }

    // 6. SAR Observation Layer
    if (!map.getSource('sar-observations')) {
      map.addSource('sar-observations', {
        type: 'geojson',
        data: SAR_OBSERVATION_GEOJSON,
      });

      map.addLayer({
        id: 'sar-observation-fill',
        type: 'fill',
        source: 'sar-observations',
        paint: {
          'fill-color': 'rgba(31, 122, 140, 0.22)',
          'fill-outline-color': '#1F7A8C',
        },
      });

      map.addLayer({
        id: 'sar-observation-line',
        type: 'line',
        source: 'sar-observations',
        paint: {
          'line-color': '#1F7A8C',
          'line-width': 1.8,
          'line-dasharray': [4, 2],
        },
      });
    }

    // 7. Roads Layer
    if (!map.getSource('roads')) {
      map.addSource('roads', {
        type: 'geojson',
        data: ROADS_GEOJSON,
      });

      map.addLayer({
        id: 'roads-casing',
        type: 'line',
        source: 'roads',
        paint: {
          'line-color': '#EDE7D8',
          'line-width': ['+', ['get', 'width'], 1.5],
          'line-opacity': 0.6,
        },
      });

      map.addLayer({
        id: 'roads-line',
        type: 'line',
        source: 'roads',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': 0.85,
        },
      });
    }

    // 8. Pipeline Infrastructure Corridors & Operational Segments
    if (!map.getSource('pipeline-segments')) {
      map.addSource('pipeline-segments', {
        type: 'geojson',
        data: PIPELINE_SEGMENTS_GEOJSON,
      });

      // Pipeline Halo / Casing
      map.addLayer({
        id: 'pipeline-halo',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 7.5,
          'line-opacity': 0.95,
        },
      });

      // Pipeline Main Line (colored dynamically by risk exposure)
      map.addLayer({
        id: 'pipeline-line',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4.5,
          'line-opacity': 0.95,
        },
      });

      // Active Segment Highlight Pulse
      map.addLayer({
        id: 'pipeline-highlight',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': '#C95D35',
          'line-width': 9.0,
          'line-opacity': 0.7,
          'line-blur': 2.0,
        },
        filter: ['==', ['get', 'segmentId'], selectedSegmentId || 'P-18'],
      });
    }

    // Setup interactive pointer & clicks
    setupLayerInteractions(map);
  }, [selectedSector, selectedSegmentId]);

  // Setup cursor and click interactions on vector layers
  const setupLayerInteractions = (map: MapLibreMap) => {
    // Sector clicks
    map.on('click', 'forest-sectors-fill', (e) => {
      if (e.features && e.features[0]) {
        const feat = e.features[0];
        const secId = feat.properties?.id;
        const matched = sectors.find((s) => s.id === secId);
        if (matched) {
          onSelectSector(matched);
          map.flyTo({
            center: [matched.longitude, matched.latitude],
            zoom: 12.8,
            pitch: is3D ? 48 : 0,
            duration: 900,
          });
        }
      }
    });

    map.on('mouseenter', 'forest-sectors-fill', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features && e.features[0]) {
        const p = e.features[0].properties;
        setHoveredFeature({
          type: 'FOREST SECTOR',
          title: p?.name || 'Sector',
          subtitle: `Risk: ${p?.riskLevel} · Volatility: ${p?.fuelVolatility}`,
        });
      }
    });

    map.on('mouseleave', 'forest-sectors-fill', () => {
      map.getCanvas().style.cursor = '';
      setHoveredFeature(null);
    });

    // Pipeline segment clicks
    map.on('click', 'pipeline-line', (e) => {
      if (e.features && e.features[0]) {
        const feat = e.features[0];
        const segId = feat.properties?.segmentId;
        if (segId) {
          setSelectedSegmentId(segId);
          // Highlight isolation boundary
          if (feat.properties?.upstreamValveId) {
            setSelectedValveId(feat.properties.upstreamValveId);
          }
          // Clicking P-18 opens Pipeline Intelligence (Requirement 11)
          if (segId === 'P-18' && onNavigateToPipeline) {
            onNavigateToPipeline();
          }
        }
      }
    });

    map.on('mouseenter', 'pipeline-line', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features && e.features[0]) {
        const p = e.features[0].properties;
        setHoveredFeature({
          type: 'PIPELINE SEGMENT',
          title: p?.name || 'Segment',
          subtitle: `Exposure: ${p?.assetExposure} · Boundary: ${p?.isolationBoundary}`,
        });
      }
    });

    map.on('mouseleave', 'pipeline-line', () => {
      map.getCanvas().style.cursor = '';
      setHoveredFeature(null);
    });
  };

  // Render HTML / DOM Markers (Isolation Valves, Pipelines, Wind Vectors, Infrastructure, Settlements, Historical Fires, Critical Badges)
  const renderDomMarkers = useCallback((map: MapLibreMap) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Isolation Valves (V16, V17, V18, V19)
    if (localLayers.isolationValves) {
      ISOLATION_VALVES_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const isUpstreamOrDownstreamForSelected =
          (selectedSegmentId === 'P-18' && (p.id === 'V17' || p.id === 'V18')) ||
          p.id === selectedValveId;

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none relative';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${
              isUpstreamOrDownstreamForSelected
                ? '<div class="absolute -inset-2 rounded-full bg-[#C95D35]/30 animate-ping"></div>'
                : ''
            }
            <div class="h-6 px-1.5 rounded-full flex items-center gap-1 border shadow-md font-mono text-[10px] font-bold transition-transform group-hover:scale-110 ${
              isUpstreamOrDownstreamForSelected
                ? 'bg-[#C95D35] text-white border-white ring-2 ring-[#C95D35]'
                : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9]'
            }">
              <span class="w-2 h-2 rounded-full ${isUpstreamOrDownstreamForSelected ? 'bg-white' : 'bg-[#C95D35]'}"></span>
              <span>${p.id}</span>
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedValveId(p.id);
          setSelectedInfrastructure(null);
          setSelectedHistoricalFire(null);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. Pipeline Segment Midpoint Badges (P-16, P-17, P-18, P-19)
    if (localLayers.pipelines) {
      PIPELINE_LABEL_POINTS_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const isSelected = p.segmentId === selectedSegmentId;

        // Dynamically compute color and exposure if Time Warp is active
        let badgeColor = p.color;
        let badgeExposure = p.exposure;
        let badgeLevel = p.riskLevel;

        if (p.segmentId === 'P-18' && timeWarpStep) {
          const secRisk = timeWarpStep.sectorRisks['SEC-07'];
          const vol = secRisk ? secRisk.risk : timeWarpStep.fuelVolatility;
          badgeLevel = secRisk ? secRisk.level : timeWarpStep.riskLevel;
          badgeExposure = vol <= 45 ? 42 : vol <= 55 ? 51 : vol <= 70 ? 67 : vol <= 85 ? 79 : 87;
          badgeColor =
            badgeLevel === 'CRITICAL'
              ? '#96382E'
              : badgeLevel === 'HIGH'
              ? '#C95D35'
              : badgeLevel === 'ELEVATED'
              ? '#E5A33A'
              : badgeLevel === 'MODERATE'
              ? '#87946C'
              : '#526B45';
        }

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="px-2 py-0.5 rounded-md shadow-md border font-mono text-[10px] font-bold flex items-center gap-1.5 transition-transform group-hover:scale-115 ${
            isSelected
              ? 'bg-[#263D2C] text-[#F1EBDD] border-white ring-2 ring-[#C95D35]'
              : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9]'
          }">
            <span class="w-2 h-2 rounded-full" style="background-color: ${badgeColor};"></span>
            <span>${p.segmentId}</span>
            <span class="text-[9px] opacity-80 font-normal">[${badgeExposure}]</span>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedSegmentId(p.segmentId);
          if (p.segmentId === 'P-18' && onNavigateToPipeline) {
            onNavigateToPipeline();
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Directional Wind Vectors & Flow Arrows (Requirement 4 & 5)
    if (localLayers.wind) {
      WIND_VECTORS_GEOJSON.features.forEach((feat) => {
        // Place arrow marker at vector start or midpoint
        const coords = feat.geometry.coordinates;
        const [lng, lat] = coords[0];
        const p = feat.properties;

        const el = document.createElement('div');
        el.className = 'pointer-events-none select-none flex items-center gap-1';
        el.innerHTML = `
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F7F4EC]/90 border border-[#87946C]/50 shadow-xs font-mono text-[9px] text-[#263D2C] backdrop-blur-xs">
            <span style="display:inline-block; transform: rotate(${p.angle - 90}deg); font-weight: bold; color: #3F5D43; font-size: 11px;">➔</span>
            <span class="font-bold text-[#263D2C]">${p.speedKmh}k</span>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 4. Critical Infrastructure Markers (Compressor, Substation, Tower)
    if (localLayers.criticalInfrastructure) {
      CRITICAL_INFRASTRUCTURE_GEOJSON.features.forEach((feat) => {
        if (feat.geometry.type !== 'Point') return;
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="h-6 w-6 rounded-md bg-[#263D2C] text-[#F1EBDD] border border-[#D3D7C9] flex items-center justify-center shadow-md text-[10px] transition-transform group-hover:scale-115" title="${p.name}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedInfrastructure(p);
          setSelectedValveId(null);
          setSelectedHistoricalFire(null);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 5. Settlements (Gundlupet, Masinagudi, etc.)
    if (localLayers.settlements) {
      SETTLEMENTS_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;

        const el = document.createElement('div');
        el.className = 'group pointer-events-auto select-none';
        el.innerHTML = `
          <div class="px-2 py-0.5 rounded bg-[#F7F4EC]/90 backdrop-blur-xs border border-[#D3D7C9] text-[#1E2A21] font-mono text-[9px] font-semibold flex items-center gap-1 shadow-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-[#526B45]"></span>
            <span>${p.name.split(' ')[0]}</span>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 6. Historical Fires Markers
    if (localLayers.historicalFires) {
      HISTORICAL_FIRES_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="h-5 w-5 rounded-full bg-[#E58A3A] text-white border border-white flex items-center justify-center shadow-md text-[9px] font-bold transition-transform group-hover:scale-125" title="Historical Fire: ${p.date}">
            🔥
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedHistoricalFire(p);
          setSelectedValveId(null);
          setSelectedInfrastructure(null);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 7. Dynamic Risk Zone Pulse Badge (Synchronized with Time Warp state!)
    if (localLayers.riskZones) {
      const activeVol = timeWarpStep
        ? timeWarpStep.sectorRisks['SEC-07']?.risk ?? timeWarpStep.fuelVolatility
        : 91;
      const activeLvl = timeWarpStep
        ? timeWarpStep.sectorRisks['SEC-07']?.level ?? timeWarpStep.riskLevel
        : 'CRITICAL';

      const badgeColor =
        activeLvl === 'CRITICAL'
          ? '#96382E'
          : activeLvl === 'HIGH'
          ? '#C95D35'
          : activeLvl === 'ELEVATED'
          ? '#E5A33A'
          : activeLvl === 'MODERATE'
          ? '#87946C'
          : '#526B45';

      const isCriticalOrHigh = activeLvl === 'CRITICAL' || activeLvl === 'HIGH';

      const el = document.createElement('div');
      el.className = 'pointer-events-none select-none flex flex-col items-center';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="w-4 h-4 rounded-full ${isCriticalOrHigh ? 'critical-pulse-badge' : ''}" style="background-color: ${badgeColor};"></div>
          <div class="w-2 h-2 rounded-full bg-white absolute"></div>
        </div>
        <div class="mt-1 px-2 py-0.5 rounded text-white font-mono text-[9px] font-bold tracking-tight shadow-md border border-white/50 text-center uppercase whitespace-nowrap" style="background-color: ${badgeColor};">
          ${activeLvl} ZONE · RISK ${activeVol}
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([76.632, 11.662])
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [localLayers, selectedSegmentId, selectedValveId, timeWarpStep, onNavigateToPipeline]);

  // Re-sync layer visibilities when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    const setVisibility = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setVisibility('forest-sectors-fill', localLayers.forest);
    setVisibility('forest-sectors-border', localLayers.forest);
    setVisibility('forest-sectors-highlight', localLayers.forest);
    setVisibility('risk-heatmap-layer', localLayers.fuelVolatility);
    setVisibility('risk-contours-layer', localLayers.riskZones);
    setVisibility('critical-red-zones-fill', localLayers.riskZones);
    setVisibility('critical-red-zones-outline', localLayers.riskZones);
    setVisibility('wind-vectors-halo', localLayers.wind);
    setVisibility('wind-vectors-line', localLayers.wind);
    setVisibility('pipeline-halo', localLayers.pipelines);
    setVisibility('pipeline-line', localLayers.pipelines);
    setVisibility('pipeline-highlight', localLayers.pipelines);
    setVisibility('sar-observation-fill', localLayers.sarAnomaly);
    setVisibility('sar-observation-line', localLayers.sarAnomaly);
    setVisibility('roads-casing', localLayers.roads);
    setVisibility('roads-line', localLayers.roads);

    renderDomMarkers(map);
  }, [localLayers, renderDomMarkers]);

  // Update highlight filters when selectedSector, selectedSegmentId, or isHighlightRiskyActive changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    if (map.getLayer('forest-sectors-highlight')) {
      if (isHighlightRiskyActive) {
        // Highlight all elevated, high, and critical sectors prominently
        map.setFilter('forest-sectors-highlight', ['match', ['get', 'id'], ['SEC-07', 'SEC-05', 'SEC-03'], true, false] as any);
        map.setPaintProperty('forest-sectors-highlight', 'line-color', '#96382E');
        map.setPaintProperty('forest-sectors-highlight', 'line-width', 4.5);
      } else {
        map.setFilter('forest-sectors-highlight', ['==', ['get', 'id'], selectedSector.id]);
        map.setPaintProperty('forest-sectors-highlight', 'line-color', '#E58A3A');
        map.setPaintProperty('forest-sectors-highlight', 'line-width', 3.5);
      }
    }

    if (map.getLayer('pipeline-highlight')) {
      map.setFilter('pipeline-highlight', ['==', ['get', 'segmentId'], selectedSegmentId || 'P-18']);
    }
  }, [selectedSector, selectedSegmentId, isHighlightRiskyActive]);

  // Dynamically update forest sectors, critical zones, and pipelines when timeWarpStep changes
  // Guarantees visual map transitions smoothly: Green (T-48H) -> Sage (T-36H) -> Amber (T-24H) -> Orange (T-12H) -> Red (NOW)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    // 1. Update forest sectors
    const updatedForestSectors = {
      ...FOREST_SECTORS_GEOJSON,
      features: FOREST_SECTORS_GEOJSON.features.map((feat) => {
        const stepRisk = timeWarpStep
          ? timeWarpStep.sectorRisks[feat.properties.id]
          : null;
        if (stepRisk) {
          const color =
            stepRisk.level === 'CRITICAL'
              ? '#96382E'
              : stepRisk.level === 'HIGH'
              ? '#C95D35'
              : stepRisk.level === 'ELEVATED'
              ? '#E5A33A'
              : stepRisk.level === 'MODERATE'
              ? '#87946C'
              : '#526B45';
          return {
            ...feat,
            properties: {
              ...feat.properties,
              riskLevel: stepRisk.level,
              fuelVolatility: stepRisk.risk,
              color,
            },
          };
        }
        return feat;
      }),
    };

    const sourceForest = map.getSource('forest-sectors') as maplibregl.GeoJSONSource;
    if (sourceForest) {
      sourceForest.setData(updatedForestSectors as any);
    }

    // 2. Update critical-red-zones (Never remain red when Time Warp is LOW!)
    const updatedCriticalZones = {
      ...CRITICAL_RED_ZONES_GEOJSON,
      features: CRITICAL_RED_ZONES_GEOJSON.features.map((feat) => {
        const secId = feat.properties.sectorId;
        const stepRisk = timeWarpStep?.sectorRisks[secId];
        const vol = stepRisk ? stepRisk.risk : feat.properties.fuelRisk;
        const lvl = stepRisk ? stepRisk.level : 'CRITICAL';
        const color =
          lvl === 'CRITICAL'
            ? '#96382E'
            : lvl === 'HIGH'
            ? '#C95D35'
            : lvl === 'ELEVATED'
            ? '#E5A33A'
            : lvl === 'MODERATE'
            ? '#87946C'
            : '#526B45';
        return {
          ...feat,
          properties: {
            ...feat.properties,
            fuelRisk: vol,
            riskLevel: lvl,
            color,
          },
        };
      }),
    };

    const sourceCrit = map.getSource('critical-red-zones') as maplibregl.GeoJSONSource;
    if (sourceCrit) {
      sourceCrit.setData(updatedCriticalZones as any);
    }

    // 3. Update pipeline segments during Time Warp (P-18 dynamically follows Time Warp progression!)
    const updatedPipelines = {
      ...PIPELINE_SEGMENTS_GEOJSON,
      features: PIPELINE_SEGMENTS_GEOJSON.features.map((feat) => {
        if (feat.properties.segmentId === 'P-18' && timeWarpStep) {
          const secRisk = timeWarpStep.sectorRisks['SEC-07'];
          const vol = secRisk ? secRisk.risk : timeWarpStep.fuelVolatility;
          const lvl = secRisk ? secRisk.level : timeWarpStep.riskLevel;
          // Synchronized Exposure progression:
          // T-48H: 42 (LOW) -> Green
          // T-36H: 51 (MODERATE) -> Sage
          // T-24H: 67 (ELEVATED) -> Amber
          // T-12H: 79 (HIGH) -> Orange
          // NOW / EVENT: 87/91 (CRITICAL) -> Red
          const exposure =
            vol <= 45 ? 42 : vol <= 55 ? 51 : vol <= 70 ? 67 : vol <= 85 ? 79 : 87;
          const color =
            lvl === 'CRITICAL'
              ? '#96382E'
              : lvl === 'HIGH'
              ? '#C95D35'
              : lvl === 'ELEVATED'
              ? '#E5A33A'
              : lvl === 'MODERATE'
              ? '#87946C'
              : '#526B45';
          return {
            ...feat,
            properties: {
              ...feat.properties,
              riskLevel: lvl,
              fuelVolatility: vol,
              assetExposure: exposure,
              color,
            },
          };
        }
        return feat;
      }),
    };

    const sourcePipelines = map.getSource('pipeline-segments') as maplibregl.GeoJSONSource;
    if (sourcePipelines) {
      sourcePipelines.setData(updatedPipelines as any);
    }

    // 4. Update risk-heatmap intensity & opacity (ensures green baseline at T-48H)
    if (map.getLayer('risk-heatmap-layer')) {
      const vol = timeWarpStep ? timeWarpStep.fuelVolatility : selectedSector.fuelVolatility;
      const intensity = timeWarpStep
        ? Math.max(0.08, ((vol - 35) / 56) * 1.4)
        : Math.max(0.35, (vol / 91) * 1.4);
      const opacity = timeWarpStep ? Math.max(0.12, (vol / 91) * 0.75) : 0.65;
      map.setPaintProperty('risk-heatmap-layer', 'heatmap-intensity', intensity);
      map.setPaintProperty('risk-heatmap-layer', 'heatmap-opacity', opacity);
    }

    if (map.getLayer('risk-contours-layer')) {
      const vol = timeWarpStep ? timeWarpStep.fuelVolatility : selectedSector.fuelVolatility;
      const contourOpacity = timeWarpStep ? (vol <= 45 ? 0.2 : vol <= 60 ? 0.45 : 0.8) : 0.75;
      map.setPaintProperty('risk-contours-layer', 'line-opacity', contourOpacity);
    }

    // 5. Re-render DOM markers so badges reflect current step's risk and color
    renderDomMarkers(map);
  }, [timeWarpStep, renderDomMarkers, selectedSector]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLng = selectedSector?.longitude || BANDIPUR_CENTER_COORDS[0];
    const initialLat = selectedSector?.latitude || BANDIPUR_CENTER_COORDS[1];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(basemapMode),
      center: [initialLng, initialLat],
      zoom: initialZoom,
      pitch: is3D ? initialPitch : 0,
      bearing: is3D ? initialBearing : 0,
      attributionControl: {
        compact: true,
      },
    });

    mapRef.current = map;

    map.on('load', () => {
      isMapLoadedRef.current = true;
      addPyroGeospatialLayers(map);
      renderDomMarkers(map);
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
      isMapLoadedRef.current = false;
    };
  }, []);

  // Update DOM markers when local layers or selected segments change
  useEffect(() => {
    if (mapRef.current && isMapLoadedRef.current) {
      renderDomMarkers(mapRef.current);
    }
  }, [renderDomMarkers]);

  // Handle Basemap Switch
  const handleBasemapChange = (newMode: BasemapMode) => {
    setBasemapMode(newMode);
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    map.setStyle(getMapStyle(newMode));
    map.once('style.load', () => {
      addPyroGeospatialLayers(map);
      renderDomMarkers(map);
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
    });
  };

  // Toggle 2D / 3D Mode
  const handleToggle3D = () => {
    const map = mapRef.current;
    if (!map) return;

    if (is3D) {
      setIs3D(false);
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else {
      setIs3D(true);
      map.easeTo({ pitch: 48, bearing: 22, duration: 800 });
    }
  };

  // Reset Camera View
  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: BANDIPUR_CENTER_COORDS,
      zoom: 12.0,
      pitch: is3D ? 40 : 0,
      bearing: is3D ? 18 : 0,
      duration: 1000,
    });
  };

  // Fit to Full Forest Region
  const handleFitRegion = () => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(BANDIPUR_BOUNDS as LngLatBoundsLike, {
      padding: 40,
      pitch: is3D ? 30 : 0,
      duration: 1100,
    });
  };

  // Zoom controls
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };
  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    const container = mapContainerRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Find currently active segment details
  const activeSegmentGeo = PIPELINE_SEGMENTS_GEOJSON.features.find(
    (f) => f.properties.segmentId === selectedSegmentId
  )?.properties;

  return (
    <div className="relative w-full h-full min-h-[460px] overflow-hidden bg-[#ECE5D6] select-none font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN MAPLIBRE GL JS CONTAINER
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full ${
          basemapMode === 'satellite' ? 'basemap-satellite' : 'basemap-subdued'
        }`}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. UNIFIED TOP CONTROL BAR (CLEAN, PROFESSIONAL & NON-OVERLAPPING)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Basin Title & Hover Telemetry */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#1E2A21] shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#526B45] animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold text-[#263D2C] tracking-wide">
              BANDIPUR FOREST TWIN
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#E2E7DA] text-[#526B45] rounded font-semibold">
              {is3D ? '3D TERRAIN' : '2D VIEW'}
            </span>
          </div>

          {hoveredFeature && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#263D2C]/90 text-[#F1EBDD] font-mono text-[10px] shadow-sm backdrop-blur-sm animate-in fade-in duration-150">
              <span className="text-[#E58A3A] font-bold">{hoveredFeature.type}:</span>
              <span className="font-semibold">{hoveredFeature.title}</span>
              {hoveredFeature.subtitle && (
                <span className="text-[#D3D7C9] text-[9px] border-l border-[#D3D7C9]/40 pl-1.5 ml-0.5">
                  {hoveredFeature.subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Basemap Selector + 3D Toggle + Layer Menu */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Basemap Switcher */}
          <div className="flex rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] p-0.5 shadow-md font-mono text-[10px]">
            <button
              onClick={() => handleBasemapChange('topo')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-bold ${
                basemapMode === 'topo'
                  ? 'bg-[#263D2C] text-[#F1EBDD]'
                  : 'text-[#526B45] hover:bg-[#E8EDE2]'
              }`}
            >
              TOPO
            </button>
            <button
              onClick={() => handleBasemapChange('satellite')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-bold ${
                basemapMode === 'satellite'
                  ? 'bg-[#263D2C] text-[#F1EBDD]'
                  : 'text-[#526B45] hover:bg-[#E8EDE2]'
              }`}
            >
              SAT
            </button>
            <button
              onClick={() => handleBasemapChange('muted')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-bold ${
                basemapMode === 'muted'
                  ? 'bg-[#263D2C] text-[#F1EBDD]'
                  : 'text-[#526B45] hover:bg-[#E8EDE2]'
              }`}
            >
              MUTED
            </button>
          </div>

          {/* 2D / 3D Pitch Mode */}
          <button
            onClick={handleToggle3D}
            className={`h-8 px-2.5 rounded-lg border font-mono text-[10px] font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              is3D
                ? 'bg-[#E58A3A] hover:bg-[#D47E32] text-white border-[#E58A3A]'
                : 'bg-[#F7F4EC] hover:bg-[#E8EDE2] text-[#263D2C] border-[#D3D7C9]'
            }`}
            title="Toggle 2D / 3D Terrain Mode"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{is3D ? '3D TERRAIN' : '2D FLAT'}</span>
          </button>

          {/* Highlight Risky Area Button (Requirement 12) */}
          <button
            onClick={() => {
              const nextState = !isHighlightRiskyActive;
              setIsHighlightRiskyActive(nextState);
              if (nextState) {
                // Determine highest-risk sector (Sector 07 or active Time Warp peak)
                const highRiskSector = sectors.find((s) => s.id === 'SEC-07') || sectors[0];
                onSelectSector(highRiskSector);
                mapRef.current?.flyTo({
                  center: [highRiskSector.longitude, highRiskSector.latitude],
                  zoom: 12.8,
                  pitch: is3D ? 45 : 0,
                  duration: 800,
                });
              }
            }}
            className={`h-8 px-2.5 rounded-lg border font-mono text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              isHighlightRiskyActive
                ? 'bg-[#96382E] text-white border-[#96382E] ring-2 ring-[#96382E]/40'
                : 'bg-[#F7F4EC] hover:bg-[#E8EDE2] text-[#263D2C] border-[#D3D7C9]'
            }`}
            title="Highlight Highest-Risk Forest Areas"
          >
            <Flame className={`w-3.5 h-3.5 ${isHighlightRiskyActive ? 'text-white animate-pulse' : 'text-[#C95D35]'}`} />
            <span>HIGHLIGHT RISKY AREA</span>
          </button>

          {/* Layer Selector Trigger Button */}
          <button
            onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
            className={`h-8 px-2.5 rounded-lg border font-mono text-[10px] font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              isLayerControlOpen
                ? 'bg-[#263D2C] text-[#F1EBDD] border-[#263D2C]'
                : 'bg-[#F7F4EC] hover:bg-[#E8EDE2] text-[#263D2C] border-[#D3D7C9]'
            }`}
            title="Toggle Geospatial Layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RIGHT-SIDE FLOATING CAMERA CONTROLS
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5">
        <div className="flex flex-col rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 text-[#263D2C] hover:bg-[#E8EDE2] transition-colors border-b border-[#D3D7C9] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-[#263D2C] hover:bg-[#E8EDE2] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleFitRegion}
          className="p-2 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2] shadow-md transition-colors cursor-pointer"
          title="Fit Region to View"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="p-2 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2] shadow-md transition-colors cursor-pointer"
          title="Reset Orientation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2] shadow-md transition-colors cursor-pointer"
          title="Fullscreen Mode"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. COMPACT FLOATING MAP LAYER SELECTOR PANEL (NON-OVERLAPPING)
          ───────────────────────────────────────────────────────────── */}
      {isLayerControlOpen && (
        <div className="absolute top-14 right-14 z-30 w-64 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs text-[#1E2A21] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <span className="font-bold text-[#263D2C] text-[11px] tracking-wider uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#526B45]" />
              MAP LAYERS
            </span>
            <button
              onClick={() => setIsLayerControlOpen(false)}
              className="text-[#69766A] hover:text-[#1E2A21] text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 mt-2 max-h-72 overflow-y-auto pr-1">
            {[
              { key: 'forest', label: 'Forest', desc: 'Protected canopy boundaries' },
              { key: 'fuelVolatility', label: 'Fuel Volatility', desc: 'Continuous spatial gradient' },
              { key: 'riskZones', label: 'Risk Zones', desc: 'Elevated & Critical boundaries' },
              { key: 'wind', label: 'Wind', desc: 'Spatial vectors & flow field' },
              { key: 'sarAnomaly', label: 'SAR Anomaly', desc: 'Sentinel-1 dielectric delta' },
              { key: 'historicalFires', label: 'Historical Fires', desc: 'Ignition history (2019-2024)' },
              { key: 'pipelines', label: 'Pipelines', desc: 'Operational energy corridors' },
              { key: 'isolationValves', label: 'Isolation Valves', desc: 'V16–V19 block gates' },
              { key: 'roads', label: 'Roads', desc: 'NH-766, patrol cuts' },
              { key: 'settlements', label: 'Settlements', desc: 'Villages & urban fringe' },
              { key: 'criticalInfrastructure', label: 'Critical Infrastructure', desc: 'Compressors, substations' },
            ].map(({ key, label, desc }) => {
              const isChecked = (localLayers as any)[key];
              return (
                <label
                  key={key}
                  className="flex items-start gap-2 p-1 rounded hover:bg-[#E8EDE2] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const nextVal = !(localLayers as any)[key];
                      setLocalLayers((prev) => ({
                        ...prev,
                        [key]: nextVal,
                      }));
                      if (externalOnToggleLayer) {
                        externalOnToggleLayer(key as any);
                      }
                    }}
                    className="mt-0.5 accent-[#526B45] cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-[#1E2A21] text-[11px] leading-tight">
                      {label}
                    </div>
                    <div className="text-[9px] text-[#69766A]">{desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Wind Telemetry Box (Requirement 4 & 5) */}
      {localLayers.wind && (
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-[#F7F4EC]/95 border border-[#87946C] shadow-lg font-mono text-xs text-[#1E2A21] max-w-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#D3D7C9]">
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-[#526B45]" />
              <span className="font-bold text-[#263D2C]">WIND FIELD OVERLAY</span>
            </div>
            <span className="text-[10px] text-[#526B45] font-bold">24 km/h</span>
          </div>
          <div className="mt-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#69766A]">Velocity:</span>
              <span className="font-bold text-[#263D2C]">24 km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Direction:</span>
              <span className="font-bold text-[#263D2C]">NW → SE (135°)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Ridge Channeling:</span>
              <span className="font-bold text-[#C95D35]">Active (Sector 07 Crest)</span>
            </div>
          </div>
        </div>
      )}

      {/* Highlight Risky Area Floating Banner (Requirement 12) */}
      {isHighlightRiskyActive && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-[#96382E] text-white shadow-xl font-mono text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
          <Flame className="w-4 h-4 text-white animate-pulse" />
          <span>
            <strong className="font-bold">CRITICAL RISK ZONE HIGHLIGHTED:</strong> Sector 07 South Ridge Crest · 91 Volatility
          </span>
          <button
            onClick={() => onNavigateToSectorDeepDive?.()}
            className="px-2.5 py-1 rounded bg-white text-[#96382E] font-bold text-[10px] hover:bg-[#F1EBDD] transition-colors cursor-pointer"
          >
            VIEW DEEP DIVE
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. UNIFIED LEFT INSPECTOR CARD (VALVE, HISTORICAL FIRE, INFRASTRUCTURE)
          Guarantees only ONE popup appears at a time on the left side, eliminating overlap!
          ───────────────────────────────────────────────────────────── */}
      {selectedValveId && (
        <div className="absolute top-14 left-3 z-30 w-72 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C95D35] animate-pulse"></span>
              <span className="font-bold text-[#263D2C]">VALVE {selectedValveId}</span>
            </div>
            <button
              onClick={() => setSelectedValveId(null)}
              className="text-[#69766A] hover:text-[#1E2A21] font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 mt-2.5 text-[11px]">
            <div>
              <div className="text-[9px] text-[#69766A] uppercase font-bold">Role & Pipeline</div>
              <div className="font-bold text-[#1E2A21]">
                {selectedValveId === 'V17'
                  ? 'Upstream Isolation Boundary'
                  : selectedValveId === 'V18'
                  ? 'Downstream Isolation Boundary'
                  : 'Mainline Block Valve'}
              </div>
              <div className="text-[10px] text-[#526B45]">Pipeline Corridor: P-18</div>
            </div>

            <div className="p-2 rounded bg-[#E8EDE2] border border-[#D3D7C9]">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#69766A]">Status:</span>
                <span className="font-bold text-[#526B45]">ARMED · OPERATIONAL</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-[#69766A]">Boundary Corridor:</span>
                <span className="font-bold text-[#C95D35]">V17 → P-18 → V18</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToPipeline?.()}
              className="w-full py-1.5 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-bold text-[10px] transition-colors cursor-pointer text-center"
            >
              ISOLATION PROTOCOL WORKFLOW
            </button>
          </div>
        </div>
      )}

      {selectedHistoricalFire && (
        <div className="absolute top-14 left-3 z-30 w-72 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="font-bold text-[#263D2C]">HISTORICAL FIRE EVENT</span>
            </div>
            <button
              onClick={() => setSelectedHistoricalFire(null)}
              className="text-[#69766A] hover:text-[#1E2A21] font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 mt-2.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#69766A]">Date:</span>
              <span className="font-bold text-[#1E2A21]">{selectedHistoricalFire.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Sector:</span>
              <span className="font-bold text-[#1E2A21]">{selectedHistoricalFire.sector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Distance from P-18:</span>
              <span className="font-bold text-[#C95D35]">
                {selectedHistoricalFire.distanceKm} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Similarity Score:</span>
              <span className="font-bold text-[#263D2C]">{selectedHistoricalFire.similarity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69766A]">Burned Area:</span>
              <span className="font-semibold text-[#1E2A21]">
                {selectedHistoricalFire.burnedAreaHa} ha
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedInfrastructure && (
        <div className="absolute top-14 left-3 z-30 w-72 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E58A3A]"></span>
              <span className="font-bold text-[#263D2C] truncate max-w-[190px]">
                {selectedInfrastructure.name}
              </span>
            </div>
            <button
              onClick={() => setSelectedInfrastructure(null)}
              className="text-[#69766A] hover:text-[#1E2A21] font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 mt-2.5 text-[11px]">
            <div className="text-[10px] text-[#69766A] leading-relaxed">
              {selectedInfrastructure.description}
            </div>
            <div className="p-2 rounded bg-[#E8EDE2] border border-[#D3D7C9] space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#69766A]">Asset Type:</span>
                <span className="font-bold text-[#263D2C]">{selectedInfrastructure.type}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#69766A]">Risk Level:</span>
                <span className="font-bold text-[#C95D35]">{selectedInfrastructure.riskLevel}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#69766A]">Distance to P-18:</span>
                <span className="font-bold text-[#96382E]">{selectedInfrastructure.distanceToP18}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. COLLAPSIBLE SELECTED RISK ZONE & SECTOR INFORMATION PANEL
          Includes Minimize / Expand toggle so users have full visibility of the map!
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 z-20 w-72 sm:w-80 bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] rounded-xl shadow-xl overflow-hidden font-mono text-xs transition-all duration-200">
        {/* Panel Header with Collapsible Toggle */}
        <div
          onClick={() => setShowSectorCard(!showSectorCard)}
          className="px-3.5 py-2 bg-[#E8EDE2] border-b border-[#D3D7C9] flex items-center justify-between cursor-pointer hover:bg-[#DEE4D6] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getSectorStatusColor(selectedSector.riskLevel).hex }}
            ></span>
            <span className="font-bold text-[#263D2C] tracking-wide text-[11px] uppercase">
              {selectedSector.code} · {selectedSector.riskLevel} RISK
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#526B45]">
            <span className="text-[10px] font-semibold hidden sm:inline">
              {selectedSector.lastObservationUtc}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSectorCard(!showSectorCard);
              }}
              className="p-0.5 rounded hover:bg-[#D3D7C9] text-[#263D2C] transition-colors"
              title={showSectorCard ? 'Collapse card' : 'Expand card'}
            >
              {showSectorCard ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Panel Body (Collapsible) */}
        {showSectorCard && (
          <div className="p-3.5 space-y-2.5 animate-in fade-in duration-150">
            <div>
              <h4 className="font-bold text-[#1E2A21] text-sm tracking-tight font-sans">
                {selectedSector.name}
              </h4>
              <div className="text-[10px] text-[#69766A]">{selectedSector.vegetationType}</div>
            </div>

            {/* Key Intelligence Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[9px] text-[#69766A] uppercase font-bold">Fuel Volatility</div>
                <div className="text-lg font-bold text-[#C95D35] tabular-nums mt-0.5">
                  {selectedSector.fuelVolatility}
                  <span className="text-[10px] text-[#69766A] ml-1">/100</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[9px] text-[#69766A] uppercase font-bold">SAR Anomaly</div>
                <div className="text-lg font-bold text-[#263D2C] tabular-nums mt-0.5">
                  {selectedSector.moistureAnomaly > 0 ? `+${selectedSector.moistureAnomaly}%` : `${selectedSector.moistureAnomaly}%`}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[9px] text-[#69766A] uppercase font-bold">VPD Dryness</div>
                <div className="text-sm font-bold text-[#1E2A21] tabular-nums mt-0.5">
                  {selectedSector.vpd} kPa
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[9px] text-[#69766A] uppercase font-bold">Wind Velocity</div>
                <div className="text-sm font-bold text-[#1E2A21] tabular-nums mt-0.5">
                  {selectedSector.windSpeed} km/h
                </div>
              </div>
            </div>

            {/* Historical Similarity & Pipeline Exposure */}
            <div className="pt-1 border-t border-[#D3D7C9] text-[10px] space-y-1">
              <div className="flex justify-between items-center text-[#526B45]">
                <span>Historical Pattern Match:</span>
                <span className="font-bold text-[#1E2A21]">
                  {Math.round(selectedSector.historicalSimilarity * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-[#526B45]">
                <span>Pipeline Exposure:</span>
                <span className="font-bold text-[#C95D35]">
                  {selectedSector.id === 'SEC-07' ? 'P-18 Corridor' : selectedSector.id === 'SEC-05' ? 'P-19 Corridor' : 'Standard'}
                </span>
              </div>
            </div>

            {/* Action CTAs: VIEW SECTOR & VIEW PIPELINE */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onNavigateToSectorDeepDive?.()}
                className="px-2.5 py-1.5 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-bold text-[10px] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>VIEW SECTOR</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigateToPipeline?.()}
                className="px-2.5 py-1.5 rounded-lg bg-[#C95D35] hover:bg-[#A84B29] text-white font-bold text-[10px] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>VIEW PIPELINE</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7. PERSISTENT MINI RISK LEGEND (BOTANICAL PALETTE)
          Positioned cleanly bottom-left with neat spacing
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 z-20 px-3 py-2 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] shadow-md font-mono text-[10px] text-[#1E2A21] hidden sm:block">
        <div className="text-[9px] uppercase tracking-wider text-[#526B45] font-bold mb-1">
          PYRO RISK ESCALATION
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#526B45]"></span>
            <span>LOW</span>
          </div>
          <span className="text-[#D3D7C9]">─</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#87946C]"></span>
            <span>NORM</span>
          </div>
          <span className="text-[#D3D7C9]">─</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5A33A]"></span>
            <span>ELEV</span>
          </div>
          <span className="text-[#D3D7C9]">─</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C95D35]"></span>
            <span>HIGH</span>
          </div>
          <span className="text-[#D3D7C9]">─</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#96382E]"></span>
            <span className="font-bold text-[#96382E]">CRIT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
