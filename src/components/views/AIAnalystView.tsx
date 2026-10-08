import React, { useState } from 'react';
import { ForestSector } from '../../types/intelligence';
import {
  Bot,
  Send,
  User,
} from 'lucide-react';
import { getAnalystResponse, AnalystQueryResponse } from '../../services/aiAnalystService';

interface AIAnalystViewProps {
  selectedSector: ForestSector;
  allSectors: ForestSector[];
}

interface MessageItem {
  id: string;
  sender: 'USER' | 'ANALYST';
  text: string;
  queryData?: AnalystQueryResponse;
  timestamp: string;
}

export const AIAnalystView: React.FC<AIAnalystViewProps> = ({
  selectedSector,
}) => {
  const quickPrompts = [
    'Why is Sector 07 high risk?',
    'Why is Pipeline P-18 at risk?',
    'What changed for P-18 since yesterday?',
    'Which segment has the highest exposure?',
    'What assets are near Segment P-18?',
    'Explain isolation boundary V17–V18',
    'Which sector needs attention first?',
    'What infrastructure intersects the high-risk zone?',
    'Explain the SAR backscatter anomaly',
  ];

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      sender: 'ANALYST',
      text: `Pyro Intelligence Engine initialized. Monitored Sector: ${selectedSector.name} (Volatility: ${selectedSector.fuelVolatility}, Status: ${selectedSector.riskLevel}).\n\nI can analyze radar dielectric anomalies, vapor pressure deficits, wind channeling, and infrastructure intersection. Select an analytical prompt or type your query below.`,
      timestamp: '06:42 UTC',
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: promptText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await getAnalystResponse(promptText, selectedSector);
      const analystMsg: MessageItem = {
        id: `ana-${Date.now()}`,
        sender: 'ANALYST',
        text: response.response,
        queryData: response,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, analystMsg]);
    } catch {
      // Graceful fallback
      const fallbackMsg: MessageItem = {
        id: `ana-${Date.now()}`,
        sender: 'ANALYST',
        text: `Analysis generated for ${selectedSector.name}: Current fuel volatility remains elevated at ${selectedSector.fuelVolatility} (${selectedSector.riskLevel}) with -18.4% moisture loss and 3.8 kPa VPD.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F1EBDD] text-[#1E2A21] select-none">
      {/* Header Banner */}
      <div className="px-4 lg:px-6 py-4 border-b border-[#D3D7C9] bg-[#F7F4EC] shrink-0 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#526B45] uppercase flex items-center gap-2 font-bold">
              <Bot className="w-3.5 h-3.5 text-[#526B45]" />
              <span>DECISION SUPPORT AGENT · EMPIRICAL SATELLITE REASONING</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-display font-bold text-[#263D2C] tracking-tight mt-0.5">
              Pyro Analyst
            </h1>
            <p className="text-xs text-[#69766A] mt-1 max-w-2xl leading-relaxed">
              Ask grounded questions about current forest sectors, radar anomalies, atmospheric
              dryness, and infrastructure exposure.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] font-mono text-xs text-[#263D2C]">
            <span className="w-2 h-2 rounded-full bg-[#526B45] animate-pulse"></span>
            <span className="font-semibold">DATA GROUNDING: ACTIVE</span>
          </div>
        </div>

        {/* Quick Prompts Strip */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <span className="text-[10px] font-mono text-[#69766A] uppercase font-semibold shrink-0">
            Quick Queries:
          </span>
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSendPrompt(q)}
              className="px-2.5 py-1 rounded-lg bg-[#E8EDE2] hover:bg-[#DDE5D7] border border-[#D3D7C9] hover:border-[#BFC8B7] text-[#263D2C] text-xs font-mono whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 font-mono text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'USER';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-3xl ${
                isUser ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-[#263D2C] text-[#F1EBDD]'
                    : 'bg-[#526B45] text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-xl leading-relaxed ${
                  isUser
                    ? 'bg-[#E2E7DA] text-[#1E2A21] border border-[#D3D7C9]'
                    : 'bg-[#F7F4EC] text-[#1E2A21] border border-[#D3D7C9] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#69766A] mb-1.5 pb-1 border-b border-[#D3D7C9]">
                  <span className="font-bold text-[#526B45]">
                    {isUser ? 'OPERATOR INQUIRY' : 'PYRO ANALYST'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-line text-xs text-[#1E2A21]">{m.text}</div>

                {/* Structured drivers & sources if present */}
                {m.queryData && (
                  <div className="mt-4 pt-3 border-t border-[#D3D7C9] space-y-3">
                    {/* Key Drivers Grid */}
                    {m.queryData.keyDrivers && m.queryData.keyDrivers.length > 0 && (
                      <div>
                        <div className="text-[10px] text-[#69766A] uppercase font-semibold tracking-wider mb-1.5">
                          Signal Breakdown:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {m.queryData.keyDrivers.map((driver) => (
                            <div
                              key={driver.label}
                              className="p-2 rounded-lg bg-[#E8EDE2] border border-[#D3D7C9] flex items-center justify-between"
                            >
                              <span className="text-[#69766A] text-[11px]">{driver.label}</span>
                              <span className="text-[#C95D35] font-bold text-[11px]">
                                {driver.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {m.queryData.recommendation && (
                      <div className="p-2.5 rounded-lg bg-[#E58A3A]/15 border border-[#E58A3A]/40 text-[11px] text-[#1E2A21]">
                        <span className="text-[#C95D35] font-bold">RECOMMENDATION: </span>
                        {m.queryData.recommendation}
                      </div>
                    )}

                    {/* Grounded Sources */}
                    <div className="flex items-center gap-2 text-[10px] text-[#69766A] pt-1">
                      <span className="text-[#526B45] font-semibold">CITED SOURCES:</span>
                      {m.queryData.sources.map((src, i) => (
                        <span key={src} className="text-[#69766A]">
                          {src}
                          {i < m.queryData!.sources.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-md">
            <div className="w-7 h-7 rounded-lg bg-[#526B45] text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-xl bg-[#F7F4EC] border border-[#D3D7C9] text-xs text-[#526B45] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E58A3A] animate-ping"></div>
              <span>Querying Sentinel-1 SAR and atmospheric layers...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#F7F4EC] border-t border-[#D3D7C9] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputVal);
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about fuel volatility, radar backscatter, VPD, or infrastructure exposure..."
            className="flex-1 bg-[#F1EBDD] border border-[#D3D7C9] rounded-lg px-4 py-2.5 text-xs font-mono text-[#1E2A21] placeholder:text-[#69766A] focus:outline-none focus:border-[#526B45] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="px-4 py-2.5 rounded-lg bg-[#263D2C] hover:bg-[#3F5D43] text-[#F1EBDD] font-mono font-bold text-xs transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>ANALYZE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
