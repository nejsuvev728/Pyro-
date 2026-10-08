import React from 'react';
import {
  Compass,
  Trees,
  History,
  Zap,
  Bot,
  Database,
  CheckCircle2,
  Activity,
  Layers,
  ShieldAlert,
  Bell,
} from 'lucide-react';

export type NavigationTab =
  | 'command-center'
  | 'forest-intelligence'
  | 'pipeline-intelligence'
  | 'time-warp'
  | 'infrastructure'
  | 'ai-analyst'
  | 'alerts';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  sarActive: boolean;
  unreadAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  sarActive,
  unreadAlertsCount = 0,
}) => {
  const navItems = [
    {
      id: 'command-center' as NavigationTab,
      label: 'COMMAND CENTER',
      description: 'Overview & Monitored Forests',
      icon: Compass,
    },
    {
      id: 'forest-intelligence' as NavigationTab,
      label: 'FOREST INTELLIGENCE',
      description: 'Sector 3D Twin & SAR Anomaly',
      icon: Trees,
    },
    {
      id: 'pipeline-intelligence' as NavigationTab,
      label: 'PIPELINE INTELLIGENCE',
      description: 'Critical Energy Infrastructure & Valves',
      icon: ShieldAlert,
      badge: 'NEW',
      badgeColor: 'bg-[#C95D35] text-white border-[#C95D35]',
    },
    {
      id: 'time-warp' as NavigationTab,
      label: 'TIME WARP',
      description: 'Pre-Ignition Historical Replay',
      icon: History,
      highlight: true,
    },
    {
      id: 'infrastructure' as NavigationTab,
      label: 'INFRASTRUCTURE',
      description: 'Power & WUI Exposure',
      icon: Zap,
    },
    {
      id: 'ai-analyst' as NavigationTab,
      label: 'AI ANALYST',
      description: 'Grounded Query Assistant',
      icon: Bot,
    },
    {
      id: 'alerts' as NavigationTab,
      label: 'ALERTS',
      description: 'Real-Time Incident Telemetry',
      icon: Bell,
      countBadge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
  ];

  const dataSources = [
    { name: 'Sentinel-1 C-SAR', status: 'ONLINE', latency: '06:42 UTC' },
    { name: 'Open-Meteo NWP', status: 'LIVE', latency: 'Hourly' },
    { name: 'NASA FIRMS', status: 'SYNCED', latency: 'Thermal Baselines' },
    { name: 'Historical Archive', status: 'LOADED', latency: 'Benchmark DB' },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#F1EBDD] border-r border-[#D3D7C9] flex flex-col justify-between shrink-0 select-none z-20 shadow-[1px_0_4px_rgba(38,61,44,0.03)]">
      {/* Navigation section */}
      <div className="p-3 lg:p-4 space-y-6">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-[#526B45] uppercase font-bold px-2 mb-2">
            Operations Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-start gap-3 group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#E2E7DA] border border-[#BFC8B7] text-[#263D2C] shadow-sm font-semibold'
                      : 'text-[#69766A] hover:text-[#1E2A21] hover:bg-[#E8EDE2] border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${
                      isActive ? 'text-[#263D2C]' : 'text-[#526B45] group-hover:text-[#263D2C]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold tracking-wide truncate ${
                          isActive ? 'text-[#263D2C]' : 'text-[#1E2A21]'
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.highlight && (
                        <span className="text-[9px] font-mono text-[#263D2C] bg-[#E8EDE2] px-1.5 py-0.2 rounded border border-[#BFC8B7]">
                          HERO
                        </span>
                      )}
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor || 'bg-[#C95D35] text-white border-[#C95D35]'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.countBadge !== undefined && (
                        <span className="text-[9px] font-mono font-bold text-white bg-[#96382E] px-1.5 py-0.5 rounded-full shadow-sm">
                          {item.countBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#69766A] truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#263D2C] rounded-l"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SAR Status Box */}
        <div className="px-3 py-2.5 rounded-lg bg-[#F7F4EC] border border-[#D3D7C9]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#263D2C] font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#526B45]" />
              SAR VISION
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                sarActive
                  ? 'bg-[#E58A3A]/20 text-[#C95D35] border border-[#E58A3A]/40 animate-pulse'
                  : 'bg-[#E8EDE2] text-[#526B45]'
              }`}
            >
              {sarActive ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <div className="text-[11px] text-[#69766A] mt-1 font-mono leading-tight">
            {sarActive
              ? 'Microwave backscatter anomaly rendering enabled.'
              : 'Switch to SAR view to penetrate canopy moisture loss.'}
          </div>
        </div>
      </div>

      {/* Bottom Data Sources Panel */}
      <div className="p-3 lg:p-4 border-t border-[#D3D7C9] bg-[#E8EDE2]/60">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#526B45] uppercase font-bold mb-2">
          <Database className="w-3 h-3 text-[#263D2C]" />
          <span>DATA SOURCES</span>
        </div>
        <div className="space-y-1.5">
          {dataSources.map((ds) => (
            <div
              key={ds.name}
              className="flex items-center justify-between text-[11px] font-mono py-0.5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#526B45] shrink-0"></span>
                <span className="truncate text-[#1E2A21] font-medium">{ds.name}</span>
              </div>
              <span className="text-[10px] text-[#69766A] shrink-0">{ds.status}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
