import React, { useState } from 'react';
import {
  Layers,
  Flame,
  Droplets,
  Wind,
  Zap,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Navigation,
  ChevronDown,
  Milestone,
  Home,
  Clock,
  Sliders,
  Trees,
  Shield,
  Activity,
} from 'lucide-react';
import { LayerVisibilityState } from '../../types/intelligence';

interface MapControlsProps {
  layers: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pitch: number;
  onChangePitch: (val: number) => void;
  bearing: number;
  onChangeBearing: (val: number) => void;
  sarActive: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onToggleLayer,
  onResetView,
  onZoomIn,
  onZoomOut,
  pitch,
  onChangePitch,
  bearing,
  onChangeBearing,
  sarActive,
}) => {
  const [layersOpen, setLayersOpen] = useState<boolean>(false);
  const [perspOpen, setPerspOpen] = useState<boolean>(false);

  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 select-none font-mono text-xs">
      {/* Perspective / 3D Tilt Pill */}
      <div className="relative">
        <button
          onClick={() => {
            setPerspOpen(!perspOpen);
            setLayersOpen(false);
          }}
          className={`h-9 px-3 rounded-lg border backdrop-blur-md flex items-center gap-2 transition-colors cursor-pointer shadow-sm ${
            pitch > 0 || perspOpen
              ? 'bg-[#E2E7DA] border-[#BFC8B7] text-[#263D2C] font-semibold'
              : 'bg-[#F7F4EC]/95 border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2]'
          }`}
          title="3D Tilt & Orientation"
        >
          <Navigation
            className="w-3.5 h-3.5 transition-transform text-[#526B45]"
            style={{ transform: `rotate(${bearing}deg)` }}
          />
          <span className="text-[11px] font-medium">{pitch > 0 ? `${pitch}° 3D` : '2D TOP'}</span>
        </button>

        {perspOpen && (
          <div className="absolute right-0 top-11 w-56 p-3.5 rounded-lg bg-[#F7F4EC] border border-[#D3D7C9] shadow-xl space-y-3 z-30 text-[#1E2A21]">
            <div className="flex items-center justify-between text-[11px] text-[#69766A]">
              <span>TERRAIN PITCH</span>
              <span className="text-[#263D2C] font-bold">{pitch}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={pitch}
              onChange={(e) => onChangePitch(Number(e.target.value))}
              className="w-full accent-[#526B45] h-1.5 bg-[#E8EDE2] rounded appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[#D3D7C9] text-[11px]">
              <button
                onClick={() => onChangeBearing((bearing + 45) % 360)}
                className="text-[#526B45] hover:text-[#263D2C] font-medium cursor-pointer"
              >
                Rotate +45°
              </button>
              <button
                onClick={() => {
                  onChangePitch(0);
                  onChangeBearing(0);
                }}
                className="text-[#69766A] hover:text-[#1E2A21] cursor-pointer"
              >
                Reset 2D
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Layers Toggle Button */}
      <div className="relative">
        <button
          onClick={() => {
            setLayersOpen(!layersOpen);
            setPerspOpen(false);
          }}
          className={`h-9 px-3.5 rounded-lg border backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
            layersOpen
              ? 'bg-[#E2E7DA] border-[#BFC8B7] text-[#263D2C] font-semibold'
              : 'bg-[#F7F4EC]/95 border-[#D3D7C9] text-[#263D2C] hover:bg-[#E8EDE2]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#526B45]" />
          <span className="text-[11px] font-medium tracking-wide">LAYERS</span>
          <span className="px-1.5 py-0.2 rounded bg-[#E8EDE2] text-[10px] text-[#263D2C] font-bold border border-[#D3D7C9]">
            {activeLayersCount}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#69766A] transition-transform ${
              layersOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {layersOpen && (
          <div className="absolute right-0 top-11 w-64 p-3 rounded-lg bg-[#F7F4EC] border border-[#D3D7C9] shadow-xl space-y-1.5 z-30 text-[#1E2A21]">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3D7C9] text-[10px] text-[#69766A] font-semibold tracking-wider uppercase">
              <span>MAP LAYERS</span>
              {sarActive && <span className="text-[#C95D35] font-bold">SAR ACTIVE</span>}
            </div>

            <div className="space-y-1 pt-1 max-h-72 overflow-y-auto pr-1">
              {[
                { key: 'forest', label: 'Forest', icon: Trees },
                { key: 'fuelVolatility', label: 'Fuel Volatility', icon: Flame },
                { key: 'riskZones', label: 'Risk Zones', icon: Shield },
                { key: 'wind', label: 'Wind', icon: Wind },
                { key: 'sarAnomaly', label: 'SAR Anomaly', icon: Droplets },
                { key: 'historicalFires', label: 'Historical Fires', icon: Clock },
                { key: 'pipelines', label: 'Pipelines', icon: Activity },
                { key: 'isolationValves', label: 'Isolation Valves', icon: Zap },
                { key: 'roads', label: 'Roads', icon: Milestone },
                { key: 'settlements', label: 'Settlements', icon: Home },
                { key: 'criticalInfrastructure', label: 'Critical Infrastructure', icon: Zap },
              ].map(({ key, label, icon: Icon }) => {
                const isChecked = (layers as any)[key] ?? false;
                return (
                  <button
                    key={key}
                    onClick={() => onToggleLayer(key as any)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-[11px] cursor-pointer ${
                      isChecked
                        ? 'bg-[#526B45]/15 text-[#263D2C] border border-[#526B45]/40 font-bold'
                        : 'text-[#69766A] hover:text-[#1E2A21] hover:bg-[#E8EDE2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-[#526B45]" />
                      <span>{label}</span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {isChecked ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Zoom In/Out & Reset Cluster */}
      <div className="h-9 px-1 rounded-lg bg-[#F7F4EC]/95 border border-[#D3D7C9] backdrop-blur-md flex items-center gap-0.5 shadow-sm text-[#263D2C]">
        <button
          onClick={onZoomIn}
          className="p-1.5 text-[#526B45] hover:text-[#263D2C] rounded hover:bg-[#E8EDE2] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 text-[#526B45] hover:text-[#263D2C] rounded hover:bg-[#E8EDE2] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-[#D3D7C9] mx-0.5"></div>
        <button
          onClick={onResetView}
          className="p-1.5 text-[#526B45] hover:text-[#263D2C] rounded hover:bg-[#E8EDE2] transition-colors cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
