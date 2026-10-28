import React, { useState } from 'react';
import { Layers, Play, Info, Sparkles } from 'lucide-react';
import { HTTP_METHODS_INFO, type MethodInfo } from '../data/mockData';
import type { Order } from '../types';

interface HttpMethodsExplorerProps {
  orders: Order[];
  onTriggerMethod: (method: string, targetId?: number) => void;
  isSimulating: boolean;
}

export const HttpMethodsExplorer: React.FC<HttpMethodsExplorerProps> = ({
  orders,
  onTriggerMethod,
  isSimulating,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<MethodInfo>(HTTP_METHODS_INFO[0]);
  const [targetOrderId, setTargetOrderId] = useState<number>(orders[0]?.id || 101);

  const isOrderSpecific = selectedMethod.endpoint.includes(':id');

  const handleRun = () => {
    onTriggerMethod(selectedMethod.method, isOrderSpecific ? targetOrderId : undefined);
  };

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-darkborder/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-brand-blue border border-blue-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              HTTP Methods Explorer
            </h3>
            <p className="text-[11px] text-slate-400">
              Pelajari semantik GET, POST, PUT, PATCH, dan DELETE
            </p>
          </div>
        </div>
      </div>

      {/* Method Badges Selector */}
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-darkpanel2 rounded-xl border border-darkborder mb-4">
        {HTTP_METHODS_INFO.map((item) => {
          const isSelected = selectedMethod.method === item.method && selectedMethod.endpoint === item.endpoint;
          return (
            <button
              key={`${item.method}-${item.endpoint}`}
              onClick={() => setSelectedMethod(item)}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{item.method}</span>
            </button>
          );
        })}
      </div>

      {/* Method Details Card */}
      <div className="flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-3">
          {/* Endpoint Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${selectedMethod.badgeColor}`}>
                {selectedMethod.method}
              </span>
              <span className="text-slate-300 font-semibold">{selectedMethod.endpoint}</span>
            </div>
            {isOrderSpecific && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">ID:</span>
                <select
                  value={targetOrderId}
                  onChange={(e) => setTargetOrderId(Number(e.target.value))}
                  disabled={isSimulating}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-blue-300 focus:outline-none"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} ({o.customer})
                    </option>
                  ))}
                  <option value={999}>#999 (Non-Existent / 404)</option>
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-xs text-slate-300 leading-relaxed bg-darkpanel2/70 p-3 rounded-xl border border-darkborder/70">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Semantik Teknis:</span>
            </div>
            <p>{selectedMethod.description}</p>
          </div>

          {/* Analogy */}
          <div className="text-xs text-amber-200 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Analogi Restoran:</span>
            </div>
            <p>{selectedMethod.analogy}</p>
          </div>

          {/* Payload Preview (if method has payload) */}
          {selectedMethod.defaultPayload && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                Contoh Request Body (JSON):
              </span>
              <pre className="text-[11px] font-mono text-emerald-400 max-h-24 overflow-y-auto">
                {JSON.stringify(selectedMethod.defaultPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleRun}
          disabled={isSimulating}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulasikan {selectedMethod.method} {isOrderSpecific ? `Order #${targetOrderId}` : selectedMethod.endpoint}</span>
        </button>
      </div>
    </div>
  );
};
