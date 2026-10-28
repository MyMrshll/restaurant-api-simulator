import React from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  User,
  Radio,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { PipelineNodeId, SimulationStep } from '../types';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  steps: SimulationStep[];
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  currentStepIndex,
  steps,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
}) => {
  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const activeNodeId = currentStep?.nodeId;

  const nodeIcons: Record<PipelineNodeId, React.ReactNode> = {
    CLIENT: <User className="w-8 h-8" />,
    API: <Radio className="w-8 h-8" />,
    BACKEND: <Cpu className="w-8 h-8" />,
    DATABASE: <Database className="w-8 h-8" />,
    RESPONSE: <ArrowRight className="w-8 h-8" />,
  };

  const nodeAnalogies: Record<PipelineNodeId, string> = {
    CLIENT: 'Pelanggan Meja (User)',
    API: 'Pelayan (Perantara & Kontrak)',
    BACKEND: 'Dapur Koki (Logika Bisnis)',
    DATABASE: 'Buku Catatan Bon (Storage)',
    RESPONSE: 'Struk & Makanan Balasan',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14]/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-12 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-sm font-bold tracking-wider">
            PRESENTATION MODE — HIMA TI 2026
          </div>
          <span className="text-slate-400 text-sm hidden sm:inline">
            Media Belajar Interaktif REST API
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
        >
          <X className="w-4 h-4" />
          <span>Tutup Mode Presentasi</span>
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="my-auto py-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Giant 5-Nodes Visualization Bar */}
        <div className="grid grid-cols-5 gap-4">
          {(['CLIENT', 'API', 'BACKEND', 'DATABASE', 'RESPONSE'] as PipelineNodeId[]).map(
            (node, idx) => {
              const isActive = activeNodeId === node;
              const isPast =
                steps.findIndex((s) => s.nodeId === node) < currentStepIndex &&
                !currentStep?.isError;

              return (
                <div
                  key={node}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 text-center ${
                    isActive
                      ? currentStep?.isError
                        ? 'bg-rose-950/60 border-rose-500 ring-4 ring-rose-500/40 text-rose-300 scale-105'
                        : 'bg-blue-950/60 border-blue-400 ring-4 ring-blue-500/40 text-white scale-105 shadow-2xl shadow-blue-500/30'
                      : isPast
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 opacity-80'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-50'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl mb-3 ${
                      isActive
                        ? currentStep?.isError
                          ? 'bg-rose-500/30 text-rose-400'
                          : 'bg-blue-500/30 text-brand-blue animate-bounce'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {nodeIcons[node]}
                  </div>

                  <span className="text-base md:text-xl font-bold font-mono tracking-wider">
                    {node}
                  </span>

                  <span className="text-xs md:text-sm text-amber-300 font-medium mt-1">
                    {nodeAnalogies[node]}
                  </span>

                  <span className="text-xs font-mono text-slate-400 mt-1">
                    Tahap 0{idx + 1}
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* Massive Focus Card for the Active Step */}
        {currentStep && (
          <div
            className={`p-8 rounded-3xl border-2 shadow-2xl transition-all ${
              currentStep.isError
                ? 'bg-rose-950/30 border-rose-500'
                : 'bg-slate-900/90 border-blue-500/50'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono font-bold text-sm tracking-wide">
                  LANGKAH {currentStepIndex + 1} / {steps.length}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {currentStep.title}
                </h2>
              </div>

              <div className="px-4 py-1.5 rounded-xl bg-slate-800 text-blue-300 font-mono text-sm border border-slate-700">
                {currentStep.technicalTerm}
              </div>
            </div>

            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-6 font-sans">
              {currentStep.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
              {/* Analogy Box */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                    Analogi Dunia Nyata:
                  </h4>
                  <p className="text-base md:text-lg leading-snug">
                    {currentStep.analogy}
                  </p>
                </div>
              </div>

              {/* Data / Code Snapshot Box */}
              <div className="p-5 rounded-2xl bg-black/60 border border-slate-800 text-slate-200 font-mono text-sm overflow-x-auto">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Payload & Status Komunikasi:
                </h4>
                {currentStep.checklists ? (
                  <div className="space-y-1.5">
                    {currentStep.checklists.map((c, i) => (
                      <div
                        key={i}
                        className={
                          c.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="text-blue-300 text-xs md:text-sm">
                    {typeof currentStep.payloadSnapshot === 'string'
                      ? currentStep.payloadSnapshot
                      : JSON.stringify(currentStep.payloadSnapshot, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Large Stage Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-5 max-w-6xl mx-auto w-full">
        <button
          onClick={onStepBackward}
          disabled={currentStepIndex <= 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-semibold text-sm transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Tahap Sebelumnya</span>
        </button>

        <div className="flex items-center gap-3">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Presentasi</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Putar Otomatis</span>
            </button>
          )}
        </div>

        <button
          onClick={onStepForward}
          disabled={currentStepIndex >= steps.length - 1}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-semibold text-sm transition"
        >
          <span>Tahap Berikutnya</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
