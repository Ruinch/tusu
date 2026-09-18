import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_PRESETS } from '../../data/presets';
import {
  ArrowRight,
  Clock,
  GraduationCap,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Stage1Hero: React.FC = () => {
  const { setCurrentStage, loadPreset } = useApp();

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="punch-card punch-hero oxide-hero text-center space-y-6 max-w-6xl mx-auto px-6 py-16 sm:px-16 sm:py-24">

        <div className="oxide-telemetry" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="oxide-status"><span /> SYSTEM ONLINE · ADMISSIONS ENGINE V1.0</div>
        <div className="punch-kicker">ТВОЯ ЦЕЛЬ · ТВОИ ДАННЫЕ · ТВОЙ МАРШРУТ</div>

        <h1 className="oxide-title anim-fade-in-up anim-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Поступление<br /><span>без догадок.</span>
        </h1>

        <p className="anim-fade-in-up anim-delay-2 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Анкета за 3 минуты → персональная диагностика → подбор вузов с шансами и стипендиями → пошаговый план до зачисления.
        </p>

        <div className="oxide-diagram anim-fade-in-up anim-delay-3" aria-label="Схема работы TUSU AI"><span>PROFILE</span><b>→</b><span>ANALYSIS</span><b>→</b><span>ROUTE</span><b>→</b><span>ADMISSION</span></div>

        {/* CTA Buttons */}
        <div className="anim-fade-in-up anim-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentStage(2)}
            className="punch-primary w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Построить маршрут</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => loadPreset(DEMO_PRESETS[0])}
            className="hidden w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span>Демо для жюри (1 клик)</span>
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="anim-fade-in-up anim-delay-4 flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>3 мин</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>KZ + EU + Asia + US</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Гранты и стипендии</span>
          </div>
        </div>
      </div>

      {/* Compact Jury Presets Row */}
      <div className="hidden anim-fade-in-up anim-delay-5 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => loadPreset(preset)}
            className="hover-lift text-left p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">
                {preset.title.split('—')[0]}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {preset.profile.targetYear}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
              {preset.tagline}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
