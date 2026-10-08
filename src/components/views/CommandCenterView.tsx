import React, { useState } from 'react';
import {
  ForestSector,
  LayerVisibilityState,
  MonitoredRegion,
  InfrastructureAsset,
} from '../../types/intelligence';
import { GeospatialTerrainMap } from '../map/GeospatialTerrainMap';
import {
  Radio,
  Satellite,
  Flame,
  Droplets,
  Wind,
  Activity,
  AlertTriangle,
  TrendingUp,
  Layers,
  ChevronRight,
  ShieldAlert,
  Loader2,
  ExternalLink,
  History,
} from 'lucide-react';
import { getSectorStatusColor } from '../../services/riskService';

interface CommandCenterViewProps {
  currentRegion: MonitoredRegion;
  selectedSector: ForestSector;
  onSelectSector: (sector: ForestSector) => void;
  layers: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  sarActive: boolean;
  onToggleSAR: () => void;
  infrastructureAssets: InfrastructureAsset[];
  onNavigateToTimeWarp: () => void;
  onNavigateToSectorDeepDive: () => void;
  onOpenOpticalComparison: () => void;
  onNavigateToPipeline?: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  currentRegion,
  selectedSector,
  onSelectSector,
  layers,
  onToggleLayer,
  sarActive,
  onToggleSAR,
  infrastructureAssets,
  onNavigateToTimeWarp,
  onNavigateToSectorDeepDive,
  onOpenOpticalComparison,
  onNavigateToPipeline,
}) => {
  const [isProcessingSAR, setIsProcessingSAR] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleSARActivation = () => {
    if (sarActive) {
      onToggleSAR();
      return;
    }

    setIsProcessingSAR(true);
    setLoadingStep('ACQUIRING SATELLITE PASS (SENTINEL-1 C-SAR)...');

    setTimeout(() => {
      setLoadingStep('PROCESSING RADAR GRID & BACKSCATTER ANOMALIES...');
    }, 350);

    setTimeout(() => {
      setLoadingStep('FUSING ENVIRONMENTAL SIGNALS (VPD + WIND FIELD)...');
    }, 700);

    setTimeout(() => {
      setLoadingStep('CALCULATING CANOPY DIELECTRIC FUEL VOLATILITY...');
    }, 1050);

    setTimeout(() => {
      setIsProcessingSAR(false);
      onToggleSAR();
    }, 1350);
  };

  const selectedColor = getSectorStatusColor(selectedSector.riskLevel);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP TELEMETRY
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 pt-6 pb-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E58A3A]"></span>
              <span>ORBITAL WILDFIRE INTELLIGENCE · PRE-IGNITION SURVEILLANCE</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight mt-1">
              {currentRegion.name}
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-2xl leading-relaxed">
              Detecting environmental conditions associated with elevated wildfire risk before ignition.
              Synthetic aperture radar measures canopy moisture loss under cloud cover.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {onNavigateToPipeline && (
              <button
                onClick={onNavigateToPipeline}
                className="h-10 px-4 text-xs font-mono font-bold rounded-lg border border-[#E58A3A]/40 bg-[#E58A3A]/15 hover:bg-[#E58A3A]/25 text-[#C95D35] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#C95D35]" />
                <span>PIPELINE INTELLIGENCE</span>
              </button>
            )}

            <button
              onClick={onOpenOpticalComparison}
              className="h-10 px-4 text-xs font-mono font-medium rounded-lg border border-[#D3D7C9] bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#526B45]" />
              <span>OPTICAL VS. SAR</span>
            </button>

            <button
              onClick={handleSARActivation}
              disabled={isProcessingSAR}
              className={`h-10 px-5 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2.5 shadow-sm cursor-pointer ${
                sarActive
                  ? 'bg-[#E58A3A]/20 text-[#C95D35] border border-[#E58A3A]'
                  : 'bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] border border-[#263D2C]'
              }`}
            >
              {isProcessingSAR ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F1EBDD]" />
                  <span>CALCULATING SAR...</span>
                </>
              ) : (
                <>
                  <Radio className={`w-4 h-4 ${sarActive ? 'animate-pulse text-[#C95D35]' : 'text-[#F1EBDD]'}`} />
                  <span>{sarActive ? 'SAR VISION ACTIVE' : 'ACTIVATE SAR VISION'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Core Statistics (Clean, botanical layout with crisp hierarchy) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              ACTIVE RISK ZONES
            </div>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-bold text-[#96382E] tabular-nums tracking-tight">07</span>
              <span className="text-xs text-[#96382E] font-semibold">3 Critical · 4 High</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Multi-sector pre-ignition watch</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              MONITORED FOREST
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold text-[#263D2C] tabular-nums tracking-tight">4,821</span>
              <span className="text-xs text-[#69766A]">km²</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Continuous radar swath tracking</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              PEAK FUEL VOLATILITY
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#C95D35] tabular-nums tracking-tight">87</span>
              <span className="text-xs text-[#C95D35] font-bold uppercase">HIGH</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">{selectedSector.name}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              SATELLITE STATUS
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold text-[#263D2C]">SENTINEL-1B</span>
              <span className="text-xs text-[#526B45] font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Pass 06:42 UTC assimilated</div>
          </div>
        </div>
      </section>

      {/* Simulated SAR Acquisition Progress Bar */}
      {isProcessingSAR && (
        <div className="px-6 lg:px-8 py-2.5 bg-[#E8EDE2] border-b border-[#D3D7C9] text-xs font-mono text-[#263D2C] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#526B45]" />
            <span className="font-semibold">{loadingStep}</span>
          </div>
          <span className="text-[#69766A] text-[11px]">COPERNICUS OPEN ACCESS HUB</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. PRIMARY MAP / MAIN VISUALIZATION (WHERE?)
          ───────────────────────────────────────────────────────────── */}
      {/* Quick Sector Selector Strip */}
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
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
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
                  <span className={`text-[10px] ${isSel ? 'text-[#D3D7C9]' : 'text-[#69766A]'}`}>
                    [{sec.fuelVolatility}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#69766A] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#96382E] animate-ping"></span>
          <span>HIGH VOLATILITY RIDGE ACTIVE</span>
        </div>
      </div>

      <section className="relative w-full h-[540px] lg:h-[600px] shrink-0 border-b border-[#D3D7C9] bg-[#EBE4D5]">
        <GeospatialTerrainMap
          sectors={currentRegion.sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          layers={layers}
          onToggleLayer={onToggleLayer}
          sarActive={sarActive}
          infrastructureAssets={infrastructureAssets}
          onOpenTimeWarp={onNavigateToTimeWarp}
          onNavigateToPipeline={onNavigateToPipeline}
          onNavigateToSectorDeepDive={onNavigateToSectorDeepDive}
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. KEY INTELLIGENCE (WHY IS THIS SECTOR AT RISK?)
          ───────────────────────────────────────────────────────────── */}
      <section className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F1EBDD] border-b border-[#D3D7C9]">
        {/* Left Column (5 Cols): Target Sector Fuel Volatility Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono space-y-6 shadow-xs">
          <div className="flex items-start justify-between pb-4 border-b border-[#D3D7C9]">
            <div>
              <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
                TARGET SECTOR DECOMPOSITION
              </div>
              <h2 className="text-lg font-display font-bold text-[#263D2C] mt-1">
                {selectedSector.name}
              </h2>
              <div className="text-xs text-[#69766A] mt-0.5">
                Vegetation: {selectedSector.vegetationType} · Area: {selectedSector.areaKm2} km²
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold font-mono text-[#263D2C] tabular-nums tracking-tight">
                {selectedSector.fuelVolatility}
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${selectedColor.text}`}>
                {selectedSector.riskLevel} VOLATILITY
              </div>
            </div>
          </div>

          {/* Signal Decomposition Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#1E2A21] font-medium">Canopy Foliar Moisture Anomaly</span>
                <span className="text-[#526B45] font-bold">
                  {selectedSector.driverBreakdown.canopyMoisture}% Weight ({selectedSector.moistureAnomaly}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E7DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#526B45] rounded-full transition-all duration-500"
                  style={{ width: `${selectedSector.driverBreakdown.canopyMoisture}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#1E2A21] font-medium">Vapor Pressure Deficit (VPD)</span>
                <span className="text-[#C95D35] font-bold">
                  {selectedSector.driverBreakdown.vpdDryness}% Weight ({selectedSector.vpd} kPa)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E7DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C95D35] rounded-full transition-all duration-500"
                  style={{ width: `${selectedSector.driverBreakdown.vpdDryness}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#1E2A21] font-medium">Ridge Wind Velocity & Channeling</span>
                <span className="text-[#87946C] font-bold">
                  {selectedSector.driverBreakdown.windExposure}% Weight ({selectedSector.windSpeed} km/h)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E7DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#87946C] rounded-full transition-all duration-500"
                  style={{ width: `${selectedSector.driverBreakdown.windExposure}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#1E2A21] font-medium">SAR Microwave Backscatter Anomaly</span>
                <span className="text-[#E58A3A] font-bold">
                  {selectedSector.driverBreakdown.sarBackscatter}% Weight ({selectedSector.sarAnomaly} dB)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E7DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E58A3A] rounded-full transition-all duration-500"
                  style={{ width: `${selectedSector.driverBreakdown.sarBackscatter}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#1E2A21] font-medium">Historical Pre-Ignition Match</span>
                <span className="text-[#263D2C] font-bold">
                  {selectedSector.driverBreakdown.historicalPattern}% Weight ({selectedSector.historicalSimilarity * 100}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E7DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#263D2C] rounded-full transition-all duration-500"
                  style={{ width: `${selectedSector.driverBreakdown.historicalPattern}%` }}
                ></div>
              </div>
            </div>
          </div>

          {selectedSector.id === 'SEC-07' && onNavigateToPipeline && (
            <div className="p-3.5 rounded-lg bg-[#96382E]/10 border border-[#96382E]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#96382E] shrink-0" />
                <div>
                  <span className="text-[#96382E] font-bold">CRITICAL EXPOSED ASSET: </span>
                  <span className="text-[#1E2A21] font-medium">Pipeline Segment P-18 (Exposure: 87/100)</span>
                </div>
              </div>
              <button
                onClick={onNavigateToPipeline}
                className="px-2.5 py-1 rounded bg-[#96382E] text-white hover:bg-[#7D2E25] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <span>ISOLATION TWIN →</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#D3D7C9] flex items-center justify-between text-xs">
            <span className="text-[#69766A]">
              Confidence: {selectedSector.observationConfidence}% · C-Band Radiometric
            </span>
            <button
              onClick={onNavigateToSectorDeepDive}
              className="text-[#263D2C] hover:text-[#526B45] font-bold flex items-center gap-1 group cursor-pointer"
            >
              <span>DEEP DIVE SECTOR</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Analytical Explanation */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D3D7C9]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E58A3A]" />
              <h2 className="text-base font-display font-bold text-[#263D2C] tracking-wide">
                WHY IS {selectedSector.code} AT ELEVATED RISK?
              </h2>
            </div>
            <span className="text-[10px] text-[#526B45] font-bold uppercase tracking-wider">
              MULTI-SIGNAL EXPLANATION
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {selectedSector.explanationPoints.map((point) => (
              <div
                key={point.title}
                className="p-3.5 rounded-lg bg-[#E2E7DA]/60 border border-[#D3D7C9] flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-[#263D2C] font-bold text-xs">{point.title}</div>
                  <div className="text-[#1E2A21] text-xs mt-1 leading-relaxed">
                    {point.description}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#F7F4EC] border border-[#D3D7C9] text-[#263D2C] text-xs font-bold shrink-0">
                  {point.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DETAILED ANALYSIS (WHEN? RISK TRAJECTORY)
          ───────────────────────────────────────────────────────────── */}
      <section className="p-6 lg:p-8 bg-[#F1EBDD]">
        <div className="p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] font-mono shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D3D7C9] gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#526B45]" />
              <h2 className="text-base font-display font-bold text-[#263D2C] tracking-wide">
                72-HOUR PRE-IGNITION RISK TRAJECTORY
              </h2>
            </div>
            <span className="text-[10px] text-[#526B45] font-bold uppercase tracking-wider">
              NUMERICAL ATMOSPHERIC SIMULATION
            </span>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="relative w-full h-44">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130">
              {/* Horizontal grid lines */}
              <line x1="0" y1="25" x2="500" y2="25" stroke="#D3D7C9" strokeDasharray="3 3" />
              <line x1="0" y1="65" x2="500" y2="65" stroke="#D3D7C9" strokeDasharray="3 3" />
              <line x1="0" y1="105" x2="500" y2="105" stroke="#D3D7C9" strokeDasharray="3 3" />

              {/* Critical threshold line at risk = 90 (y ≈ 28) */}
              <line
                x1="0"
                y1="30"
                x2="500"
                y2="30"
                stroke="#96382E"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text x="350" y="24" fill="#96382E" fontSize="9" fontFamily="monospace" fontWeight="bold">
                CRITICAL THRESHOLD (90)
              </text>

              {/* Area fill */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C95D35" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C95D35" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 20,50 L 135,40 L 250,32 L 365,22 L 480,44 L 480,115 L 20,115 Z"
                fill="url(#chartGrad)"
              />

              {/* Stroke line */}
              <path
                d="M 20,50 L 135,40 L 250,32 L 365,22 L 480,44"
                fill="none"
                stroke="#C95D35"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {selectedSector.forecast72h.map((pt, i) => {
                const x = 20 + i * 115;
                const y = 115 - (pt.risk / 100) * 100;
                const isPeak = pt.offsetHours === 48;

                return (
                  <g key={pt.time}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isPeak ? 5.5 : 4}
                      fill={isPeak ? '#96382E' : '#C95D35'}
                      stroke="#F7F4EC"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 9}
                      textAnchor="middle"
                      fill={isPeak ? '#96382E' : '#263D2C'}
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {pt.risk}
                    </text>
                    <text
                      x={x}
                      y="126"
                      textAnchor="middle"
                      fill="#69766A"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {pt.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#D3D7C9] text-xs">
            <span className="text-[#69766A]">
              Peak volatility expected at +48 Hours (Score: 91). Pre-ignition signature is prominent
              prior to any active flame event.
            </span>
            <button
              onClick={onNavigateToTimeWarp}
              className="h-9 px-4 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-bold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>EXPLORE TIME WARP REPLAY</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
