import React, { useState } from 'react';
import {
  InfrastructureAsset,
  ForestSector,
  LayerVisibilityState,
  MonitoredRegion,
} from '../../types/intelligence';
import { GeospatialTerrainMap } from '../map/GeospatialTerrainMap';
import {
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { getSectorStatusColor } from '../../services/riskService';

interface InfrastructureViewProps {
  currentRegion: MonitoredRegion;
  selectedSector: ForestSector;
  onSelectSector: (sector: ForestSector) => void;
  layers: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  sarActive: boolean;
  infrastructureAssets: InfrastructureAsset[];
  onOpenTimeWarp: () => void;
  onNavigateToPipeline?: () => void;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({
  currentRegion,
  selectedSector,
  onSelectSector,
  layers,
  onToggleLayer,
  sarActive,
  infrastructureAssets,
  onOpenTimeWarp,
  onNavigateToPipeline,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    infrastructureAssets[0]?.id || 'INFRA-LINE-17'
  );

  const selectedAsset =
    infrastructureAssets.find((a) => a.id === selectedAssetId) || infrastructureAssets[0];

  const criticalCount = 3;
  const highCount = 7;
  const monitorCount = 12;

  const assetColor = getSectorStatusColor(selectedAsset.riskLevel);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21] select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & EXPOSURE SUMMARY
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 py-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <Zap className="w-3.5 h-3.5 text-[#E58A3A]" />
              <span>UTILITY INTERSECTION & ASSET EXPOSURE INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight mt-1">
              Infrastructure Exposure
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-3xl leading-relaxed">
              Visualize critical infrastructure intersecting elevated fuel volatility zones.
              Delivers situational awareness to power utilities, telecommunications, and wildland-urban
              interfaces.
            </p>
          </div>

          {/* Exposure Alert Badges & Pipeline Intelligence CTA */}
          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            {onNavigateToPipeline && (
              <button
                onClick={onNavigateToPipeline}
                className="px-3.5 py-1.5 rounded-lg bg-[#C95D35] hover:bg-[#A84B29] text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>PIPELINE INTELLIGENCE</span>
              </button>
            )}
            <div className="px-3.5 py-1.5 rounded-lg bg-[#96382E]/15 border border-[#96382E]/40 text-[#96382E]">
              <span className="font-bold">{criticalCount}</span> CRITICAL
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#C95D35]/15 border border-[#C95D35]/40 text-[#C95D35]">
              <span className="font-bold">{highCount}</span> HIGH
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-[#526B45]">
              <span className="font-bold">{monitorCount}</span> MONITOR
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN SPLIT: 3D MAP + ASSET EXPOSURE CARD
          ───────────────────────────────────────────────────────────── */}
      {/* Asset Selector Strip */}
      <div className="px-6 lg:px-8 py-2.5 bg-[#F7F4EC] border-b border-[#D3D7C9] flex items-center justify-between gap-3 overflow-x-auto select-none shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[#526B45] uppercase tracking-wider font-bold">
            INFRASTRUCTURE ASSETS:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {infrastructureAssets.map((asset) => {
              const isSel = asset.id === selectedAssetId;
              const color = getSectorStatusColor(asset.riskLevel);
              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    const matchingSector = currentRegion.sectors.find(
                      (s) => s.id === asset.intersectingSectorId
                    );
                    if (matchingSector) onSelectSector(matchingSector);
                  }}
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
                  <span>{asset.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-mono text-[#69766A] hidden md:block">
          Focused Asset: <span className="font-bold text-[#1E2A21]">{selectedAsset.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-[540px]">
        {/* Left Map Viewport */}
        <div className="relative flex-1 min-h-[460px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-[#D3D7C9] bg-[#ECE5D6]">
          <GeospatialTerrainMap
            sectors={currentRegion.sectors}
            selectedSector={selectedSector}
            onSelectSector={onSelectSector}
            layers={layers}
            onToggleLayer={onToggleLayer}
            sarActive={sarActive}
            infrastructureAssets={infrastructureAssets}
            onOpenTimeWarp={onOpenTimeWarp}
            onNavigateToPipeline={onNavigateToPipeline}
            compactSectorPanel={true}
          />
        </div>

        {/* Right Asset Analysis & Recommendation Column (Spacious, clean) */}
        <div className="w-full lg:w-[420px] p-6 bg-[#F7F4EC] overflow-y-auto space-y-6 text-xs font-mono shrink-0 border-l border-[#D3D7C9]">
          {/* Selected Asset Header Card */}
          <div className="p-5 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] space-y-4 shadow-xs">
            <div className="flex items-start justify-between pb-3 border-b border-[#D3D7C9]">
              <div>
                <div className="text-[10px] text-[#69766A] uppercase tracking-widest font-semibold">
                  MONITORED CORRIDOR
                </div>
                <h3 className="text-base font-display font-bold text-[#263D2C] mt-1">
                  {selectedAsset.name}
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${assetColor.bg} ${assetColor.text} border ${assetColor.border}`}
              >
                {selectedAsset.riskLevel}
              </span>
            </div>

            {/* Metric Bars */}
            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#1E2A21]">Fuel Volatility Exposure</span>
                  <span className="text-[#C95D35] font-bold">{selectedAsset.fuelExposure} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#D3D7C9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C95D35] rounded-full"
                    style={{ width: `${selectedAsset.fuelExposure}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#1E2A21]">Wind Velocity Exposure</span>
                  <span className="text-[#526B45] font-bold">{selectedAsset.windExposure} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#D3D7C9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#526B45] rounded-full"
                    style={{ width: `${selectedAsset.windExposure}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#1E2A21]">Vegetation Density Load</span>
                  <span className="text-[#E58A3A] font-bold">{selectedAsset.vegetationExposure} / 100</span>
                </div>
                <div className="w-full h-2 bg-[#D3D7C9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E58A3A] rounded-full"
                    style={{ width: `${selectedAsset.vegetationExposure}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Spatial clearance */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D3D7C9] text-xs">
              <div className="p-3 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[10px] text-[#69766A] uppercase font-semibold">DIST TO HIGH RISK</div>
                <div className="text-[#263D2C] font-bold text-base mt-1 tabular-nums">
                  {selectedAsset.distanceToHighRiskKm} km
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F1EBDD] border border-[#D3D7C9]">
                <div className="text-[10px] text-[#69766A] uppercase font-semibold">CLEARANCE DELTA</div>
                <div className="text-[#C95D35] font-bold text-base mt-1 tabular-nums">
                  {selectedAsset.clearanceMarginPct}%
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Decision Support */}
          <div className="p-5 rounded-xl bg-[#E58A3A]/15 border border-[#E58A3A]/40 space-y-3">
            <div className="flex items-center gap-2 text-[#C95D35] font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-[#C95D35]" />
              <span>DECISION SUPPORT ADVISORY</span>
            </div>
            <p className="text-xs text-[#1E2A21] leading-relaxed">
              {selectedAsset.recommendedResponse}
            </p>
            <div className="pt-2 border-t border-[#E58A3A]/25 text-[11px] text-[#C95D35] font-semibold">
              CRITICAL: Advisory is decision-support only. Automatic shutoffs are not triggered without human review.
            </div>
          </div>

          {/* Corridor Intersecting Sector */}
          <div className="p-5 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#69766A]">Intersecting Sector:</span>
              <span className="text-[#263D2C] font-bold">{selectedAsset.intersectingSectorId}</span>
            </div>
            <div className="text-[11px] text-[#69766A] leading-relaxed">
              Transmission towers traverse the dry ridge corridor where radar backscatter dropped by
              -2.41 dB. Rapid clearance monitoring recommended.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
