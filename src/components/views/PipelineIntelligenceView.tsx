import React, { useState } from 'react';
import {
  PipelineNetwork,
  PipelineSegment,
  ForestSector,
  PipelineResponseStatus,
  RiskLevel,
} from '../../types/intelligence';
import { AssetRiskTwinMap } from '../pipeline/3DAssetRiskTwinMap';
import { ReviewAndNotifyModal } from '../pipeline/ReviewAndNotifyModal';
import { getSectorStatusColor } from '../../services/riskService';
import {
  ShieldAlert,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Layers,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  History,
  Send,
  Eye,
} from 'lucide-react';

interface PipelineIntelligenceViewProps {
  networks: PipelineNetwork[];
  sectors: ForestSector[];
  onOpenTimeWarp?: () => void;
}

export const PipelineIntelligenceView: React.FC<PipelineIntelligenceViewProps> = ({
  networks,
  sectors,
  onOpenTimeWarp,
}) => {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('PIPE-C');
  const currentNetwork = networks.find((n) => n.pipeline_id === selectedNetworkId) || networks[2];

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('P-18');
  const currentSegment =
    currentNetwork.segments.find((s) => s.id === selectedSegmentId) ||
    currentNetwork.segments[0];

  const [replayPhase, setReplayPhase] = useState<'t48h' | 't24h' | 'now'>('now');
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
  const [isWhyPanelExpanded, setIsWhyPanelExpanded] = useState<boolean>(true);
  const [isChainExpanded, setIsChainExpanded] = useState<boolean>(false);

  // Dynamically synchronize activeSegment with Time Warp Replay Phase (Requirement 8, 9, 11)
  const activeSegment = React.useMemo(() => {
    if (currentSegment.id === 'P-18') {
      if (replayPhase === 't48h') {
        return {
          ...currentSegment,
          riskLevel: 'LOW' as RiskLevel,
          assetExposure: 42,
          fuelVolatility: 42,
          moistureAnomalyPct: 2.4,
          vpdKpa: 1.9,
          windKmh: 16,
          historicalSimilarityPct: 32,
        };
      } else if (replayPhase === 't24h') {
        return {
          ...currentSegment,
          riskLevel: 'ELEVATED' as RiskLevel,
          assetExposure: 67,
          fuelVolatility: 67,
          moistureAnomalyPct: 11.5,
          vpdKpa: 2.5,
          windKmh: 21,
          historicalSimilarityPct: 58,
        };
      }
    }
    return currentSegment;
  }, [currentSegment, replayPhase]);

  const [responseWorkflowState, setResponseWorkflowState] =
    useState<PipelineResponseStatus>(currentSegment.responseStatus);

  const segmentColor = getSectorStatusColor(activeSegment.riskLevel);

  const handleSendAlert = (recipients: string[]) => {
    setResponseWorkflowState('NOTIFIED');
  };

  const workflowSteps: { state: PipelineResponseStatus; label: string }[] = [
    { state: 'DETECTED', label: 'DETECTED' },
    { state: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
    { state: 'NOTIFIED', label: 'NOTIFIED' },
    { state: 'ISOLATION_REQUESTED', label: 'ISOLATION REQUESTED' },
    { state: 'OPERATOR_AUTHORIZED', label: 'OPERATOR AUTHORIZED' },
    { state: 'RESOLVED', label: 'RESOLVED' },
  ];

  const currentStepIdx = workflowSteps.findIndex((s) => s.state === responseWorkflowState);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21] font-mono select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. OPERATIONAL SUMMARY (NETWORK STATUS)
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 pt-6 pb-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E58A3A]"></span>
              <span>CRITICAL ENERGY INFRASTRUCTURE · PIPELINE WILDFIRE DEFENCE</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight mt-1">
              Pipeline Intelligence
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-2xl leading-relaxed">
              Protect critical energy transport corridors from emerging wildfire conditions.
              Connecting orbital canopy desiccation to asset exposure and operator-configured isolation boundaries.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNotifyModalOpen(true)}
              className="h-10 px-4 text-xs font-bold rounded-lg border border-[#C95D35] bg-[#C95D35] hover:bg-[#A84B29] text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>REVIEW & NOTIFY</span>
            </button>
          </div>
        </div>

        {/* 4 Large Clean Operational KPI Blocks (Requirement 11) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              PIPELINE NETWORK
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold text-[#263D2C] tabular-nums tracking-tight">1,284</span>
              <span className="text-xs text-[#69766A]">km</span>
            </div>
            <div className="text-[11px] text-[#263D2C] font-semibold mt-1">34 Monitored Segments</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              ELEVATED RISK SEGMENTS
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#96382E] tabular-nums tracking-tight">07</span>
              <span className="text-xs text-[#96382E] font-semibold">Elevated Risk Segments</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Intersecting high fuel volatility</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              CRITICAL ASSETS EXPOSED
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#C95D35] tabular-nums tracking-tight">14</span>
              <span className="text-xs text-[#69766A]">Nodes</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Compressors, valves & substations</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
              SEGMENTS REQUIRING REVIEW
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#E58A3A] tabular-nums tracking-tight">03</span>
              <span className="text-xs text-[#C95D35] font-semibold">Segments Requiring Review</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1">Awaiting operator authorization</div>
          </div>
        </div>

        {/* Today's Network Brief & What Changed Strip */}
        <div className="mt-5 p-4 rounded-xl bg-[#E2E7DA]/70 border border-[#D3D7C9] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#526B45] shrink-0" />
            <div>
              <span className="text-[#263D2C] font-bold">TODAY'S NETWORK BRIEF: </span>
              <span className="text-[#1E2A21]">
                1,284 km monitored · 7 segments elevated · 3 require review · 2 significant changes since yesterday.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F7F4EC] px-3.5 py-1.5 rounded-lg border border-[#D3D7C9] shrink-0 shadow-xs">
            <span className="text-[#526B45] font-bold">WHAT CHANGED?</span>
            <div className="flex items-center gap-2">
              <span className="text-[#263D2C] font-bold">{currentSegment.id}:</span>
              <span className="text-[#69766A] line-through">
                {currentSegment.deltaFromYesterday.previousExposure}
              </span>
              <span className="text-[#526B45] font-bold">→</span>
              <span className="text-[#96382E] font-bold">
                {currentSegment.deltaFromYesterday.currentExposure}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#C95D35]">
              {currentSegment.deltaFromYesterday.drivers.map((d) => (
                <span key={d} className="px-1.5 py-0.5 rounded bg-[#E58A3A]/15 border border-[#E58A3A]/30 font-semibold">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MY NETWORK SELECTOR & 3D ASSET RISK TWIN CENTERPIECE
          ───────────────────────────────────────────────────────────── */}
      <section className="p-6 lg:px-8 bg-[#F1EBDD] space-y-4">
        {/* Network Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[#526B45] uppercase tracking-wider font-bold mr-1 shrink-0">
              NETWORK:
            </span>
            {networks.map((net) => {
              const isSelected = net.pipeline_id === selectedNetworkId;
              const color = getSectorStatusColor(net.status);
              return (
                <button
                  key={net.pipeline_id}
                  onClick={() => {
                    setSelectedNetworkId(net.pipeline_id);
                    if (net.segments.length > 0) {
                      setSelectedSegmentId(net.segments[0].id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#263D2C] text-[#F1EBDD] border border-[#263D2C] shadow-sm font-semibold'
                      : 'bg-[#E2E7DA] text-[#263D2C] hover:bg-[#DDE5D7] border border-[#D3D7C9]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span>{net.name.split(' ')[0]} {net.name.split(' ')[1]}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-[#D3D7C9]' : 'text-[#69766A]'}`}>({net.total_length} km)</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-[#E58A3A]' : color.text}`}>[{net.status}]</span>
                </button>
              );
            })}
          </div>

          {/* Time Warp Replay Phase Scrubber for P-18 */}
          <div className="flex items-center gap-1.5 bg-[#F7F4EC] p-1 rounded-lg border border-[#D3D7C9] shrink-0 text-xs shadow-xs">
            <span className="text-[10px] text-[#526B45] px-2 font-bold uppercase">REPLAY:</span>
            <button
              onClick={() => setReplayPhase('t48h')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                replayPhase === 't48h'
                  ? 'bg-[#526B45]/20 text-[#263D2C] border border-[#526B45]/40 font-bold'
                  : 'text-[#69766A] hover:text-[#1E2A21]'
              }`}
            >
              T-48H [42]
            </button>
            <button
              onClick={() => setReplayPhase('t24h')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                replayPhase === 't24h'
                  ? 'bg-[#E58A3A]/20 text-[#C95D35] border border-[#E58A3A]/40 font-bold'
                  : 'text-[#69766A] hover:text-[#1E2A21]'
              }`}
            >
              T-24H [67]
            </button>
            <button
              onClick={() => setReplayPhase('now')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                replayPhase === 'now'
                  ? 'bg-[#96382E]/20 text-[#96382E] border border-[#96382E]/40 font-bold'
                  : 'text-[#69766A] hover:text-[#1E2A21]'
              }`}
            >
              NOW [87]
            </button>
          </div>
        </div>

        {/* 3D Asset Risk Twin Map Viewport */}
        <div className="relative w-full h-[520px] lg:h-[580px] rounded-xl overflow-hidden border border-[#D3D7C9] shadow-sm bg-[#EBE4D5]">
          <AssetRiskTwinMap
            networks={networks}
            selectedPipeline={currentNetwork}
            selectedSegment={activeSegment}
            onSelectSegment={(seg) => setSelectedSegmentId(seg.id)}
            sectors={sectors}
            replayPhase={replayPhase}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ASSET FOCUS MODE & DETAILED SEGMENT INTELLIGENCE
          ───────────────────────────────────────────────────────────── */}
      <section className="p-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F1EBDD] border-t border-[#D3D7C9]">
        {/* Left Column (5 Cols): Selected Segment Metric Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-6 shadow-xs">
          <div className="flex items-start justify-between pb-4 border-b border-[#D3D7C9]">
            <div>
              <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#96382E]"></span>
                <span>ASSET FOCUS MODE · TARGET SEGMENT</span>
              </div>
              <h2 className="text-xl font-display font-bold text-[#263D2C] mt-1">
                {activeSegment.id}
              </h2>
              <div className="text-xs text-[#69766A] mt-0.5">{activeSegment.name}</div>
            </div>
            <div className="text-right shrink-0">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${segmentColor.bg} ${segmentColor.text} border ${segmentColor.border}`}>
                {activeSegment.riskLevel} EXPOSURE
              </span>
            </div>
          </div>

          {/* Critical distinction: Fuel Volatility vs Asset Exposure */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#E2E7DA]/50 border border-[#D3D7C9] text-center">
            <div className="p-2.5 rounded-lg bg-[#F7F4EC] border border-[#D3D7C9]">
              <div className="text-[10px] text-[#526B45] uppercase font-bold">ASSET EXPOSURE</div>
              <div className="text-3xl font-bold text-[#96382E] mt-1 tabular-nums">
                {activeSegment.assetExposure}
              </div>
              <div className="text-[10px] text-[#69766A] mt-0.5">Pipeline vulnerability index</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F7F4EC] border border-[#D3D7C9]">
              <div className="text-[10px] text-[#526B45] uppercase font-bold">FOREST VOLATILITY</div>
              <div className="text-3xl font-bold text-[#C95D35] mt-1 tabular-nums">
                {activeSegment.fuelVolatility}
              </div>
              <div className="text-[10px] text-[#69766A] mt-0.5">Surrounding Sector 07 fuel</div>
            </div>
          </div>

          {/* Segment Telemetry Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">Forest Sector:</span>
              <span className="text-[#263D2C] font-bold">{activeSegment.forestSectorName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">SAR Moisture Anomaly:</span>
              <span className="text-[#526B45] font-bold">+{activeSegment.moistureAnomalyPct}% Drying Deficit</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">Vapor Pressure Deficit (VPD):</span>
              <span className="text-[#C95D35] font-bold">{activeSegment.vpdKpa} kPa</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">Crest Wind Channeling:</span>
              <span className="text-[#87946C] font-bold">{activeSegment.windKmh} km/h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">Historical Pattern Similarity:</span>
              <span className="text-[#263D2C] font-bold">{activeSegment.historicalSimilarityPct}% Correlation</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3D7C9]/60">
              <span className="text-[#69766A]">Affected Pipe Run:</span>
              <span className="text-[#263D2C] font-bold">{activeSegment.affectedLengthKm} km</span>
            </div>
          </div>

          {/* Expandable Why is P-18 at Risk? (Progressive Disclosure) */}
          <div className="p-4 rounded-xl bg-[#E2E7DA]/60 border border-[#D3D7C9] space-y-2.5">
            <button
              onClick={() => setIsWhyPanelExpanded(!isWhyPanelExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#263D2C] group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E58A3A]" />
                <span>WHY IS {currentSegment.id} AT RISK?</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#526B45] transition-transform ${
                  isWhyPanelExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isWhyPanelExpanded && (
              <ul className="space-y-1.5 pt-2 text-[11px] text-[#1E2A21] list-disc list-inside leading-relaxed border-t border-[#D3D7C9]">
                <li>High fuel volatility (91) in surrounding forest canopy of Sector 07.</li>
                <li>Elevated SAR-derived anomaly signal (+18.7% rapid cellular moisture loss).</li>
                <li>High atmospheric drying across the pass with VPD reaching 2.8 kPa.</li>
                <li>Increasing wind exposure (sustained 24 km/h gusts through mountain saddle).</li>
                <li>Pipeline corridor intersects elevated wildfire-risk zone within 0.4 km buffer.</li>
                <li>Historical fire patterns show similar pre-ignition conditions (76% profile similarity).</li>
              </ul>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Isolation Intelligence, Workflow & Story Chain */}
        <div className="lg:col-span-7 space-y-6">
          {/* Isolation Intelligence & Configured Boundary */}
          <div className="p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D3D7C9] gap-2">
              <div>
                <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
                  OPERATOR-DEFINED TOPOLOGY
                </div>
                <h3 className="text-base font-display font-bold text-[#263D2C] mt-0.5">
                  Isolation Intelligence ({currentSegment.id})
                </h3>
              </div>
              <span className="text-[10px] text-[#526B45] bg-[#E2E7DA] px-2.5 py-1 rounded border border-[#BFC8B7] font-semibold">
                Configured Isolation Boundary
              </span>
            </div>

            {/* Clean Horizontal Valve Topology Visualization */}
            <div className="p-4 rounded-xl bg-[#E2E7DA]/50 border border-[#D3D7C9] text-xs">
              <div className="text-[10px] text-[#526B45] uppercase tracking-wider mb-3 font-bold">
                CONFIGURED ISOLATION TOPOLOGY:
              </div>
              <div className="flex items-center justify-between gap-3 text-center">
                {/* Upstream Valve V17 */}
                <div className="flex-1 p-3 rounded-lg bg-[#F7F4EC] border border-[#BFC8B7] text-[#263D2C]">
                  <div className="text-[10px] text-[#69766A]">UPSTREAM VALVE</div>
                  <div className="text-lg font-bold text-[#263D2C] mt-0.5">V17</div>
                  <div className="text-[10px] text-[#526B45] font-semibold mt-1">ARMED REMOTE</div>
                </div>

                {/* Connecting Line representing Segment P-18 */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-center">
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#526B45] via-[#C95D35] to-[#526B45]"></div>
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-[#C95D35]">
                    {currentSegment.id} ({currentSegment.affectedLengthKm} km)
                  </div>
                  <div className="text-[10px] text-[#69766A]">Exposed Segment Run</div>
                </div>

                {/* Downstream Valve V18 */}
                <div className="flex-1 p-3 rounded-lg bg-[#F7F4EC] border border-[#BFC8B7] text-[#263D2C]">
                  <div className="text-[10px] text-[#69766A]">DOWNSTREAM VALVE</div>
                  <div className="text-lg font-bold text-[#263D2C] mt-0.5">V18</div>
                  <div className="text-[10px] text-[#526B45] font-semibold mt-1">ARMED REMOTE</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D3D7C9] text-[11px] text-[#69766A] leading-relaxed">
                <span className="text-[#C95D35] font-bold">OPERATIONAL BOUNDARY NOTE: </span>
                PYRO visualizes operator-configured isolation boundaries for decision support.
                All isolation actions require human operator authorization.
              </div>
            </div>

            {/* Localized Response Visualization: Entire Network vs Affected Segment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#E2E7DA]/50 border border-[#D3D7C9]">
                <div className="text-[10px] text-[#526B45] uppercase font-bold">ENTIRE NETWORK</div>
                <div className="text-lg font-bold text-[#263D2C] mt-1">1,284 km Network</div>
                <div className="text-[11px] text-[#69766A] mt-1">
                  Broad regional wildfire monitoring across 4 transmission corridors.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#96382E]/10 border border-[#96382E]/30">
                <div className="text-[10px] text-[#96382E] uppercase font-bold">AFFECTED ISOLATION FOCUS</div>
                <div className="text-lg font-bold text-[#96382E] mt-1">
                  P-18 (V17 → V18 · 42.6 km)
                </div>
                <div className="text-[11px] text-[#1E2A21] mt-1">
                  Localized asset-level precision eliminates unnecessary regional pipeline shutdowns.
                </div>
              </div>
            </div>
          </div>

          {/* Response Center & Workflow States */}
          <div className="p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3D7C9]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C95D35]" />
                <h3 className="text-base font-display font-bold text-[#263D2C] tracking-wide">
                  Response Center Workflow ({currentSegment.id})
                </h3>
              </div>
              <span className="text-[10px] text-[#526B45] uppercase font-bold">
                OPERATIONAL PIPELINE STATE
              </span>
            </div>

            {/* Workflow Progress Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
              {workflowSteps.map((st, idx) => {
                const isActive = idx === currentStepIdx;
                const isPassed = idx < currentStepIdx;
                return (
                  <div
                    key={st.state}
                    className={`p-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-[#263D2C] text-[#F1EBDD] border-[#263D2C] shadow-sm font-bold'
                        : isPassed
                        ? 'bg-[#526B45]/15 text-[#526B45] border-[#526B45]/40 font-semibold'
                        : 'bg-[#E2E7DA]/60 text-[#69766A] border-[#D3D7C9]'
                    }`}
                  >
                    <div className="truncate">{st.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Operator Recommendations & CTA */}
            <div className="p-4 rounded-xl bg-[#E2E7DA]/50 border border-[#D3D7C9] space-y-3">
              <div className="text-xs font-bold text-[#263D2C]">Recommended Response Protocol:</div>
              <ol className="space-y-1.5 text-[11px] text-[#1E2A21] list-decimal list-inside leading-relaxed">
                {currentSegment.recommendedActions.map((act) => (
                  <li key={act}>{act}</li>
                ))}
              </ol>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#C95D35] hover:bg-[#A84B29] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>REVIEW & NOTIFY</span>
                </button>
              </div>
            </div>
          </div>

          {/* 72-Hour Pipeline Forecast & Satellite Story Chain */}
          <div className="p-6 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3D7C9]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#526B45]" />
                <h3 className="text-base font-display font-bold text-[#263D2C] tracking-wide">
                  72-Hour Pipeline Exposure Trajectory ({currentSegment.id})
                </h3>
              </div>
              <span className="text-[10px] text-[#96382E] font-bold uppercase tracking-wider">
                RISK INCREASING
              </span>
            </div>

            {/* Trajectory Graph for P-18 */}
            <div className="relative w-full h-32">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#D3D7C9" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#D3D7C9" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#D3D7C9" strokeDasharray="3 3" />

                {/* Curve */}
                <path
                  d="M 40,55 L 170,42 L 310,28 L 450,22"
                  fill="none"
                  stroke="#C95D35"
                  strokeWidth="2.5"
                />

                {currentSegment.forecast72h.map((pt, i) => {
                  const x = 40 + i * 135;
                  const y = 80 - (pt.exposure / 100) * 65;
                  return (
                    <g key={pt.time}>
                      <circle cx={x} cy={y} r="4.5" fill="#96382E" stroke="#F7F4EC" strokeWidth="2" />
                      <text x={x} y={y - 8} textAnchor="middle" fill="#263D2C" fontWeight="bold" fontSize="10">
                        {pt.exposure}
                      </text>
                      <text x={x} y="95" textAnchor="middle" fill="#69766A" fontSize="9">
                        {pt.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Expandable Satellite → Asset Story Chain */}
            <div className="pt-2 border-t border-[#D3D7C9]">
              <button
                onClick={() => setIsChainExpanded(!isChainExpanded)}
                className="w-full flex items-center justify-between text-xs text-[#263D2C] hover:text-[#526B45] font-bold cursor-pointer"
              >
                <span>INTELLIGENCE CHAIN: SATELLITE TO ASSET</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isChainExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isChainExpanded && (
                <div className="mt-3 p-3.5 rounded-lg bg-[#E2E7DA]/60 border border-[#D3D7C9] text-[11px] text-[#1E2A21] space-y-1.5 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-1.5 text-[#526B45] font-bold">
                    <span>SENTINEL-1</span>
                    <span>→</span>
                    <span>SAR OBSERVATION</span>
                    <span>→</span>
                    <span>SECTOR 07</span>
                    <span>→</span>
                    <span>ELEVATED MOISTURE SIGNAL</span>
                    <span>→</span>
                    <span>HIGH FUEL VOLATILITY</span>
                    <span>→</span>
                    <span className="text-[#96382E]">P-18 EXPOSED</span>
                    <span>→</span>
                    <span>V17–V18</span>
                    <span>→</span>
                    <span className="text-[#263D2C]">OPERATOR REVIEW</span>
                  </div>
                  <p className="text-[#69766A] text-[10px] mt-1">
                    Continuous C-band microwave radar penetrates cloud canopy, identifying foliar
                    desiccation before surface fires originate. Asset exposure evaluates specific pipeline
                    threat envelopes to guide targeted isolation reviews.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Review & Notification Modal */}
      <ReviewAndNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        segment={currentSegment}
        onSendAlert={handleSendAlert}
      />
    </div>
  );
};
