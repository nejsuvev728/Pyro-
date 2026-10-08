import React, { useState } from 'react';
import { PipelineSegment } from '../../types/intelligence';
import { X, Send, ShieldAlert, CheckCircle2, Bell, AlertTriangle } from 'lucide-react';

interface ReviewAndNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: PipelineSegment;
  onSendAlert: (recipients: string[]) => void;
}

export const ReviewAndNotifyModal: React.FC<ReviewAndNotifyModalProps> = ({
  isOpen,
  onClose,
  segment,
  onSendAlert,
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([
    'Emergency Response Department',
    'Pipeline Operations Control Center',
    'Regional Safety & Forestry Team',
  ]);
  const [isSent, setIsSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const recipientOptions = [
    'Emergency Response Department',
    'Pipeline Operations Control Center',
    'Regional Safety & Forestry Team',
    'Field Inspection Drone Crew (Zone 7)',
  ];

  const toggleRecipient = (name: string) => {
    if (selectedRecipients.includes(name)) {
      setSelectedRecipients(selectedRecipients.filter((r) => r !== name));
    } else {
      setSelectedRecipients([...selectedRecipients, name]);
    }
  };

  const handleConfirmSend = () => {
    setIsSent(true);
    setTimeout(() => {
      onSendAlert(selectedRecipients);
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2A21]/60 backdrop-blur-sm animate-in fade-in duration-200 select-none font-mono">
      <div className="relative w-full max-w-lg bg-[#F7F4EC] border border-[#D3D7C9] rounded-xl shadow-2xl p-6 text-[#1E2A21] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D3D7C9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E58A3A]/15 border border-[#E58A3A]/40 text-[#C95D35]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#526B45] uppercase tracking-widest font-bold">
                OPERATIONAL DECISION SUPPORT
              </div>
              <h3 className="text-base font-display font-bold text-[#263D2C]">
                Emergency Review & Notification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#69766A] hover:text-[#1E2A21] rounded-lg hover:bg-[#E2E7DA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#526B45]/15 border border-[#526B45] text-[#526B45] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <div className="text-base font-bold text-[#263D2C]">ALERT TRANSMITTED</div>
            <div className="text-xs text-[#69766A]">
              Notification dispatched to {selectedRecipients.length} operational recipient groups.
              Status updated to <span className="text-[#526B45] font-bold">NOTIFIED · AWAITING ACTION</span>.
            </div>
          </div>
        ) : (
          <>
            {/* Exposure Parameters */}
            <div className="p-4 rounded-lg bg-[#E2E7DA]/50 border border-[#D3D7C9] text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#69766A]">Target Pipeline:</span>
                <span className="text-[#263D2C] font-bold">{segment.id} · {segment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#69766A]">Exposure Rating:</span>
                <span className="text-[#96382E] font-bold">{segment.assetExposure} / 100 ({segment.riskLevel})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#69766A]">Surrounding Fuel Volatility:</span>
                <span className="text-[#C95D35] font-bold">{segment.fuelVolatility} (Sector {segment.forestSectorId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#69766A]">Configured Isolation Boundary:</span>
                <span className="text-[#263D2C] font-bold">
                  {segment.upstreamValve.id} → {segment.downstreamValve.id} ({segment.affectedLengthKm} km)
                </span>
              </div>
              <div className="pt-2 border-t border-[#D3D7C9]">
                <span className="text-[#526B45] font-bold">Recommended Action:</span>
                <p className="text-[#1E2A21] mt-1 text-[11px] leading-relaxed">
                  Initiate operator-defined emergency protocol: notify emergency personnel, review SCADA
                  operating telemetry, and prepare valves V17–V18 for manual/remote isolation if threat intensifies.
                </p>
              </div>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#263D2C] uppercase tracking-wider">
                Authorized Notification Recipients:
              </div>
              <div className="space-y-1.5">
                {recipientOptions.map((opt) => {
                  const isChecked = selectedRecipients.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleRecipient(opt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs border flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#263D2C] text-[#F1EBDD] border-[#263D2C] font-semibold'
                          : 'bg-[#F7F4EC] border-[#D3D7C9] text-[#69766A] hover:bg-[#E2E7DA]'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`text-[11px] font-bold ${isChecked ? 'text-[#E58A3A]' : 'text-[#69766A]'}`}>
                        {isChecked ? '[SELECTED]' : '[EXCLUDED]'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#D3D7C9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#E2E7DA] hover:bg-[#DDE5D7] text-[#263D2C] text-xs font-semibold border border-[#D3D7C9] transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                disabled={selectedRecipients.length === 0}
                className="px-5 py-2 rounded-lg bg-[#C95D35] hover:bg-[#A84B29] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND EMERGENCY ALERT</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
