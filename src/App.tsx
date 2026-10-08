import React, { useState } from 'react';
import { TopTelemetryBar } from './components/common/TopTelemetryBar';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { MethodologyModal } from './components/common/MethodologyModal';
import { AlertsDrawer } from './components/common/AlertsDrawer';
import { OpticalVsSARModal } from './components/map/OpticalVsSARModal';
import { CommandCenterView } from './components/views/CommandCenterView';
import { ForestIntelligenceView } from './components/views/ForestIntelligenceView';
import { PipelineIntelligenceView } from './components/views/PipelineIntelligenceView';
import { TimeWarpView } from './components/views/TimeWarpView';
import { InfrastructureView } from './components/views/InfrastructureView';
import { AIAnalystView } from './components/views/AIAnalystView';
import { AlertsView } from './components/views/AlertsView';

import { MONITORED_REGIONS, BANDIPUR_SECTORS } from './data/mockForests';
import { HISTORICAL_EVENTS } from './data/mockTimeWarp';
import { INFRASTRUCTURE_ASSETS } from './data/mockInfrastructure';
import { PIPELINE_NETWORKS } from './data/mockPipelines';
import { INITIAL_ALERTS } from './data/mockAlerts';
import {
  ForestSector,
  LayerVisibilityState,
  SystemAlert,
} from './types/intelligence';
import { Radio, ArrowRight, History, Satellite, Sparkles, ShieldCheck } from 'lucide-react';
import sentinelHeroImg from './assets/images/satellite_sentinel_radar_1790346320999.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [currentRegionId, setCurrentRegionId] = useState<string>('REGION-BANDIPUR');

  const currentRegion =
    MONITORED_REGIONS.find((r) => r.id === currentRegionId) || MONITORED_REGIONS[0];

  // Default selected sector is Sector 07 (South Ridge Crest)
  const [selectedSector, setSelectedSector] = useState<ForestSector>(
    BANDIPUR_SECTORS.find((s) => s.id === 'SEC-07') || BANDIPUR_SECTORS[0]
  );

  const [sarActive, setSarActive] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  const [layers, setLayers] = useState<LayerVisibilityState>({
    forest: true,
    fuelVolatility: true,
    riskZones: true,
    wind: false,
    sarAnomaly: false,
    historicalFires: false,
    pipelines: true,
    isolationValves: true,
    roads: false,
    settlements: false,
    criticalInfrastructure: false,
    sarMoisture: true,
    vpd: true,
    powerInfrastructure: false,
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isOpticalModalOpen, setIsOpticalModalOpen] = useState<boolean>(false);

  // Initial landing banner or briefing modal (can be dismissed)
  const [showWelcomeHero, setShowWelcomeHero] = useState<boolean>(true);

  const handleToggleLayer = (key: keyof LayerVisibilityState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectSectorById = (secId: string) => {
    const found = currentRegion.sectors.find((s) => s.id === secId);
    if (found) {
      setSelectedSector(found);
      setActiveTab('forest-intelligence');
    }
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F1EBDD] text-[#1E2A21] font-sans select-none">
      {/* Persistent Top Telemetry Bar */}
      <TopTelemetryBar
        currentRegion={currentRegion}
        onSelectRegion={(id) => {
          setCurrentRegionId(id);
          const region = MONITORED_REGIONS.find((r) => r.id === id);
          if (region && region.sectors.length > 0) {
            setSelectedSector(region.sectors[0]);
          }
        }}
        regions={MONITORED_REGIONS}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        sarActive={sarActive}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Operations Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (showWelcomeHero) setShowWelcomeHero(false);
          }}
          sarActive={sarActive}
          unreadAlertsCount={unreadAlertsCount}
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          {activeTab === 'command-center' && (
            <CommandCenterView
              currentRegion={currentRegion}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              sarActive={sarActive}
              onToggleSAR={() => setSarActive(!sarActive)}
              infrastructureAssets={INFRASTRUCTURE_ASSETS}
              onNavigateToTimeWarp={() => setActiveTab('time-warp')}
              onNavigateToSectorDeepDive={() => setActiveTab('forest-intelligence')}
              onOpenOpticalComparison={() => setIsOpticalModalOpen(true)}
              onNavigateToPipeline={() => setActiveTab('pipeline-intelligence')}
            />
          )}

          {activeTab === 'forest-intelligence' && (
            <ForestIntelligenceView
              currentRegion={currentRegion}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              sarActive={sarActive}
              onToggleSAR={() => setSarActive(!sarActive)}
              infrastructureAssets={INFRASTRUCTURE_ASSETS}
              onNavigateToTimeWarp={() => setActiveTab('time-warp')}
              onOpenOpticalComparison={() => setIsOpticalModalOpen(true)}
            />
          )}

          {activeTab === 'pipeline-intelligence' && (
            <PipelineIntelligenceView
              networks={PIPELINE_NETWORKS}
              sectors={currentRegion.sectors}
              onOpenTimeWarp={() => setActiveTab('time-warp')}
            />
          )}

          {activeTab === 'time-warp' && (
            <TimeWarpView
              events={HISTORICAL_EVENTS}
              sectors={currentRegion.sectors}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              layers={layers}
              sarActive={sarActive}
              infrastructureAssets={INFRASTRUCTURE_ASSETS}
            />
          )}

          {activeTab === 'infrastructure' && (
            <InfrastructureView
              currentRegion={currentRegion}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              sarActive={sarActive}
              infrastructureAssets={INFRASTRUCTURE_ASSETS}
              onOpenTimeWarp={() => setActiveTab('time-warp')}
              onNavigateToPipeline={() => setActiveTab('pipeline-intelligence')}
            />
          )}

          {activeTab === 'ai-analyst' && (
            <AIAnalystView
              selectedSector={selectedSector}
              allSectors={currentRegion.sectors}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onSelectSectorById={handleSelectSectorById}
              onNavigateToPipeline={() => setActiveTab('pipeline-intelligence')}
              onMarkAllRead={handleMarkAllAlertsRead}
              onMarkAlertRead={(id) => {
                setAlerts((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
                );
              }}
            />
          )}

          {/* Cinematic First-Impression Modal / Landing Screen */}
          {showWelcomeHero && (
            <div
              onClick={() => setShowWelcomeHero(false)}
              className="absolute inset-0 z-40 bg-[#1E2A21]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl overflow-hidden shadow-2xl text-[#1E2A21]"
              >
                {/* Close X Button */}
                <button
                  onClick={() => setShowWelcomeHero(false)}
                  className="absolute top-3 left-3 z-20 p-1.5 rounded-full bg-[#F1EBDD]/90 text-[#263D2C] hover:bg-[#E2E7DA] border border-[#D3D7C9] transition-colors"
                  title="Close modal"
                >
                  <span className="text-xs font-mono font-bold px-1">✕</span>
                </button>

                {/* Orbital Header Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={sentinelHeroImg}
                    alt="Sentinel Satellite Radar Swath"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4EC] via-[#F7F4EC]/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#263D2C] text-[#F1EBDD] font-mono text-[10px] tracking-wider">
                    SENTINEL-1 C-SAR ORBIT
                  </div>
                </div>

                <div className="p-6 pt-2 space-y-4">
                  <div>
                    <div className="text-[11px] font-mono tracking-widest text-[#526B45] uppercase font-bold">
                      ORBITAL WILDFIRE FUEL INTELLIGENCE
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[#263D2C] mt-1">
                      Pyro
                    </h2>
                    <p className="text-sm font-semibold text-[#526B45] mt-1">
                      See wildfire risk before the fire.
                    </p>
                    <p className="text-xs text-[#69766A] mt-1.5 leading-relaxed">
                      Traditional satellites detect fire after ignition. Pyro uses Synthetic
                      Aperture Radar (SAR) backscatter, canopy moisture trends, and Vapor Pressure
                      Deficit (VPD) to identify pre-ignition fuel volatility before a flame starts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-xs font-mono text-[#263D2C] flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E58A3A] shrink-0 animate-ping"></span>
                    <span className="font-semibold">
                      The fire has not started yet. Pyro shows where the forest is becoming
                      vulnerable.
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => setShowWelcomeHero(false)}
                      className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>ENTER COMMAND CENTER</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setShowWelcomeHero(false);
                        setActiveTab('time-warp');
                      }}
                      className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#D3D7C9] cursor-pointer"
                    >
                      <History className="w-4 h-4 text-[#526B45]" />
                      <span>EXPLORE TIME WARP</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Alerts Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onSelectSector={handleSelectSectorById}
        onMarkAllRead={handleMarkAllAlertsRead}
      />

      {/* Optical vs SAR Split-Screen Modal */}
      <OpticalVsSARModal
        isOpen={isOpticalModalOpen}
        onClose={() => setIsOpticalModalOpen(false)}
      />
    </div>
  );
}
