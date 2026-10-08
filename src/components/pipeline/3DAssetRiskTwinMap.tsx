import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, LngLatBoundsLike } from 'maplibre-gl';

if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
}
import {
  PipelineSegment,
  PipelineNetwork,
  IsolationValve,
  NearbyAsset,
  RiskLevel,
  ForestSector,
} from '../../types/intelligence';
import { getSectorStatusColor } from '../../services/riskService';
import {
  PIPELINE_SEGMENTS_GEOJSON,
  PIPELINE_LABEL_POINTS_GEOJSON,
  WIND_VECTORS_GEOJSON,
  ISOLATION_VALVES_GEOJSON,
  CRITICAL_INFRASTRUCTURE_GEOJSON,
  FOREST_SECTORS_GEOJSON,
  CRITICAL_RED_ZONES_GEOJSON,
  RISK_CONTOURS_GEOJSON,
  ROADS_GEOJSON,
  SETTLEMENTS_GEOJSON,
  BANDIPUR_CENTER_COORDS,
} from '../../data/geospatialData';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Crosshair,
  Shield,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Compass,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Flame,
  Wind,
} from 'lucide-react';

export type PipelineBasemapMode = 'topo' | 'satellite' | 'muted';

interface AssetRiskTwinMapProps {
  networks: PipelineNetwork[];
  selectedPipeline: PipelineNetwork;
  selectedSegment: PipelineSegment;
  onSelectSegment: (segment: PipelineSegment) => void;
  sectors: ForestSector[];
  replayPhase: 't48h' | 't24h' | 'now';
}

export const AssetRiskTwinMap: React.FC<AssetRiskTwinMapProps> = ({
  networks,
  selectedPipeline,
  selectedSegment,
  onSelectSegment,
  sectors,
  replayPhase,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const isMapLoadedRef = useRef<boolean>(false);

  const [basemapMode, setBasemapMode] = useState<PipelineBasemapMode>('topo');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [selectedNearbyAsset, setSelectedNearbyAsset] = useState<NearbyAsset | null>(null);
  const [selectedValveModal, setSelectedValveModal] = useState<any | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    pipelineNetwork: true,
    exposureCorridor: true,
    valves: true,
    nearbyAssets: true,
    riskHeatmap: true,
    forestPolygons: true,
    roads: true,
    wind: false,
  });

  // Construct map style spec for MapLibre
  const getMapStyle = (mode: PipelineBasemapMode): maplibregl.StyleSpecification => {
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

  // Add Pipeline & GIS layers to MapLibre
  const addPipelineLayers = useCallback((map: MapLibreMap) => {
    if (!map) return;

    // 1. Forest Sectors GeoJSON
    if (!map.getSource('forest-sectors')) {
      map.addSource('forest-sectors', {
        type: 'geojson',
        data: FOREST_SECTORS_GEOJSON,
      });

      map.addLayer({
        id: 'forest-fill',
        type: 'fill',
        source: 'forest-sectors',
        paint: {
          'fill-color': 'rgba(82, 107, 69, 0.16)',
          'fill-outline-color': '#263D2C',
        },
      });

      map.addLayer({
        id: 'forest-border',
        type: 'line',
        source: 'forest-sectors',
        paint: {
          'line-color': '#263D2C',
          'line-width': 1.2,
          'line-opacity': 0.6,
        },
      });
    }

    // 2. Risk Contours & Red Zones
    if (!map.getSource('critical-red-zones')) {
      map.addSource('critical-red-zones', {
        type: 'geojson',
        data: CRITICAL_RED_ZONES_GEOJSON,
      });

      map.addLayer({
        id: 'critical-zones-fill',
        type: 'fill',
        source: 'critical-red-zones',
        paint: {
          'fill-color': 'rgba(150, 56, 46, 0.35)',
          'fill-outline-color': '#96382E',
        },
      });
    }

    // 3. Roads
    if (!map.getSource('roads')) {
      map.addSource('roads', {
        type: 'geojson',
        data: ROADS_GEOJSON,
      });

      map.addLayer({
        id: 'roads-line',
        type: 'line',
        source: 'roads',
        paint: {
          'line-color': '#7A7264',
          'line-width': 2.0,
          'line-opacity': 0.7,
        },
      });
    }

    // 4. Exposure Corridor Polygon for P-18
    if (!map.getSource('exposure-corridor')) {
      map.addSource('exposure-corridor', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'P-18 High Exposure Wildfire Buffer' },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [76.608, 11.642],
                    [76.620, 11.666],
                    [76.650, 11.674],
                    [76.672, 11.675],
                    [76.660, 11.658],
                    [76.634, 11.650],
                    [76.608, 11.642],
                  ],
                ],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: 'exposure-corridor-fill',
        type: 'fill',
        source: 'exposure-corridor',
        paint: {
          'fill-color': 'rgba(201, 93, 53, 0.18)',
          'fill-outline-color': '#C95D35',
        },
      });

      map.addLayer({
        id: 'exposure-corridor-border',
        type: 'line',
        source: 'exposure-corridor',
        paint: {
          'line-color': '#C95D35',
          'line-width': 1.8,
          'line-dasharray': [4, 2],
        },
      });
    }

    // 5. Pipeline Infrastructure & Real Corridor Geometries
    if (!map.getSource('pipeline-segments')) {
      map.addSource('pipeline-segments', {
        type: 'geojson',
        data: PIPELINE_SEGMENTS_GEOJSON,
      });

      // Wide halo casing for high visibility over all terrain and satellites
      map.addLayer({
        id: 'pipeline-halo',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 9.5,
          'line-opacity': 0.95,
        },
      });

      // Pipeline Main Line (colored dynamically by risk exposure: Green, Amber, Orange, Deep Red)
      map.addLayer({
        id: 'pipeline-line',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 5.2,
          'line-opacity': 0.98,
        },
      });

      // Center Flow Dash (conduit indicator)
      map.addLayer({
        id: 'pipeline-flow-pulses',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.8,
          'line-opacity': 0.8,
          'line-dasharray': [4, 4],
        },
      });

      // Active Segment Highlight Glow
      map.addLayer({
        id: 'pipeline-active-glow',
        type: 'line',
        source: 'pipeline-segments',
        paint: {
          'line-color': '#96382E',
          'line-width': 11.0,
          'line-opacity': 0.75,
          'line-blur': 2.5,
        },
        filter: ['==', ['get', 'segmentId'], selectedSegment.id],
      });
    }

    // 6. Wind Vectors Layer
    if (!map.getSource('wind-vectors')) {
      map.addSource('wind-vectors', {
        type: 'geojson',
        data: WIND_VECTORS_GEOJSON,
      });

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

    // Clicks on pipeline segments
    map.on('click', 'pipeline-line', (e) => {
      if (e.features && e.features[0]) {
        const segId = e.features[0].properties?.segmentId;
        const matched = selectedPipeline.segments.find((s) => s.id === segId);
        if (matched) {
          onSelectSegment(matched);
        }
      }
    });

    map.on('mouseenter', 'pipeline-line', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'pipeline-line', () => {
      map.getCanvas().style.cursor = '';
    });
  }, [selectedPipeline, selectedSegment, onSelectSegment]);

  // Render DOM Markers (Valves with V17 -> P-18 -> V18 story, Nearby Assets)
  const renderPipelineMarkers = useCallback((map: MapLibreMap) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Valves (V16, V17, V18, V19)
    if (layers.valves) {
      ISOLATION_VALVES_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const isSelectedBoundary =
          (selectedSegment.id === 'P-18' && (p.id === 'V17' || p.id === 'V18')) ||
          p.id === selectedSegment.upstreamValve.id ||
          p.id === selectedSegment.downstreamValve.id;

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${
              isSelectedBoundary
                ? '<div class="absolute -inset-2.5 rounded-full bg-[#C95D35]/35 animate-ping"></div>'
                : ''
            }
            <div class="h-6 px-2 rounded-full flex items-center gap-1.5 border shadow-lg font-mono text-[10px] font-bold transition-all group-hover:scale-115 ${
              isSelectedBoundary
                ? 'bg-[#C95D35] text-white border-white ring-2 ring-[#C95D35]'
                : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9]'
            }">
              <span class="w-2 h-2 rounded-full ${isSelectedBoundary ? 'bg-white' : 'bg-[#C95D35]'}"></span>
              <span>${p.id}</span>
              ${isSelectedBoundary ? '<span class="text-[9px] uppercase tracking-wider">ISOLATION</span>' : ''}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedValveModal(p);
          setSelectedNearbyAsset(null);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. Nearby Infrastructure Assets along corridor
    if (layers.nearbyAssets) {
      CRITICAL_INFRASTRUCTURE_GEOJSON.features.forEach((feat) => {
        if (feat.geometry.type !== 'Point') return;
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="h-6 w-6 rounded-md bg-[#263D2C] text-[#F1EBDD] border border-[#D3D7C9] flex items-center justify-center shadow-md text-[10px] transition-transform group-hover:scale-115" title="${p.name}">
            ⚡
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedNearbyAsset({
            id: p.id,
            name: p.name,
            type: 'CRITICAL_ASSET',
            distanceKm: parseFloat(p.distanceToP18) || 0.5,
            position: [50, 50],
            description: p.description,
          });
          setSelectedValveModal(null);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Pipeline Segment Midpoint Badges (P-16, P-17, P-18, P-19) - Requirement 6 & 8
    if (layers.pipelineNetwork) {
      PIPELINE_LABEL_POINTS_GEOJSON.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const isSelected = p.segmentId === selectedSegment.id;

        // Dynamic exposure & level according to replayPhase
        let badgeColor = p.color;
        let badgeExposure = p.exposure;
        let badgeLevel = p.riskLevel;

        if (p.segmentId === 'P-18') {
          if (replayPhase === 't48h') {
            badgeLevel = 'LOW';
            badgeExposure = 42;
            badgeColor = '#526B45';
          } else if (replayPhase === 't24h') {
            badgeLevel = 'ELEVATED';
            badgeExposure = 67;
            badgeColor = '#E5A33A';
          } else {
            badgeLevel = 'HIGH';
            badgeExposure = 87;
            badgeColor = '#C95D35';
          }
        } else if (p.segmentId === 'P-17') {
          if (replayPhase === 't48h') {
            badgeColor = '#526B45';
            badgeExposure = 35;
            badgeLevel = 'LOW';
          } else if (replayPhase === 't24h') {
            badgeColor = '#87946C';
            badgeExposure = 52;
            badgeLevel = 'MODERATE';
          }
        } else if (p.segmentId === 'P-19') {
          if (replayPhase === 't48h') {
            badgeColor = '#87946C';
            badgeExposure = 48;
            badgeLevel = 'MODERATE';
          } else if (replayPhase === 't24h') {
            badgeColor = '#C95D35';
            badgeExposure = 78;
            badgeLevel = 'HIGH';
          }
        }

        const el = document.createElement('div');
        el.className = 'group cursor-pointer select-none';
        el.innerHTML = `
          <div class="px-2.5 py-1 rounded-lg shadow-xl border font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all group-hover:scale-115 ${
            isSelected
              ? 'bg-[#263D2C] text-[#F1EBDD] border-white ring-2 ring-[#C95D35]'
              : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9]'
          }">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${badgeColor};"></span>
            <span class="tracking-wide">${p.segmentId}</span>
            <span class="text-[9px] px-1 py-0.2 rounded font-bold" style="background-color: ${badgeColor}25; color: ${badgeColor};">
              [${badgeExposure}]
            </span>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const matched = selectedPipeline.segments.find((s) => s.id === p.segmentId);
          if (matched) {
            onSelectSegment(matched);
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 4. Directional Wind Vectors & Flow Arrows along pipeline corridor
    if (layers.wind) {
      WIND_VECTORS_GEOJSON.features.forEach((feat) => {
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
  }, [layers, selectedSegment, replayPhase, selectedPipeline, onSelectSegment]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(basemapMode),
      center: [76.638, 11.664], // Focused on P-18 South Ridge Corridor
      zoom: 12.4,
      pitch: is3D ? 45 : 0,
      bearing: is3D ? 20 : 0,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    map.on('load', () => {
      isMapLoadedRef.current = true;
      addPipelineLayers(map);
      renderPipelineMarkers(map);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial resize safety kicks
    setTimeout(() => map.resize(), 100);
    setTimeout(() => map.resize(), 300);

    return () => {
      resizeObserver.disconnect();
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
      isMapLoadedRef.current = false;
    };
  }, []);

  // Sync layers visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    const setVisibility = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setVisibility('pipeline-halo', layers.pipelineNetwork);
    setVisibility('pipeline-line', layers.pipelineNetwork);
    setVisibility('pipeline-flow-pulses', layers.pipelineNetwork);
    setVisibility('pipeline-active-glow', layers.pipelineNetwork);
    setVisibility('exposure-corridor-fill', layers.exposureCorridor);
    setVisibility('exposure-corridor-border', layers.exposureCorridor);
    setVisibility('forest-fill', layers.forestPolygons);
    setVisibility('forest-border', layers.forestPolygons);
    setVisibility('roads-line', layers.roads);
    setVisibility('critical-zones-fill', layers.riskHeatmap);
    setVisibility('wind-vectors-halo', layers.wind);
    setVisibility('wind-vectors-line', layers.wind);

    renderPipelineMarkers(map);
  }, [layers, renderPipelineMarkers]);

  // Update active segment glow filter
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    if (map.getLayer('pipeline-active-glow')) {
      map.setFilter('pipeline-active-glow', ['==', ['get', 'segmentId'], selectedSegment.id]);
    }

    renderPipelineMarkers(map);
  }, [selectedSegment, renderPipelineMarkers]);

  // Dynamically update pipeline segments & exposure corridor when replayPhase changes (Requirement 8 & 9)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    // 1. Update pipeline segments GeoJSON data
    const updatedPipelines = {
      ...PIPELINE_SEGMENTS_GEOJSON,
      features: PIPELINE_SEGMENTS_GEOJSON.features.map((feat) => {
        const segId = feat.properties.segmentId;
        if (segId === 'P-18') {
          let lvl: RiskLevel = 'HIGH';
          let exp = 87;
          let color = '#C95D35';
          if (replayPhase === 't48h') {
            lvl = 'LOW';
            exp = 42;
            color = '#526B45';
          } else if (replayPhase === 't24h') {
            lvl = 'ELEVATED';
            exp = 67;
            color = '#E5A33A';
          } else {
            lvl = 'HIGH';
            exp = 87;
            color = '#C95D35';
          }
          return {
            ...feat,
            properties: {
              ...feat.properties,
              riskLevel: lvl,
              assetExposure: exp,
              color,
            },
          };
        }
        if (segId === 'P-17') {
          const color =
            replayPhase === 't48h' ? '#526B45' : replayPhase === 't24h' ? '#87946C' : '#E5A33A';
          return { ...feat, properties: { ...feat.properties, color } };
        }
        if (segId === 'P-19') {
          const color =
            replayPhase === 't48h' ? '#87946C' : replayPhase === 't24h' ? '#C95D35' : '#96382E';
          return { ...feat, properties: { ...feat.properties, color } };
        }
        return feat;
      }),
    };

    const sourcePipelines = map.getSource('pipeline-segments') as maplibregl.GeoJSONSource;
    if (sourcePipelines) {
      sourcePipelines.setData(updatedPipelines as any);
    }

    // 2. Update corridor fill & border
    if (map.getLayer('exposure-corridor-fill')) {
      const corrColor =
        replayPhase === 't48h'
          ? 'rgba(82, 107, 69, 0.20)'
          : replayPhase === 't24h'
          ? 'rgba(229, 163, 58, 0.25)'
          : 'rgba(201, 93, 53, 0.28)';
      map.setPaintProperty('exposure-corridor-fill', 'fill-color', corrColor);
    }

    if (map.getLayer('exposure-corridor-border')) {
      const borderCol =
        replayPhase === 't48h' ? '#526B45' : replayPhase === 't24h' ? '#E5A33A' : '#C95D35';
      map.setPaintProperty('exposure-corridor-border', 'line-color', borderCol);
    }

    renderPipelineMarkers(map);
  }, [replayPhase, renderPipelineMarkers]);

  // Toggle Basemap
  const handleBasemapChange = (newMode: PipelineBasemapMode) => {
    setBasemapMode(newMode);
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    map.setStyle(getMapStyle(newMode));
    map.once('style.load', () => {
      addPipelineLayers(map);
      renderPipelineMarkers(map);
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
    });
  };

  // Toggle 3D Mode
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

  const segmentColor = getSectorStatusColor(selectedSegment.riskLevel);

  return (
    <div className="relative w-full h-full min-h-[480px] overflow-hidden bg-[#ECE5D6] select-none font-sans">
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
          2. UNIFIED TOP BAR: CORRIDOR BRIEFING & CONTROLS (NON-OVERLAPPING)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Corridor Exposure & Isolation Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#1E2A21] shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C95D35] animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold text-[#263D2C]">
              CORRIDOR TWIN · {selectedSegment.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#96382E]/15 text-[#96382E] font-bold">
              {selectedSegment.riskLevel}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#263D2C]/90 text-[#F1EBDD] font-mono text-[10px] shadow-sm backdrop-blur-sm">
            <span className="text-[#E58A3A] font-bold">ISOLATION:</span>
            <span>{selectedSegment.upstreamValve.id} → {selectedSegment.downstreamValve.id}</span>
            <span className="text-[#D3D7C9]">({selectedSegment.affectedLengthKm} km)</span>
          </div>
        </div>

        {/* Right: Basemap + 3D Pitch + Layers */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Basemap Switcher */}
          <div className="flex rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] p-0.5 shadow-md font-mono text-[10px]">
            {(['topo', 'satellite', 'muted'] as PipelineBasemapMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleBasemapChange(mode)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase font-bold ${
                  basemapMode === mode
                    ? 'bg-[#263D2C] text-[#F1EBDD]'
                    : 'text-[#526B45] hover:bg-[#E8EDE2]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* 2D / 3D Mode Toggle */}
          <button
            onClick={handleToggle3D}
            className={`h-8 px-2.5 rounded-lg border font-mono text-[10px] font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              is3D
                ? 'bg-[#E58A3A] text-white border-[#E58A3A]'
                : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9] hover:bg-[#E8EDE2]'
            }`}
            title="Toggle 2D/3D View"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{is3D ? '3D TERRAIN' : '2D OVERVIEW'}</span>
          </button>

          {/* Layers Button */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`h-8 px-2.5 rounded-lg border font-mono text-[10px] font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              showLayerMenu
                ? 'bg-[#263D2C] text-[#F1EBDD] border-[#263D2C]'
                : 'bg-[#F7F4EC] text-[#263D2C] border-[#D3D7C9] hover:bg-[#E8EDE2]'
            }`}
            title="Toggle Pipeline GIS Layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS</span>
          </button>
        </div>
      </div>

      {/* Layer Toggle Menu */}
      {showLayerMenu && (
        <div className="absolute top-14 right-3 z-30 w-60 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3 font-mono text-xs text-[#1E2A21] space-y-2 animate-in fade-in duration-150">
          <div className="flex justify-between items-center pb-1.5 border-b border-[#D3D7C9]">
            <span className="font-bold text-[#263D2C] text-[11px] uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#526B45]" />
              PIPELINE GIS LAYERS
            </span>
            <button onClick={() => setShowLayerMenu(false)} className="text-xs font-bold text-[#69766A] hover:text-[#1E2A21] cursor-pointer">
              ✕
            </button>
          </div>
          {[
            { key: 'pipelineNetwork', label: 'Pipeline Network & Segments' },
            { key: 'exposureCorridor', label: 'High Exposure Corridor' },
            { key: 'valves', label: 'Isolation Block Valves' },
            { key: 'nearbyAssets', label: 'Critical Assets & Substations' },
            { key: 'riskHeatmap', label: 'Wildfire Risk Heatmap' },
            { key: 'forestPolygons', label: 'Forest Sectors' },
            { key: 'wind', label: 'Wind Flow Field (24 km/h)' },
            { key: 'roads', label: 'Roads & Access Tracks' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-[#E8EDE2] p-1 rounded transition-colors">
              <input
                type="checkbox"
                checked={(layers as any)[key]}
                onChange={() => setLayers((prev) => ({ ...prev, [key]: !(prev as any)[key] }))}
                className="accent-[#526B45] cursor-pointer"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. RIGHT FLOATING ZOOM & ORIENTATION CONTROLS
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5">
        <div className="flex flex-col rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] shadow-md overflow-hidden">
          <button
            onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
            className="p-2 text-[#263D2C] hover:bg-[#E8EDE2] border-b border-[#D3D7C9] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
            className="p-2 text-[#263D2C] hover:bg-[#E8EDE2] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            mapRef.current?.flyTo({
              center: [76.638, 11.664],
              zoom: 12.4,
              pitch: is3D ? 45 : 0,
              bearing: is3D ? 20 : 0,
              duration: 800,
            });
          }}
          className="p-2 rounded-lg bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2] shadow-md cursor-pointer"
          title="Reset to P-18 Corridor"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. UNIFIED INSPECTOR MODALS (MUTUALLY EXCLUSIVE POSITION ON LEFT)
          ───────────────────────────────────────────────────────────── */}
      {selectedValveModal && (
        <div className="absolute top-14 left-3 z-30 w-72 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <span className="font-bold text-[#263D2C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C95D35] animate-ping"></span>
              VALVE {selectedValveModal.id}
            </span>
            <button onClick={() => setSelectedValveModal(null)} className="text-[#69766A] hover:text-[#1E2A21] font-bold cursor-pointer">
              ✕
            </button>
          </div>
          <div className="space-y-1.5 mt-2.5 text-[11px]">
            <div>
              <span className="text-[#69766A]">Type:</span>{' '}
              <span className="font-bold text-[#1E2A21]">{selectedValveModal.type}</span>
            </div>
            <div>
              <span className="text-[#69766A]">Pipeline:</span>{' '}
              <span className="font-bold text-[#1E2A21]">{selectedValveModal.pipeline}</span>
            </div>
            <div>
              <span className="text-[#69766A]">Status:</span>{' '}
              <span className="font-bold text-[#526B45]">Operational · Telemetry Live</span>
            </div>
            <div>
              <span className="text-[#69766A]">Role:</span>{' '}
              <span className="font-bold text-[#C95D35]">{selectedValveModal.role}</span>
            </div>
          </div>
        </div>
      )}

      {selectedNearbyAsset && (
        <div className="absolute top-14 left-3 z-30 w-80 bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-3.5 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9]">
            <span className="font-bold text-[#263D2C] flex items-center gap-1.5">
              ⚡ {selectedNearbyAsset.name}
            </span>
            <button onClick={() => setSelectedNearbyAsset(null)} className="text-[#69766A] hover:text-[#1E2A21] font-bold cursor-pointer">
              ✕
            </button>
          </div>
          <div className="space-y-1.5 mt-2.5 text-[11px]">
            <div className="text-[10px] text-[#69766A] leading-relaxed">
              {selectedNearbyAsset.description}
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#D3D7C9]">
              <span className="text-[#69766A]">Distance to P-18:</span>
              <span className="font-bold text-[#C95D35]">{selectedNearbyAsset.distanceKm} km</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM OPERATIONAL SEGMENTS SELECTOR STRIP
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 right-4 z-20 p-2 rounded-xl bg-[#F7F4EC]/95 backdrop-blur-md border border-[#D3D7C9] shadow-lg flex items-center justify-between gap-3 overflow-x-auto font-mono text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#526B45] tracking-wider px-1">
            SEGMENTS:
          </span>
          <div className="flex items-center gap-2">
            {selectedPipeline.segments.map((seg) => {
              const isSel = seg.id === selectedSegment.id;
              const color = getSectorStatusColor(seg.riskLevel);
              return (
                <button
                  key={seg.id}
                  onClick={() => onSelectSegment(seg)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSel
                      ? 'bg-[#263D2C] text-[#F1EBDD] border-[#263D2C] shadow-sm ring-1 ring-[#263D2C]'
                      : 'bg-[#E2E7DA] text-[#263D2C] hover:bg-[#DDE5D7] border-[#D3D7C9]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span>{seg.id}</span>
                  <span className={`text-[10px] uppercase font-semibold ${isSel ? 'text-[#D3D7C9]' : 'text-[#69766A]'}`}>
                    [{seg.riskLevel}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-[#69766A] shrink-0 pr-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#526B45]"></span>
            <span>LOW</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E5A33A]"></span>
            <span>ELEVATED</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C95D35]"></span>
            <span>HIGH</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#96382E]"></span>
            <span>CRITICAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
