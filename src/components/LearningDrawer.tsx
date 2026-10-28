import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { GLOSSARY } from '../data/mockData';

interface LearningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearningDrawer: React.FC<LearningDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-darkpanel border-l border-darkborder h-full flex flex-col p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-darkborder">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-brand-yellow border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Kamus Konsep & Analogi REST API
              </h2>
              <p className="text-xs text-slate-400">
                Panduan materi presentasi untuk mahasiswa baru 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-darkpanel2 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why this matters callout */}
        <div className="my-5 p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs leading-relaxed text-blue-200">
          <div className="flex items-center gap-1.5 font-bold text-brand-blue mb-1 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poin Kunci Edukasi:</span>
          </div>
          <p>
            API <strong>bukanlah objek fisik</strong> melainkan <strong>antarmuka kontrak komunikasi</strong>. Analogi pelayan memudahkan mahasiswa memahami bahwa frontend tidak langsung menyentuh database koki secara sembarangan, melainkan wajib melalui protokol standar HTTP yang aman.
          </p>
        </div>

        {/* Terminology list */}
        <div className="space-y-4 flex-1">
          {GLOSSARY.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-darkpanel2/70 border border-darkborder/70 space-y-2 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-white">
                  {item.term}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Konsep #{idx + 1}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block text-[10px] uppercase font-mono mb-0.5">
                  Definisi Teknis:
                </span>
                <p>{item.tech}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-semibold text-amber-400 block text-[10px] uppercase font-mono mb-0.5">
                  🍽️ Analogi Restoran:
                </span>
                <p>{item.analogy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-darkborder mt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Tutup & Kembali ke Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
