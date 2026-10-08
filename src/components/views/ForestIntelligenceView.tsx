import React, { useState } from 'react';
import {
  ForestSector,
  LayerVisibilityState,
  MonitoredRegion,
  InfrastructureAsset,
} from '../../types/intelligence';
import { GeospatialTerrainMap } from '../map/GeospatialTerrainMap';
import {
  Trees,
  Mountain,
  Droplets,
  Wind,
  Layers,
  Radio,
  Clock,
  Compass,
  History,
  Activity,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { getSectorStatusColor } from '../../services/riskService';

interface ForestIntelligenceViewProps {
  currentRegion: MonitoredRegion;
  selectedSector: ForestSector;
  onSelectSector: (sector: ForestSector) => void;
  layers: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  sarActive: boolean;
  onToggleSAR: () => void;
  infrastructureAssets: InfrastructureAsset[];
  onNavigateToTimeWarp: () => void;
  onOpenOpticalComparison: () => void;
}

export const ForestIntelligenceView: React.FC<ForestIntelligenceViewProps> = ({
  currentRegion,
  selectedSector,
  onSelectSector,
  layers,
  onToggleLayer,
  sarActive,
  onToggleSAR,
  infrastructureAssets,
  onNavigateToTimeWarp,
  onOpenOpticalComparison,
}) => {
  const selectedColor = getSectorStatusColor(selectedSector.riskLevel);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & FOREST HIGH-LEVEL STATS
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 py-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <Trees className="w-3.5 h-3.5 text-[#526B45]" />
              <span>FOREST DIGITAL TWIN · 3D SECTOR RECONNAISSANCE</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight">
                {currentRegion.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E2E7DA] text-[#263D2C] font-mono border border-[#D3D7C9] font-semibold">
                {selectedSector.code} FOCUSED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOpticalComparison}
              className="h-10 px-4 text-xs font-mono font-medium rounded-lg border border-[#D3D7C9] bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#526B45]" />
              <span>COMPARE OPTICAL VS SAR</span>
            </button>

            <button
              onClick={onToggleSAR}
              className={`h-10 px-4 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                sarActive
                  ? 'bg-[#E58A3A]/20 text-[#C95D35] border border-[#E58A3A]'
                  : 'bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] border border-[#263D2C]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${sarActive ? 'animate-pulse text-[#C95D35]' : 'text-[#F1EBDD]'}`} />
              <span>{sarActive ? 'SAR VISION LIVE' : 'ENABLE SAR VISION'}</span>
            </button>
          </div>
        </div>

        {/* 4 Spacious Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              TOTAL SECTOR EXTENT
            </div>
            <div className="text-xl font-bold text-[#263D2C] mt-1 tabular-nums">482 km²</div>
            <div className="text-[11px] text-[#69766A] mt-0.5">Elevation: 680 to 1,450 m MSL</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              DOMINANT VEGETATION
            </div>
            <div className="text-base font-bold text-[#263D2C] mt-1 truncate">Dense Deciduous</div>
            <div className="text-[11px] text-[#69766A] mt-0.5">Bamboo Breaks & Teak Strata</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              ATMOSPHERIC VAPOR LOAD
            </div>
            <div className="text-xl font-bold text-[#C95D35] mt-1 tabular-nums">3.8 kPa VPD</div>
            <div className="text-[11px] text-[#69766A] mt-0.5">Gusts: 31 km/h ENE (Severe drying)</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              PRE-IGNITION HAZARD
            </div>
            <div className="text-xl font-bold text-[#96382E] mt-1 tabular-nums">
              87 VOLATILITY [HIGH]
            </div>
            <div className="text-[11px] text-[#69766A] mt-0.5">Canopy Moisture Trend: -18.4%</div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. DIGITAL TWIN MAP & SECTOR SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      {/* Quick Sector Selector Bar */}
      <div className="px-6 lg:px-8 py-2.5 bg-[#F7F4EC] border-b border-[#D3D7C9] flex items-center justify-between gap-3 overflow-x-auto select-none shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[#526B45] uppercase tracking-wider font-bold">
            FOREST SECTORS:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {currentRegion.sectors.map((sec) => {
              const isSel = sec.id === selectedSector.id;
              const color = getSectorStatusColor(sec.riskLevel);
              return (
                <button
                  key={sec.id}
                  onClick={() => onSelectSector(sec)}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSel
                      ? 'bg-[#263D2C] text-[#F1EBDD] border border-[#263D2C] shadow-sm font-semibold'
                      : 'bg-[#E2E7DA] text-[#263D2C] hover:bg-[#DDE5D7] border border-[#D3D7C9]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span>{sec.code}</span>
                  <span className={`text-[10px] font-bold ${isSel ? 'text-[#D3D7C9]' : 'text-[#69766A]'}`}>
                    [{sec.fuelVolatility}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-mono text-[#526B45] font-semibold hidden md:block">
          Active Sector: <span className="font-bold text-[#263D2C]">{selectedSector.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-[540px]">
        {/* 3D Map Viewport */}
        <div className="relative flex-1 min-h-[460px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-[#D3D7C9] bg-[#EBE4D5]">
          <GeospatialTerrainMap
            sectors={currentRegion.sectors}
            selectedSector={selectedSector}
            onSelectSector={onSelectSector}
            layers={layers}
            onToggleLayer={onToggleLayer}
            sarActive={sarActive}
            infrastructureAssets={infrastructureAssets}
            onOpenTimeWarp={onNavigateToTimeWarp}
            compactSectorPanel={true}
          />
        </div>

        {/* Right Inspection & Telemetry Panel */}
        <div className="w-full lg:w-[420px] p-6 bg-[#F1EBDD] border-l border-[#D3D7C9] overflow-y-auto space-y-6 text-xs font-mono shrink-0">
          {/* Target Sector Profile Card */}
          <div className="p-5 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-4 shadow-xs">
            <div className="flex items-start justify-between pb-3 border-b border-[#D3D7C9]">
              <div>
                <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
                  TARGET SECTOR PROFILE
                </div>
                <h3 className="text-base font-display font-bold text-[#263D2C] mt-1">
                  {selectedSector.name}
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${selectedColor.bg} ${selectedColor.text} border ${selectedColor.border}`}
              >
                {selectedSector.riskLevel}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">Fuel Volatility Score</span>
                <span className="text-[#263D2C] font-bold tabular-nums">
                  {selectedSector.fuelVolatility} / 100
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">Canopy Moisture Trend</span>
                <span className="text-[#526B45] font-bold tabular-nums">
                  {selectedSector.moistureAnomaly}%
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">SAR Radar Anomaly</span>
                <span className="text-[#E58A3A] font-bold tabular-nums">
                  {selectedSector.sarAnomaly} dB
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">Atmospheric VPD</span>
                <span className="text-[#C95D35] font-bold tabular-nums">{selectedSector.vpd} kPa</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">Surface Wind Velocity</span>
                <span className="text-[#87946C] font-bold tabular-nums">{selectedSector.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
                <span className="text-[#69766A]">Historical Similarity Match</span>
                <span className="text-[#263D2C] font-bold tabular-nums">
                  {selectedSector.historicalSimilarity} (82% Profile Correlation)
                </span>
              </div>
            </div>

            <button
              onClick={onNavigateToTimeWarp}
              className="w-full mt-4 h-10 px-4 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>OPEN TIME WARP REPLAY</span>
            </button>
          </div>

          {/* SAR Telemetry Live Card */}
          <div className="p-5 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3D7C9]">
              <div className="flex items-center gap-2 text-[#263D2C] font-bold text-xs">
                <Radio className="w-4 h-4 text-[#526B45]" />
                <span>SYNTHETIC APERTURE RADAR</span>
              </div>
              <span className="text-[10px] text-[#526B45] bg-[#E2E7DA] px-2 py-0.5 rounded border border-[#BFC8B7] font-semibold">
                LIVE ORBIT PASS
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-0.5">
                <span className="text-[#69766A]">Backscatter Delta:</span>
                <span className="text-[#E58A3A] font-mono font-bold">-2.41 dB</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#69766A]">Moisture Loss Anomaly:</span>
                <span className="text-[#526B45] font-mono font-bold">-18.4%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#69766A]">Observation Confidence:</span>
                <span className="text-[#263D2C] font-mono font-bold">87%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#69766A]">Assimilated Timestamp:</span>
                <span className="text-[#1E2A21] font-mono font-bold">06:42 UTC</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#E2E7DA]/60 border border-[#D3D7C9] text-[11px] text-[#1E2A21] leading-relaxed">
              C-band microwaves penetrate cloud cover, measuring dielectric permittivity
              collapse across upper foliar leaves.
            </div>
          </div>

          {/* Sector Topography Profile */}
          <div className="p-5 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#263D2C] font-bold text-xs">
              <Mountain className="w-4 h-4 text-[#526B45]" />
              <span>TOPOGRAPHIC CHANNELING</span>
            </div>
            <p className="text-[11px] text-[#69766A] leading-relaxed">
              Sector 07 crest spans 820m to 1,450m elevation. The ENE 68° prevailing wind corridor
              accelerates evaporation on sun-exposed eastern aspects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
