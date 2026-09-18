import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-[#09090b] border-t border-zinc-800/80 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-zinc-300">TUSU.AI</span>
          <span className="text-zinc-600">•</span>
          <span>LOCUS Startup Hackathon 2026</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
            Код кейса: LOCUSCASE2
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Верифицировано по правилам приема 2025/2026</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            <span>Rule-based + ML scoring engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
