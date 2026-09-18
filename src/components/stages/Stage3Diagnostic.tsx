import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Check,
  AlertCircle,
  Target,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';

export const Stage3Diagnostic: React.FC = () => {
  const { diagnostics, profile, setCurrentStage } = useApp();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>03 / АУДИТ ПОСТУПЛЕНИЯ</span>
            <span>•</span>
            <span>СТРАТЕГИЧЕСКИЙ ОТЧЕТ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Диагностический аудит абитуриента
          </h1>
          <p className="text-sm text-zinc-400">
            Объективная оценка академических баллов, рисков и рекомендованная формула подачи.
          </p>
        </div>

        <button
          onClick={() => setCurrentStage(2)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span>Редактировать параметры</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              <span>Профиль: {profile.name || 'Абитуриент'}</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
              {diagnostics.summary}
            </p>

            {/* Formulated Goal */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
              <Target className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Сформулированная образовательная цель
                </div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-100 mt-0.5">
                  {diagnostics.educationalGoal}
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Index */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center shrink-0 w-full md:w-48 space-y-2">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Индекс готовности
            </div>
            <div className="font-mono text-4xl font-extrabold text-white">
              {diagnostics.readinessScore}%
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${diagnostics.readinessScore}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {diagnostics.readinessScore >= 75
                ? 'Высокая конкурентность'
                : diagnostics.readinessScore >= 55
                ? 'Базовый порог закрыт'
                : 'Нужен ранний добор'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: Strengths & Bottlenecks */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-zinc-900/40 border border-zinc-800/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
              Конкурентные преимущества
            </span>
          </div>

          <ul className="space-y-2.5">
            {diagnostics.strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottlenecks */}
        <div className="bg-zinc-900/40 border border-zinc-800/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
              Узкие места и риски дедлайнов
            </span>
          </div>

          <ul className="space-y-2.5">
            {diagnostics.limitations.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Strategy Formula */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Рекомендованная стратегия портфеля программ
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed">
            {diagnostics.recommendedStrategy}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStage(2)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к анкете</span>
        </button>

        <button
          onClick={() => setCurrentStage(4)}
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>Рекомендации университетов (Этап 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
