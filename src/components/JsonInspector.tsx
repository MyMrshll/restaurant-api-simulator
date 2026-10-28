import React, { useState } from 'react';
import { Terminal, Copy, Check, Clock, Server, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { HttpRequest, HttpResponse, TimelineEvent } from '../types';

interface JsonInspectorProps {
  request: HttpRequest | null;
  response: HttpResponse | null;
  timeline: TimelineEvent[];
}

export const JsonInspector: React.FC<JsonInspectorProps> = ({
  request,
  response,
  timeline,
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'headers' | 'timeline'>('response');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (status >= 400 && status < 500) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const currentPayloadToCopy = () => {
    if (activeTab === 'request') return JSON.stringify(request?.body || {}, null, 2);
    if (activeTab === 'response') return JSON.stringify(response?.body || {}, null, 2);
    if (activeTab === 'headers') return JSON.stringify({ requestHeaders: request?.headers, responseHeaders: response?.headers }, null, 2);
    return JSON.stringify(timeline, null, 2);
  };

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-darkborder/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-brand-blue border border-blue-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              JSON Request & Response Inspector
            </h3>
            <p className="text-[11px] text-slate-400">
              Periksa struktur data payload, status code, dan network timeline
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => handleCopy(currentPayloadToCopy())}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-darkpanel2 border border-darkborder hover:bg-slate-800 text-xs text-slate-300 transition"
          title="Salin JSON aktif"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Copy JSON'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-darkpanel2 rounded-xl border border-darkborder mb-3">
        <button
          onClick={() => setActiveTab('request')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'request'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
          <span>Request Body</span>
        </button>

        <button
          onClick={() => setActiveTab('response')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'response'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
          <span>Response Body</span>
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'headers'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Headers</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 min-h-[220px] bg-slate-950 rounded-xl p-3.5 border border-slate-900 font-mono text-xs overflow-y-auto">
        {activeTab === 'request' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px]">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                {request?.method || 'POST'}
              </span>
              <span className="text-slate-300">{request?.endpoint || '/orders'}</span>
              <span className="text-slate-500 ml-auto">Content-Type: application/json</span>
            </div>
            {request?.body ? (
              <pre className="text-blue-300 whitespace-pre-wrap">
                {JSON.stringify(request.body, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-500 italic py-4 text-center">
                (Request body kosong — Method {request?.method} tidak memerlukan body)
              </div>
            )}
          </div>
        )}

        {activeTab === 'response' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px]">
              <span className={`px-2 py-0.5 rounded font-bold border ${getStatusColor(response?.status || 200)}`}>
                HTTP/1.1 {response?.status || 200} {response?.statusText || 'OK'}
              </span>
              <span className="text-slate-500 ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3" /> {response?.durationMs || 45}ms
              </span>
            </div>
            {response?.body !== null && response?.body !== undefined ? (
              <pre
                className={`whitespace-pre-wrap ${
                  response && response.status >= 400 ? 'text-rose-300' : 'text-emerald-300'
                }`}
              >
                {JSON.stringify(response.body, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-500 italic py-4 text-center">
                (204 No Content — Respons berhasil dieksekusi tanpa body data kembali)
              </div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4 text-[11px]">
            <div>
              <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                Request Headers
              </span>
              <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300">
                {Object.entries(request?.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-400">{key}:</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                Response Headers
              </span>
              <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300">
                {Object.entries(response?.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-emerald-400">{key}:</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-2">
            <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
              Aliran Waktu Eksekusi (Network Latency Simulator)
            </span>
            <div className="space-y-1.5">
              {timeline.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px]"
                >
                  <span className="text-slate-500 font-mono text-[10px] w-16">{event.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                      event.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : event.status === 'error'
                        ? 'bg-rose-500/20 text-rose-400'
                        : event.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    [{event.node}]
                  </span>
                  <span className="text-slate-300">{event.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
