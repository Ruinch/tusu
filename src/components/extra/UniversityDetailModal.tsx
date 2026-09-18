import React from 'react';
import { useApp } from '../../context/AppContext';
import { getDeadlineForTargetYear } from '../../utils/admissionCycle';
import {
  X,
  ExternalLink,
  Check,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const UniversityDetailModal: React.FC = () => {
  const {
    selectedUniForDetail,
    setSelectedUniForDetail,
    setIsEssayModalOpen,
    profile
  } = useApp();

  if (!selectedUniForDetail) return null;

  const uni = selectedUniForDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-950/70">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{uni.name}</h3>
              <span className="text-xs text-zinc-400">({uni.nativeName})</span>
            </div>
            <div className="text-xs font-semibold text-zinc-300 mt-0.5">{uni.programName}</div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1">
              {uni.city}, {uni.countryName} • {uni.ranking}
            </div>
          </div>

          <button
            onClick={() => setSelectedUniForDetail(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-300">
          {/* Key Strengths */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              Преимущества программы:
            </div>
            <div className="space-y-1.5">
              {uni.keyStrengths.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300 leading-relaxed"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship & Funding */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              Финансирование: {uni.scholarshipName}
            </div>
            <p className="text-zinc-300 leading-relaxed">
              {uni.scholarshipDetails}
            </p>
          </div>

          {/* Requirements & Deadlines */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1 font-mono text-[11px]">
              <div className="text-zinc-400 font-semibold uppercase text-[10px]">Входные пороги:</div>
              <div className="text-zinc-200">• Мин. GPA: {uni.minGpa}</div>
              <div className="text-zinc-200">• IELTS: {uni.minIelts}+</div>
              {uni.minSat && <div className="text-zinc-200">• SAT: {uni.minSat}+</div>}
              {uni.minEnt && <div className="text-zinc-200">• ЕНТ: {uni.minEnt}+</div>}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase text-zinc-400">Сроки приема:</div>
              <div className="font-semibold text-zinc-200">{getDeadlineForTargetYear(uni.applicationDeadline, uni.deadlineLabel, profile.targetYear).label}</div>
              <div className="text-[11px] text-zinc-400 mt-1">
                Семестр начала: Осень {profile.targetYear}
              </div>
            </div>
          </div>

          {/* Career */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <div className="text-[10px] font-mono font-semibold uppercase text-zinc-400">Карьерный вектор:</div>
            <p className="text-zinc-300 leading-relaxed">{uni.careerProspects}</p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{uni.dataSourceNotice}</span>
              </div>
              <a
                href={uni.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 hover:text-white underline flex items-center gap-1"
              >
                <span>Официальный сайт</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedUniForDetail(null);
              setIsEssayModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Составить эссе для этой программы</span>
          </button>

          <button
            onClick={() => setSelectedUniForDetail(null)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
