import React, { useState } from 'react';
import { Activity, Play } from 'lucide-react';
import { STATUS_CODES_DATA, type StatusCodeItem } from '../data/mockData';

interface StatusCodeVisualizerProps {
  onTriggerStatus: (code: number) => void;
  isSimulating: boolean;
}

export const StatusCodeVisualizer: React.FC<StatusCodeVisualizerProps> = ({
  onTriggerStatus,
  isSimulating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusCodeItem>(STATUS_CODES_DATA[0]);

  const getStatusBadge = (code: number, type: string) => {
    if (type === '2xx') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    if (code === 500) {
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-darkborder/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-brand-yellow border border-amber-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              HTTP Status Code Visualizer
            </h3>
            <p className="text-[11px] text-slate-400">
              Uji coba respons sukses (2xx), kesalahan klien (4xx), dan kesalahan server (5xx)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          8 Skenario Uji
        </span>
      </div>

      {/* Grid of Status Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {STATUS_CODES_DATA.map((item) => {
          const isSelected = selectedStatus.code === item.code;
          return (
            <button
              key={item.code}
              onClick={() => setSelectedStatus(item)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-400 shadow-md ring-1 ring-blue-500/40'
                  : 'bg-darkpanel2/60 border-darkborder/60 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(item.code, item.type)}`}>
                  {item.code}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.phrase}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                {item.triggerLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Status Preview & Trigger */}
      <div className="p-4 rounded-xl bg-darkpanel2/90 border border-darkborder flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedStatus.code, selectedStatus.type)}`}>
              {selectedStatus.code} {selectedStatus.phrase}
            </span>
            <span className="text-xs font-medium text-slate-200">
              {selectedStatus.meaning}
            </span>
          </div>
          <div className="text-xs text-amber-200 flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
              🍽️ Analogi:
            </span>
            <span>{selectedStatus.analogy}</span>
          </div>
        </div>

        <button
          onClick={() => onTriggerStatus(selectedStatus.code)}
          disabled={isSimulating}
          className="shrink-0 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulasikan {selectedStatus.code}</span>
        </button>
      </div>
    </div>
  );
};
