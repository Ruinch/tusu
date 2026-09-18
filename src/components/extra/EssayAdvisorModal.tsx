import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/universities';
import {
  X,
  Copy,
  Check,
  FileText
} from 'lucide-react';

export const EssayAdvisorModal: React.FC = () => {
  const { isEssayModalOpen, setIsEssayModalOpen, profile, selectedUniForDetail } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState<string>(() => {
    return selectedUniForDetail?.id || UNIVERSITIES[0].id;
  });

  if (!isEssayModalOpen) return null;

  const currentUni = UNIVERSITIES.find(u => u.id === selectedUniId) || UNIVERSITIES[0];

  const essayStructure = [
    {
      section: '01 / Крючок и происхождение академического интереса (10-15%)',
      goal: 'Показать искру интереса через конкретную проблему или пет-проект, а не банальное «я люблю компьютеры с детства».',
      example: `«Работая над автоматизацией анализа данных на школьном хакатоне, я столкнулся с тем, как модели машинного обучения оптимизируют распределение ресурсов... Мой интерес к ${currentUni.programName} родился из желания создавать надежные прикладные решения...»`
    },
    {
      section: '02 / Академический и практический фундамент (35-40%)',
      goal: 'Доказать, что у вас есть база для селективной программы: олимпиады, проекты, курсы, GPA.',
      example: `«Углубленное изучение математики (GPA ${profile.gpa.toFixed(2)}) позволило мне успешно войти в число призеров олимпиад. В своем проекте я применил Python и базы данных, преодолев сложности с оптимизацией производительности...»`
    },
    {
      section: `03 / Почему именно ${currentUni.name}? (25-30%)`,
      goal: 'Конкретика: профессора, лаборатории, дуальные модули вуза. Показать глубокое изучение учебного плана.',
      example: `«В ${currentUni.name} меня особенно привлекает лаборатория интеллектуальных систем и модуль по распределенным вычислениям. Возможности стажировок в индустриальных хабах (${currentUni.city}) идеально соответствуют моим планам...»`
    },
    {
      section: '04 / Долгосрочный вклад и видение карьеры (15-20%)',
      goal: 'Объяснить, кем вы станете после выпуска и какую пользу принесете индустрии и обществу.',
      example: `«После окончания бакалавриата я планирую работать над развитием технологической инфраструктуры и участвовать в разработке масштабируемых систем для науки и финтеха...»`
    }
  ];

  const fullTextToCopy = essayStructure.map(s => `${s.section}\nЦЕЛЬ: ${s.goal}\nПРИМЕР:\n${s.example}\n`).join('\n---\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTextToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between gap-4 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-zinc-300" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI-советник по мотивационному эссе</h3>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">SOP Framework</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                4-частная структура Personal Statement под выбранный университет
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEssayModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* University Selector */}
        <div className="px-5 py-2.5 bg-zinc-950/40 border-b border-zinc-800 flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">Программа:</span>
          <select
            value={selectedUniId}
            onChange={(e) => setSelectedUniId(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none"
          >
            {UNIVERSITIES.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.programName}
              </option>
            ))}
          </select>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-300">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              Главный принцип комиссии:
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Приемная комиссия ищет ответ на 3 вопроса: «Почему этот студент?», «Почему именно наш вуз?» и «Какова его цель?». Избегайте общих фраз и подтверждайте каждый тезис измеримым результатом.
            </p>
          </div>

          <div className="space-y-3">
            {essayStructure.map((part, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5"
              >
                <div className="font-semibold text-zinc-200">
                  {part.section}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {part.goal}
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/60 text-zinc-300 italic text-[11px] leading-relaxed">
                  {part.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Скопировано в буфер' : 'Скопировать шаблон'}</span>
          </button>

          <button
            onClick={() => setIsEssayModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
