import React from 'react';
import { Utensils, RotateCcw, Presentation, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onTogglePresentation: () => void;
  onOpenGlossary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onTogglePresentation,
  onOpenGlossary,
}) => {
  return (
    <header className="border-b border-darkborder bg-darkpanel/80 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Titles */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Utensils className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                RESTaurant <span className="text-brand-blue font-mono font-medium">API Simulator</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold tracking-wider">
                HIMA TI 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              "Pesan Makanan, Pahami Cara Kerja API."
            </p>
          </div>
        </div>

        {/* Status Mode & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-darkpanel2 border border-darkborder text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-400">Simulation:</span>
            <span className="text-emerald-400 font-medium">Virtual Memory</span>
          </div>

          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-darkpanel2 hover:bg-slate-700/60 border border-darkborder text-xs text-slate-200 transition font-medium"
            title="Kamus konsep & analogi"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Kamus Konsep</span>
          </button>

          <button
            onClick={onTogglePresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
            title="Masuk ke Mode Presentasi Proyektor"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Mode Presentasi</span>
            <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-darkpanel2 hover:bg-rose-950/40 border border-darkborder hover:border-rose-500/40 text-xs text-slate-300 hover:text-rose-300 transition active:scale-95"
            title="Reset simulasi & database ke kondisi awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
