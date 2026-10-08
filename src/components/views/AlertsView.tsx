import React, { useState } from 'react';
import {
  SystemAlert,
} from '../../types/intelligence';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  ArrowRight,
  Filter,
  ShieldAlert,
  Clock,
} from 'lucide-react';

interface AlertsViewProps {
  alerts: SystemAlert[];
  onSelectSectorById: (sectorId: string) => void;
  onNavigateToPipeline?: () => void;
  onMarkAllRead: () => void;
  onMarkAlertRead: (alertId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectSectorById,
  onNavigateToPipeline,
  onMarkAllRead,
  onMarkAlertRead,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'INFO'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const infoCount = alerts.filter((a) => a.severity === 'INFO').length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q) ||
        (alert.sectorId && alert.sectorId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F1EBDD] text-[#1E2A21] font-mono select-none">
      {/* Top Header */}
      <section className="px-6 lg:px-8 pt-6 pb-5 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#526B45] animate-pulse"></span>
              <span>OPERATIONS LOG · INCIDENT & RISK TELEMETRY</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#263D2C] tracking-tight mt-1">
              Alerts Center
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-2xl leading-relaxed">
              Real-time volatility threshold breaches, critical infrastructure exposure warnings,
              and automated telemetry notifications across monitored forest zones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onMarkAllRead}
              className="px-3.5 py-2 rounded-lg bg-[#E8EDE2] hover:bg-[#DDE5D7] text-[#263D2C] text-xs font-semibold border border-[#D3D7C9] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#526B45]" />
              <span>MARK ALL AS READ</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#69766A] uppercase tracking-widest font-semibold">
              TOTAL ALERTS
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#263D2C] tabular-nums tracking-tight">
                {alerts.length}
              </span>
              <span className="text-xs text-[#69766A]">Events</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1 font-sans">
              {unreadCount} unread incident logs
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#96382E]/10 border border-[#96382E]/40 shadow-xs">
            <div className="text-[10px] text-[#96382E] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#96382E] animate-ping"></span>
              <span>CRITICAL SEVERITY</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#96382E] tabular-nums tracking-tight">
                {criticalCount}
              </span>
              <span className="text-xs text-[#96382E] font-semibold">Active</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1 font-sans">Immediate response required</div>
          </div>

          <div className="p-4 rounded-xl bg-[#C95D35]/10 border border-[#C95D35]/40 shadow-xs">
            <div className="text-[10px] text-[#C95D35] uppercase tracking-widest font-semibold">
              HIGH RISK WARNINGS
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#C95D35] tabular-nums tracking-tight">
                {highCount}
              </span>
              <span className="text-xs text-[#C95D35] font-semibold">Elevated</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1 font-sans">Canopy desiccation trends</div>
          </div>

          <div className="p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] shadow-xs">
            <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-semibold">
              TELEMETRY & INFO
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#526B45] tabular-nums tracking-tight">
                {infoCount}
              </span>
              <span className="text-xs text-[#526B45] font-semibold">Syncs</span>
            </div>
            <div className="text-[11px] text-[#69766A] mt-1 font-sans">Satellite orbit ingest nominal</div>
          </div>
        </div>
      </section>

      {/* Main Filter & List Section */}
      <section className="p-6 lg:px-8 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F4EC] p-3 rounded-xl border border-[#D3D7C9] shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#69766A] uppercase tracking-wider font-semibold mr-1 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#526B45]" />
              <span>SEVERITY:</span>
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'INFO'] as const).map((sev) => {
              const isSelected = filterSeverity === sev;
              return (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? sev === 'CRITICAL'
                        ? 'bg-[#96382E] text-white shadow-xs'
                        : sev === 'HIGH'
                        ? 'bg-[#C95D35] text-white shadow-xs'
                        : sev === 'INFO'
                        ? 'bg-[#526B45] text-white shadow-xs'
                        : 'bg-[#263D2C] text-[#F1EBDD] shadow-xs'
                      : 'bg-[#E8EDE2] text-[#69766A] hover:text-[#1E2A21] border border-[#D3D7C9]'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search alerts or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#F1EBDD] text-xs text-[#1E2A21] border border-[#D3D7C9] placeholder-[#69766A] focus:outline-none focus:border-[#526B45]"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-[#F7F4EC] border border-[#D3D7C9]">
              <div className="w-10 h-10 rounded-full bg-[#E8EDE2] text-[#69766A] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#263D2C]">No Alerts Match Criteria</div>
              <p className="text-xs text-[#69766A] mt-1 font-sans">
                All systems operating within acceptable fuel volatility baselines.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isHigh = alert.severity === 'HIGH';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCrit
                      ? 'bg-[#96382E]/10 border-[#96382E]/40 hover:border-[#96382E] shadow-sm'
                      : isHigh
                      ? 'bg-[#C95D35]/10 border-[#C95D35]/40 hover:border-[#C95D35] shadow-xs'
                      : 'bg-[#F7F4EC] border-[#D3D7C9] hover:border-[#BFC8B7]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#D3D7C9]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-md ${
                          isCrit
                            ? 'bg-[#96382E]/20 text-[#96382E] border border-[#96382E]/40'
                            : isHigh
                            ? 'bg-[#C95D35]/20 text-[#C95D35] border border-[#C95D35]/40'
                            : 'bg-[#526B45]/20 text-[#526B45] border border-[#526B45]/40'
                        }`}
                      >
                        {isCrit ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : isHigh ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold tracking-wider uppercase ${
                          isCrit ? 'text-[#96382E]' : isHigh ? 'text-[#C95D35]' : 'text-[#526B45]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-[#69766A] font-normal">[{alert.id}]</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#69766A]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#69766A]" />
                        <span>{alert.timestamp}</span>
                      </span>
                      {!alert.isRead ? (
                        <button
                          onClick={() => onMarkAlertRead(alert.id)}
                          className="px-2 py-0.5 rounded bg-[#E58A3A]/20 text-[#C95D35] border border-[#E58A3A]/40 text-[10px] font-bold hover:bg-[#E58A3A]/30 transition-colors cursor-pointer"
                        >
                          UNREAD
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#69766A] font-bold">READ</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-display font-bold text-[#263D2C]">{alert.title}</h3>
                    <p className="text-xs text-[#1E2A21] mt-1 leading-relaxed font-sans">{alert.message}</p>
                  </div>

                  {/* Actions & Deep Dive Links */}
                  <div className="mt-3 pt-3 border-t border-[#D3D7C9] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {alert.sectorId && (
                        <span className="px-2 py-1 rounded bg-[#E8EDE2] text-[#263D2C] border border-[#D3D7C9] text-[11px]">
                          Target: <strong className="text-[#263D2C]">{alert.sectorId}</strong>
                        </span>
                      )}
                      {alert.message.toLowerCase().includes('pipeline') && (
                        <span className="px-2 py-1 rounded bg-[#C95D35]/15 text-[#C95D35] border border-[#C95D35]/30 text-[11px]">
                          Corridor: <strong>P-18 / V17–V18</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {alert.sectorId && (
                        <button
                          onClick={() => onSelectSectorById(alert.sectorId!)}
                          className="px-3 py-1.5 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] border border-[#D3D7C9] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Inspect Sector</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onNavigateToPipeline && alert.message.toLowerCase().includes('pipeline') && (
                        <button
                          onClick={onNavigateToPipeline}
                          className="px-3 py-1.5 rounded-lg bg-[#C95D35] hover:bg-[#A84B29] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Pipeline Triage</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
