import React, { useState, useRef } from 'react';
import { X, CloudRain, Satellite, Radio } from 'lucide-react';
import cloudyForestImg from '../../assets/images/cloudy_forest_optical_1790346339597.jpg';
import sarRadarImg from '../../assets/images/sar_radar_penetration_1790346357771.jpg';

interface OpticalVsSARModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpticalVsSARModal: React.FC<OpticalVsSARModalProps> = ({ isOpen, onClose }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2A21]/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onPointerUp={handlePointerUp}
    >
      <div className="relative w-full max-w-4xl bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl overflow-hidden text-[#1E2A21] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D3D7C9] bg-[#F7F4EC]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] text-[#526B45]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#526B45] uppercase font-bold">
                Atmospheric Penetration Analysis
              </div>
              <h3 className="text-base font-display font-bold text-[#263D2C]">
                Optical Satellite vs. Synthetic Aperture Radar (SAR)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#69766A] hover:text-[#263D2C] bg-[#E8EDE2] hover:bg-[#DDE5D7] rounded-lg border border-[#D3D7C9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Split View Area */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-[420px] bg-[#ECE5D6] overflow-hidden cursor-ew-resize select-none"
        >
          {/* Right Layer (SAR Microwave Radar) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={sarRadarImg}
              alt="SAR Microwave Radar Penetration"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Telemetry overlays */}
            <div className="absolute top-4 right-4 p-3.5 rounded-xl bg-[#F7F4EC]/95 border border-[#526B45]/50 backdrop-blur-md text-right font-mono text-xs z-10 shadow-lg text-[#1E2A21]">
              <div className="flex items-center justify-end gap-1.5 text-[#526B45] font-bold">
                <Satellite className="w-4 h-4" />
                <span>SAR INTELLIGENCE</span>
              </div>
              <div className="text-[#263D2C] text-base font-bold mt-1">COVERAGE AVAILABLE</div>
              <div className="text-[#526B45] text-[11px] mt-0.5 font-semibold">5.4 GHz Active Microwave Swath</div>
              <div className="text-[#E58A3A] text-[10px] mt-1 font-bold">Dielectric Anomaly: -2.41 dB</div>
            </div>
          </div>

          {/* Left Layer (Optical Cloud-Covered Imagery) - Clipped by Slider */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-full h-full" style={{ width: '896px' }}>
              <img
                src={cloudyForestImg}
                alt="Optical Satellite Imagery with Cloud Cover"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1E2A21]/20"></div>
            </div>

            {/* Optical Telemetry Overlay */}
            <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-[#F7F4EC]/95 border border-[#D3D7C9] backdrop-blur-md text-left font-mono text-xs z-10 shadow-lg text-[#1E2A21]">
              <div className="flex items-center gap-1.5 text-[#69766A] font-bold">
                <CloudRain className="w-4 h-4 text-[#526B45]" />
                <span>OPTICAL SATELLITE (RGB)</span>
              </div>
              <div className="text-[#C95D35] text-base font-bold mt-1">VISIBILITY: 8%</div>
              <div className="text-[#69766A] text-[11px] mt-0.5">Thick Cloud & Smoke Obscuration</div>
              <div className="text-[#69766A] text-[10px] mt-1">Canopy Blinded Under 92% Cloud Cover</div>
            </div>
          </div>

          {/* Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#263D2C] z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div
              onPointerDown={handlePointerDown}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#F7F4EC] border-2 border-[#263D2C] text-[#263D2C] flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#F7F4EC]/95 border border-[#D3D7C9] text-[#1E2A21] text-[11px] font-mono backdrop-blur-md z-10 pointer-events-none shadow-md">
            Drag slider left or right to compare optical vs. radar penetration
          </div>
        </div>

        {/* Footer Explanation Note */}
        <div className="p-4 bg-[#F7F4EC] border-t border-[#D3D7C9] flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-[#69766A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#526B45]"></span>
            <span className="text-[#1E2A21] font-semibold">
              Cloud cover does not prevent radar observation.
            </span>
            <span className="hidden lg:inline text-[#69766A]">
              Active C-band microwaves transmit through meteorological vapor.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-bold text-[#F1EBDD] bg-[#263D2C] hover:bg-[#3F5D43] rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            CLOSE COMPARISON
          </button>
        </div>
      </div>
    </div>
  );
};
