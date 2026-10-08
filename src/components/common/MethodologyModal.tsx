import React from 'react';
import { X, ArrowDown, Activity, Satellite, Wind, Flame, CheckCircle, Info } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2A21]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-6 text-[#1E2A21]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D3D7C9]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#526B45] uppercase font-bold">
              Scientific Pipeline & Physics Model
            </div>
            <h2 className="text-xl font-display font-bold text-[#263D2C] mt-0.5">
              Pre-Ignition Fuel Volatility Methodology
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#69766A] hover:text-[#263D2C] bg-[#E8EDE2] hover:bg-[#DDE5D7] rounded-lg border border-[#D3D7C9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] text-sm leading-relaxed text-[#1E2A21]">
            <span className="font-bold text-[#263D2C]">Pyro</span> combines orbital
            radar-derived observations with high-resolution environmental indicators to produce a
            dynamic <span className="text-[#263D2C] font-bold">Fuel Volatility Score</span>. The fire
            has not started yet: the system detects where canopy dielectric moisture depletion and
            atmospheric evaporative demand combine to create heightened pre-ignition vulnerability.
          </div>

          {/* Visual Pipeline Flowchart */}
          <div>
            <div className="text-xs font-mono text-[#69766A] uppercase tracking-wider mb-3 font-semibold">
              Analytical Fusion Pipeline
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F1EBDD] border border-[#D3D7C9] font-mono text-xs">
              <div className="w-full max-w-md p-2.5 rounded-lg bg-[#E8EDE2] border border-[#526B45]/40 text-[#263D2C] flex items-center justify-center gap-2 shadow-xs font-semibold">
                <Satellite className="w-4 h-4 text-[#526B45]" />
                <span>SENTINEL-1 C-SAR (5.405 GHz Active Microwave Swath)</span>
              </div>

              <ArrowDown className="w-4 h-4 text-[#69766A]" />

              <div className="w-full max-w-md p-2.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-[#1E2A21] flex items-center justify-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-[#E58A3A]" />
                <span>RADAR BACKSCATTER &sigma;<sup>0</sup> DELTA (dB Relative to Baseline)</span>
              </div>

              <ArrowDown className="w-4 h-4 text-[#69766A]" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-lg">
                <div className="p-2.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-center text-[11px]">
                  <div className="text-[#526B45] font-bold">DIELECTRIC LOSS</div>
                  <div className="text-[#69766A] mt-0.5">Canopy Foliar Moisture Anomaly</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-center text-[11px]">
                  <div className="text-[#E58A3A] font-bold">ATMOSPHERIC VPD</div>
                  <div className="text-[#69766A] mt-0.5">Vapor Pressure Deficit (kPa)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-center text-[11px]">
                  <div className="text-[#C95D35] font-bold">WIND & TOPOGRAPHY</div>
                  <div className="text-[#69766A] mt-0.5">Ridge Channeling & Gust Velocity</div>
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-[#69766A]" />

              <div className="w-full max-w-md p-2.5 rounded-lg bg-[#E8EDE2] border border-[#526B45]/40 text-[#263D2C] flex items-center justify-center gap-2 font-semibold">
                <Flame className="w-4 h-4 text-[#C95D35]" />
                <span>MULTIVARIATE FUEL VOLATILITY SCORING MODEL</span>
              </div>

              <ArrowDown className="w-4 h-4 text-[#69766A]" />

              <div className="w-full max-w-md p-2.5 rounded-lg bg-[#E2E7DA] border border-[#526B45] text-[#263D2C] flex items-center justify-center gap-2 font-bold shadow-xs">
                <CheckCircle className="w-4 h-4 text-[#526B45]" />
                <span>PRE-IGNITION VOLATILITY MAP (DECISION SUPPORT)</span>
              </div>
            </div>
          </div>

          {/* Physical Basis: Dielectric Permittivity */}
          <div className="p-4 rounded-xl bg-[#E8EDE2] border border-[#D3D7C9] space-y-2 text-xs text-[#1E2A21]">
            <div className="flex items-center gap-2 font-bold text-[#263D2C]">
              <Info className="w-4 h-4 text-[#526B45]" />
              <span>Physical Basis: Radar Dielectric Permittivity</span>
            </div>
            <p className="leading-relaxed font-sans">
              Liquid water possesses an exceptionally high relative dielectric permittivity{' '}
              <span className="font-mono font-bold text-[#526B45]">(&epsilon;<sub>r</sub> &asymp; 80)</span>,
              while dry cellulosic vegetation matter has a very low permittivity{' '}
              <span className="font-mono font-bold text-[#526B45]">(&epsilon;<sub>r</sub> &asymp; 2–4)</span>.
            </p>
            <p className="leading-relaxed text-[#69766A] font-sans">
              As forest canopies dry, dielectric permittivity collapses, reducing C-band microwave
              radar backscatter by 1.5 to 3.0+ dB. Because active radar emits its own microwave
              signals at 5.4 GHz, it penetrates cloud cover and smoke haze that completely blind
              conventional optical satellites.
            </p>
          </div>

          {/* Responsible Positioning */}
          <div className="p-3.5 rounded-xl bg-[#E58A3A]/15 border border-[#E58A3A]/40 text-[11px] font-mono text-[#1E2A21]">
            <span className="text-[#C95D35] font-bold">DECISION SUPPORT BOUNDARY: </span>
            Pyro provides relative pre-ignition hazard intelligence to guide patrol staging
            and utility clearance. It does not predict deterministic point ignition times or
            guarantee causation.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D3D7C9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-[#F1EBDD] bg-[#263D2C] hover:bg-[#3F5D43] rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            DISMISS WINDOW
          </button>
        </div>
      </div>
    </div>
  );
};
