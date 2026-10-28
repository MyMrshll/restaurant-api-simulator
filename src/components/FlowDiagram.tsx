import React from 'react';
import {
  User,
  Radio,
  Cpu,
  Database,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { PipelineNodeId, SimulationStep } from '../types';

interface FlowDiagramProps {
  currentStepIndex: number;
  steps: SimulationStep[];
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onResetStep: () => void;
  speed: number;
  onToggleSpeed: () => void;
}

interface NodeMeta {
  id: PipelineNodeId;
  label: string;
  sub: string;
  analogy: string;
  icon: React.ReactNode;
}

const NODES: NodeMeta[] = [
  {
    id: 'CLIENT',
    label: 'CLIENT',
    sub: 'Frontend / Browser',
    analogy: 'Pelanggan Meja',
    icon: <User className="w-5 h-5" />,
  },
  {
    id: 'API',
    label: 'API GATEWAY',
    sub: 'HTTP Request Router',
    analogy: 'Pelayan Restoran',
    icon: <Radio className="w-5 h-5" />,
  },
  {
    id: 'BACKEND',
    label: 'BACKEND',
    sub: 'Controller / Business Logic',
    analogy: 'Dapur & Koki',
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: 'DATABASE',
    label: 'DATABASE',
    sub: 'Storage / Persistence',
    analogy: 'Buku Catatan Order',
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 'RESPONSE',
    label: 'RESPONSE',
    sub: 'HTTP Status & Payload',
    analogy: 'Struk & Makanan',
    icon: <ArrowRight className="w-5 h-5" />,
  },
];

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  currentStepIndex,
  steps,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onResetStep,
  speed,
  onToggleSpeed,
}) => {
  const currentStep = steps[currentStepIndex] || steps[0];
  const activeNodeId = currentStep?.nodeId;
  const isErrorStep = currentStep?.isError;

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of the pipeline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-darkborder/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <h2 className="text-base font-semibold text-white tracking-wide uppercase font-mono">
              Visual Pipeline Aliran Data
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Perhatikan bagaimana pesan bergerak dari Pelanggan (Client) ke Dapur (Server) hingga kembali
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-darkpanel2 px-3 py-1.5 rounded-xl border border-darkborder">
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition rounded-lg hover:bg-slate-700/50"
            title="Langkah Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold hover:bg-amber-500/30 transition"
              title="Pause Simulasi"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition shadow-sm shadow-blue-500/20"
              title="Jalankan Otomatis"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </button>
          )}

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition rounded-lg hover:bg-slate-700/50"
            title="Langkah Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-darkborder mx-1" />

          <button
            onClick={onResetStep}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded-lg hover:bg-slate-700/50"
            title="Ulangi Tahap dari Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleSpeed}
            className="px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white rounded bg-slate-800 border border-slate-700 transition"
            title="Ubah Kecepatan Animasi"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Nodes Graph Container */}
      <div className="py-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {NODES.map((node, idx) => {
            const isActive = activeNodeId === node.id;
            const isCompleted = steps.findIndex((s) => s.nodeId === node.id) < currentStepIndex && !isErrorStep;
            const isTargetOfError = isActive && isErrorStep;

            return (
              <div key={node.id} className="relative group">
                <div
                  className={`flex flex-col p-3.5 rounded-xl border transition-all duration-300 ${
                    isTargetOfError
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 scale-[1.02]'
                      : isActive
                      ? 'bg-blue-950/50 border-blue-400 text-white ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20 scale-[1.03]'
                      : isCompleted
                      ? 'bg-slate-800/40 border-emerald-500/30 text-slate-300'
                      : 'bg-darkpanel2/60 border-darkborder/60 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isTargetOfError
                          ? 'bg-rose-500/20 text-rose-400'
                          : isActive
                          ? 'bg-blue-500/20 text-brand-blue animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {node.icon}
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold font-mono tracking-wider block text-slate-200">
                      {node.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      {node.sub}
                    </span>
                  </div>

                  {/* Analogy badge */}
                  <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="text-[10px] text-amber-300 font-medium truncate">
                      🍽️ {node.analogy}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                    )}
                  </div>
                </div>

                {/* Arrow between nodes for desktop */}
                {idx < NODES.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
                      →
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Detailed Card */}
      {currentStep && (
        <div
          className={`p-4 md:p-5 rounded-xl border transition-all ${
            isErrorStep
              ? 'bg-rose-950/20 border-rose-500/40'
              : 'bg-darkpanel2/80 border-darkborder'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                  isErrorStep
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}
              >
                {isErrorStep ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                Tahap {currentStepIndex + 1} dari {steps.length}: [{currentStep.nodeId}]
              </span>
              <h3 className="text-sm md:text-base font-bold text-white">
                {currentStep.title}
              </h3>
            </div>

            <span className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
              Konsep: <span className="text-blue-300">{currentStep.technicalTerm}</span>
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3">
            {currentStep.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-darkborder/60 text-xs">
            {/* Restaurant Analogy */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block text-[11px] uppercase tracking-wider mb-0.5">
                  Analogi Restoran:
                </span>
                <span className="leading-snug">{currentStep.analogy}</span>
              </div>
            </div>

            {/* Checklists / Payload Details */}
            {currentStep.checklists && currentStep.checklists.length > 0 ? (
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider mb-1 font-mono">
                  Langkah Validasi Backend:
                </span>
                <div className="space-y-1">
                  {currentStep.checklists.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                      {item.startsWith('✓') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className={item.startsWith('✓') ? 'text-emerald-300' : 'text-rose-300'}>
                        {item.replace(/^[✓✗]\s*/, '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentStep.payloadSnapshot ? (
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 overflow-x-auto">
                <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider mb-1 font-mono">
                  Data yang Mengalir:
                </span>
                <pre className="text-[11px] font-mono text-blue-300">
                  {typeof currentStep.payloadSnapshot === 'string'
                    ? currentStep.payloadSnapshot
                    : JSON.stringify(currentStep.payloadSnapshot, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-400 flex items-center justify-center text-center">
                <span className="text-[11px]">Tidak ada perubahan data tambahan pada tahap ini</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
