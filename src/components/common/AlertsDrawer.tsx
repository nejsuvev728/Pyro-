import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, ArrowRight, CheckCheck } from 'lucide-react';
import { SystemAlert } from '../../types/intelligence';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SystemAlert[];
  onSelectSector: (sectorId: string) => void;
  onMarkAllRead: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectSector,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1E2A21]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#F7F4EC] border-l border-[#D3D7C9] p-5 flex flex-col justify-between shadow-2xl text-[#1E2A21]">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D3D7C9]">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#526B45] uppercase font-bold">
                Telemetry Log
              </div>
              <h3 className="text-base font-display font-bold text-[#263D2C]">
                Live Volatility Alerts
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-mono text-[#69766A] hover:text-[#263D2C] flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#526B45]" />
                <span>Clear</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-[#69766A] hover:text-[#1E2A21] rounded hover:bg-[#E2E7DA] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#69766A]">
                NO ACTIVE ALERTS. MONITORED REGION NOMINAL.
              </div>
            ) : (
              alerts.map((alert) => {
                const isCritical = alert.severity === 'CRITICAL';
                const isHigh = alert.severity === 'HIGH';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCritical
                        ? 'bg-[#96382E]/10 border-[#96382E]/40 text-[#1E2A21]'
                        : isHigh
                        ? 'bg-[#C95D35]/10 border-[#C95D35]/40 text-[#1E2A21]'
                        : 'bg-[#E8EDE2] border-[#D3D7C9] text-[#1E2A21]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <div className="flex items-center gap-1.5">
                        {isCritical ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#96382E] shrink-0" />
                        ) : isHigh ? (
                          <AlertCircle className="w-3.5 h-3.5 text-[#C95D35] shrink-0" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-[#526B45] shrink-0" />
                        )}
                        <span
                          className={`font-bold uppercase tracking-wider text-[10px] ${
                            isCritical ? 'text-[#96382E]' : isHigh ? 'text-[#C95D35]' : 'text-[#526B45]'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <span className="text-[#69766A] text-[10px]">{alert.timestamp}</span>
                    </div>

                    <div className="text-xs font-semibold text-[#263D2C]">{alert.title}</div>
                    <p className="text-[11px] text-[#1E2A21] mt-1 leading-relaxed font-sans">
                      {alert.message}
                    </p>

                    {alert.sectorId && (
                      <div className="mt-2.5 pt-2 border-t border-[#D3D7C9] flex justify-end">
                        <button
                          onClick={() => {
                            if (alert.sectorId) onSelectSector(alert.sectorId);
                            onClose();
                          }}
                          className="text-[11px] font-mono text-[#526B45] hover:text-[#263D2C] flex items-center gap-1 group font-semibold cursor-pointer"
                        >
                          <span>Inspect {alert.sectorId}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-[#D3D7C9] text-[11px] font-mono text-[#69766A] flex justify-between">
          <span>SOURCE: TELEMETRY ENGINE</span>
          <span>AUTONOMOUS MONITOR</span>
        </div>
      </div>
    </div>
  );
};
