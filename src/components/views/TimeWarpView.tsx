import React, { useState, useEffect } from 'react';
import {
  HistoricalEvent,
  TimeWarpStep,
  ForestSector,
  LayerVisibilityState,
  InfrastructureAsset,
} from '../../types/intelligence';
import { GeospatialTerrainMap } from '../map/GeospatialTerrainMap';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Flame,
  History,
  Activity,
} from 'lucide-react';
import { getSectorStatusColor } from '../../services/riskService';

interface TimeWarpViewProps {
  events: HistoricalEvent[];
  sectors: ForestSector[];
  selectedSector: ForestSector;
  onSelectSector: (sector: ForestSector) => void;
  layers: LayerVisibilityState;
  sarActive: boolean;
  infrastructureAssets: InfrastructureAsset[];
}

export const TimeWarpView: React.FC<TimeWarpViewProps> = ({
  events,
  sectors,
  selectedSector,
  onSelectSector,
  layers,
  sarActive,
  infrastructureAssets,
}) => {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const currentEvent = events[currentEventIndex] || events[0];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const currentStep: TimeWarpStep = currentEvent.steps[currentStepIndex] || currentEvent.steps[0];

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 2800 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < currentEvent.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentEvent.steps.length, playbackSpeed]);

  const handleSelectEvent = (idx: number) => {
    setCurrentEventIndex(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepJump = (idx: number) => {
    setCurrentStepIndex(idx);
    setIsPlaying(false);
  };

  const stepColor = getSectorStatusColor(currentStep.riskLevel);

  // Time Warp progression styling according to Botanical Amber specification:
  // T-48H: Forest Green (#526B45)
  // T-36H: Sage (#87946C)
  // T-24H: Amber (#E58A3A)
  // T-12H: Burnt Orange (#C95D35)
  // T-0: Deep Fire (#96382E)
  const getTimelineStageTheme = (label: string, stepId: string) => {
    if (stepId === 'EVENT' || label.includes('T-0')) {
      return {
        accent: '#96382E',
        bgSelected: 'bg-[#96382E]/15 border-[#96382E] shadow-sm',
        text: 'text-[#96382E]',
        badge: 'bg-[#96382E] text-white',
        border: 'border-[#96382E]',
        indicator: 'bg-[#96382E]',
      };
    }
    if (label.includes('12H')) {
      return {
        accent: '#C95D35',
        bgSelected: 'bg-[#C95D35]/15 border-[#C95D35] shadow-sm',
        text: 'text-[#C95D35]',
        badge: 'bg-[#C95D35] text-white',
        border: 'border-[#C95D35]',
        indicator: 'bg-[#C95D35]',
      };
    }
    if (label.includes('24H')) {
      return {
        accent: '#E58A3A',
        bgSelected: 'bg-[#E58A3A]/15 border-[#E58A3A] shadow-sm',
        text: 'text-[#E58A3A]',
        badge: 'bg-[#E58A3A] text-white',
        border: 'border-[#E58A3A]',
        indicator: 'bg-[#E58A3A]',
      };
    }
    if (label.includes('36H')) {
      return {
        accent: '#87946C',
        bgSelected: 'bg-[#87946C]/20 border-[#87946C] shadow-sm',
        text: 'text-[#526B45]',
        badge: 'bg-[#87946C] text-white',
        border: 'border-[#87946C]',
        indicator: 'bg-[#87946C]',
      };
    }
    // Default / T-48H
    return {
      accent: '#526B45',
      bgSelected: 'bg-[#526B45]/15 border-[#526B45] shadow-sm',
      text: 'text-[#526B45]',
      badge: 'bg-[#526B45] text-white',
      border: 'border-[#526B45]',
      indicator: 'bg-[#526B45]',
    };
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21] select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & HISTORICAL SCENARIO PICKER
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 py-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <History className="w-3.5 h-3.5 text-[#526B45]" />
              <span>RETROSPECTIVE REPLAY ENGINE · PRE-IGNITION TIME WARP</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight mt-1">
              Pre-Ignition Time Warp
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-3xl leading-relaxed">
              Replay changing fuel conditions before a historical fire event. Demonstrating how
              orbital radar dielectric drying reveals pre-ignition risk 48 hours prior to ignition.
            </p>
          </div>

          {/* Historical Event Switcher */}
          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <span className="text-[#69766A] uppercase text-[10px] font-semibold">SCENARIO:</span>
            <select
              value={currentEventIndex}
              onChange={(e) => handleSelectEvent(Number(e.target.value))}
              className="bg-[#E8EDE2] text-xs text-[#1E2A21] font-semibold border border-[#D3D7C9] rounded-lg px-3 py-2 focus:outline-none focus:border-[#526B45] cursor-pointer"
            >
              {events.map((ev, i) => (
                <option key={ev.id} value={i}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Replay State Banner */}
        <div className="mt-4 p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStep.stepId === 'EVENT'
                  ? 'bg-[#96382E] animate-ping'
                  : currentStep.riskLevel === 'CRITICAL'
                  ? 'bg-[#96382E]'
                  : currentStep.riskLevel === 'HIGH'
                  ? 'bg-[#C95D35]'
                  : currentStep.riskLevel === 'ELEVATED'
                  ? 'bg-[#E58A3A]'
                  : 'bg-[#526B45]'
              }`}
            ></span>
            <span className="text-[#263D2C] font-bold text-sm tracking-wide">
              {currentStep.headline}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#69766A] shrink-0">
            <span className="text-[#C95D35] font-bold">KEY FINDING:</span>
            <span className="text-[#1E2A21]">Elevated fuel volatility was visible before the historical ignition event.</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAP VIEWPORT (WHERE?)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[460px] lg:h-[500px] shrink-0 border-b border-[#D3D7C9] bg-[#ECE5D6]">
        <GeospatialTerrainMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          layers={layers}
          sarActive={sarActive}
          timeWarpStep={currentStep}
          pitch={38}
          bearing={18}
          zoom={11.8}
          infrastructureAssets={infrastructureAssets}
        />

        {/* Quiet, Clean Telemetry Strip (Top Left of Map) */}
        <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#F7F4EC]/95 border border-[#D3D7C9] backdrop-blur-md font-mono text-xs z-10 shadow-lg flex items-center gap-5 text-[#1E2A21]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#69766A] uppercase font-semibold">PHASE:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${stepColor.bg} ${stepColor.text} border ${stepColor.border}`}
            >
              {currentStep.label} · {currentStep.riskLevel}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 border-l border-[#D3D7C9] pl-4">
            <span className="text-lg font-bold text-[#263D2C] tabular-nums">
              {currentStep.fuelVolatility}
            </span>
            <span className="text-[10px] text-[#69766A] uppercase">VOLATILITY</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] border-l border-[#D3D7C9] pl-4 text-[#1E2A21]">
            <div>
              <span className="text-[#69766A]">Moisture: </span>
              <span className="text-[#526B45] font-bold">{currentStep.moistureAnomaly}%</span>
            </div>
            <div>
              <span className="text-[#69766A]">VPD: </span>
              <span className="text-[#C95D35] font-bold">{currentStep.vpd} kPa</span>
            </div>
            <div>
              <span className="text-[#69766A]">SAR Delta: </span>
              <span className="text-[#E58A3A] font-bold">{currentStep.sarAnomalyDb} dB</span>
            </div>
          </div>
        </div>

        {/* Historical Ignition Confirmation Badge */}
        {currentStep.ignitionActive && (
          <div className="absolute top-4 right-4 p-3.5 rounded-xl bg-[#96382E]/15 border border-[#96382E] backdrop-blur-md font-mono text-xs z-10 shadow-xl max-w-sm">
            <div className="flex items-center gap-2 text-[#96382E] font-bold text-xs">
              <Flame className="w-4 h-4 text-[#96382E]" />
              <span>HISTORICAL IGNITION RECORDED</span>
            </div>
            <p className="text-[11px] text-[#1E2A21] mt-1 leading-relaxed">
              NASA FIRMS detected ignition at coordinate [60, 48]. Radar dielectric decline indicated
              acute pre-ignition volatility 48 hours prior to active combustion.
            </p>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. TIMELINE CONTROLLER & PROGRESSION CARDS (WHEN?)
          ───────────────────────────────────────────────────────────── */}
      <section className="p-6 lg:p-8 bg-[#F7F4EC] border-t border-[#D3D7C9] shrink-0 space-y-6">
        {/* Playback Controls & Timestamp Readout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-10 px-4 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              title={isPlaying ? 'Pause Timeline' : 'Play Timeline Progression'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-xs font-mono">{isPlaying ? 'PAUSE' : 'PLAY REPLAY'}</span>
            </button>

            <button
              onClick={() => handleStepJump(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="h-10 px-3 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] border border-[#D3D7C9] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                handleStepJump(Math.min(currentEvent.steps.length - 1, currentStepIndex + 1))
              }
              disabled={currentStepIndex === currentEvent.steps.length - 1}
              className="h-10 px-3 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] border border-[#D3D7C9] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleStepJump(0)}
              className="h-10 px-3 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#526B45] hover:text-[#263D2C] border border-[#D3D7C9] transition-colors cursor-pointer"
              title="Restart from T-48H"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
              className="h-10 px-3 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-xs font-mono text-[#526B45] font-semibold hover:bg-[#DDE5D7] cursor-pointer"
            >
              {playbackSpeed}x SPEED
            </button>
          </div>

          <div className="text-xs font-mono text-[#69766A]">
            <span>ACTIVE TIMESTEP: </span>
            <span className="text-[#263D2C] font-bold">{currentStep.timestamp}</span>
          </div>
        </div>

        {/* 6 Step Progression Cards (Botanical Color Progression) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {currentEvent.steps.map((st, i) => {
            const isSelected = i === currentStepIndex;
            const theme = getTimelineStageTheme(st.label, st.stepId);

            return (
              <button
                key={st.stepId}
                onClick={() => handleStepJump(i)}
                className={`p-4 rounded-xl border text-left transition-all font-mono relative cursor-pointer ${
                  isSelected
                    ? `${theme.bgSelected} shadow-md`
                    : 'bg-[#F1EBDD] border-[#D3D7C9] text-[#69766A] hover:text-[#1E2A21] hover:bg-[#E8EDE2]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span
                    className={`font-bold ${
                      isSelected ? theme.text : 'text-[#263D2C]'
                    }`}
                  >
                    {st.label}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  ></span>
                </div>
                <div className="text-2xl font-bold text-[#1E2A21] tabular-nums tracking-tight">
                  {st.fuelVolatility}
                </div>
                <div className="text-[11px] text-[#69766A] mt-1 truncate font-medium">{st.riskLevel}</div>
                {isSelected && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl ${theme.indicator}`}
                  ></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Analytical Step Narrative */}
        <div className="p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] text-xs font-mono text-[#1E2A21] flex items-start gap-3">
          <Activity className="w-4 h-4 text-[#526B45] mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <span className="text-[#263D2C] font-bold">{currentStep.label} Progression: </span>
            <span className="text-[#1E2A21]">{currentStep.summary}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
