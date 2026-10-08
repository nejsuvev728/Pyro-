import React, { useState, useEffect } from 'react';
import { Radio, Satellite, Bell, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';
import { MonitoredRegion } from '../../types/intelligence';

interface TopTelemetryBarProps {
  currentRegion: MonitoredRegion;
  onSelectRegion: (regionId: string) => void;
  regions: MonitoredRegion[];
  onOpenMethodology: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  sarActive: boolean;
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const TopTelemetryBar: React.FC<TopTelemetryBarProps> = ({
  currentRegion,
  onSelectRegion,
  regions,
  onOpenMethodology,
  onOpenAlerts,
  unreadAlertsCount,
  sarActive,
  demoMode,
  onToggleDemoMode,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().substring(11, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-[#D3D7C9] bg-[#F1EBDD] px-4 lg:px-6 flex items-center justify-between z-30 shrink-0 select-none shadow-[0_1px_3px_rgba(38,61,44,0.05)]">
      {/* Zone 1: Brand title & subtle orbital label */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-[#263D2C] text-[#F1EBDD] shadow-sm">
            <Radio className="w-4 h-4 text-[#E8EDE2]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E58A3A]"></span>
          </div>
          <div>
            <span className="font-display font-bold tracking-wider text-base lg:text-lg text-[#263D2C] flex items-center gap-1.5">
              PYRO
            </span>
          </div>
        </div>

        <div className="hidden xl:flex items-center text-xs text-[#526B45] font-mono pl-3 border-l border-[#D3D7C9] font-medium">
          <span>ORBITAL WILDFIRE FUEL INTELLIGENCE</span>
        </div>
      </div>

      {/* Zone 2: Telemetry status indicators */}
      <div className="hidden md:flex items-center gap-4 lg:gap-5 text-xs font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F7F4EC] border border-[#D3D7C9] text-[#1E2A21]">
          <span className="w-2 h-2 rounded-full bg-[#526B45]"></span>
          <span className="text-[#69766A]">SYSTEM:</span>
          <span className="text-[#526B45] font-bold">ONLINE</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F7F4EC] border border-[#D3D7C9] text-[#1E2A21]">
          <Satellite className={`w-3.5 h-3.5 ${sarActive ? 'text-[#C95D35] animate-spin' : 'text-[#526B45]'}`} />
          <span className="text-[#69766A]">SENSOR:</span>
          <span className={sarActive ? 'text-[#C95D35] font-bold' : 'text-[#263D2C] font-semibold'}>
            SENTINEL-1B (SAR)
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F7F4EC] border border-[#D3D7C9] text-[#1E2A21]">
          <span className="text-[#69766A]">TIME:</span>
          <span className="text-[#263D2C] font-semibold tabular-nums">{utcTime || '06:42:00 UTC'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#1E2A21]">
          <span className="text-[#69766A]">REGION:</span>
          <select
            value={currentRegion.id}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="bg-[#F7F4EC] text-xs font-mono text-[#263D2C] font-semibold border border-[#D3D7C9] rounded px-2 py-1 focus:outline-none focus:border-[#263D2C] cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 3: Actions & Quick triggers */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleDemoMode}
          title={demoMode ? 'Deterministic Demo Mode Active' : 'Live Data Mode'}
          className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors flex items-center gap-1.5 cursor-pointer ${
            demoMode
              ? 'bg-[#E58A3A]/15 border-[#E58A3A]/40 text-[#C95D35] font-bold'
              : 'bg-[#F7F4EC] border-[#D3D7C9] text-[#69766A] hover:text-[#1E2A21]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">DEMO DATA</span>
        </button>

        <button
          onClick={onOpenMethodology}
          className="px-2.5 py-1 text-xs font-medium text-[#263D2C] hover:text-[#1E2A21] bg-[#E2E7DA] hover:bg-[#DDE5D7] border border-[#D3D7C9] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Methodology & Radar Pipeline"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#526B45]" />
          <span className="hidden sm:inline">METHODOLOGY</span>
        </button>

        <button
          onClick={onOpenAlerts}
          className="relative p-1.5 text-[#263D2C] hover:text-[#1E2A21] bg-[#E2E7DA] hover:bg-[#DDE5D7] border border-[#D3D7C9] rounded-md transition-colors cursor-pointer"
          title="Telemetry Alerts"
        >
          <Bell className="w-4 h-4 text-[#263D2C]" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#96382E] text-[10px] font-mono font-bold text-white shadow-sm">
              {unreadAlertsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
