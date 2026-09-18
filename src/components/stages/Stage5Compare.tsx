import React from 'react';
import { useApp } from '../../context/AppContext';
import { getDeadlineForTargetYear } from '../../utils/admissionCycle';
import {
  GitCompare,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';

export const Stage5Compare: React.FC = () => {
  const {
    comparedUniIds,
    toggleCompareUni,
    setCurrentStage,
    profile,
    recommendations
  } = useApp();

  const comparedRecommendations = recommendations.filter(rec => comparedUniIds.includes(rec.university.id));
  // Comparison is intentionally limited to the personalised results from step 4.
  // Old IDs can remain in local storage after a profile changes, so do not render them.
  const comparedUnis = comparedRecommendations.map(rec => rec.university);
  const bestOption = comparedRecommendations[0]?.university;
  const nextBestOption = comparedRecommendations[1]?.university;
  const isReady = comparedUnis.length >= 2;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>05 / МАТРИЦА СРАВНЕНИЯ</span>
            <span>•</span>
            <span>СОПОСТАВЛЕНИЕ ВАРИАНТОВ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Сравнительный анализ ключевых программ
          </h1>
          <p className="text-sm text-zinc-400">
            Сравнение требований, дедлайнов, стоимости и перспектив стипендий.
          </p>
        </div>

      </div>

      {!isReady ? (
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">Выберите минимум 2 университета для сравнения</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Вернитесь к персональным рекомендациям и выберите там минимум два подходящих варианта.
          </p>
          <button
            onClick={() => setCurrentStage(4)}
            className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-white transition-colors"
          >
            Вернуться к каталогу
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Comparative Verdict */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Аналитический вердикт алгоритма TUSU.AI:
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              С учетом вашего текущего профиля (GPA {profile.gpa.toFixed(2)}, {profile.ielts !== null ? `IELTS ${profile.ielts.toFixed(1)}` : 'IELTS в подготовке'}, бюджет: {profile.budget === 'grant_only' ? '100% грант' : 'семейный'}),{' '}
              <strong className="text-white">{bestOption?.name}</strong> имеет наивысшее соответствие текущему профилю среди выбранных вариантов, а{' '}
              <strong className="text-white">{nextBestOption?.name}</strong> — следующий по соответствию. Условия финансирования и конкурс на стипендию проверяйте отдельно для каждой программы.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  <th className="p-4 text-zinc-400 font-mono text-xs uppercase w-1/4">Параметр</th>
                  {comparedUnis.map((uni) => (
                    <th key={uni.id} className="p-4 text-white font-bold w-1/3 border-l border-zinc-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm sm:text-base text-zinc-100">{uni.name}</div>
                          <div className="text-xs font-normal text-zinc-400 mt-0.5">{uni.programName}</div>
                        </div>
                        <button
                          onClick={() => toggleCompareUni(uni.id)}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="Удалить"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300 text-xs">
                {/* Локация */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Локация</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      {uni.city}, {uni.countryName}
                    </td>
                  ))}
                </tr>

                {/* Стоимость */}
                <tr className="hover:bg-zinc-800/20 bg-zinc-950/40">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Стоимость в год</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 font-semibold text-zinc-100">
                      {uni.tuitionUsdPerYear === 0 ? '100% Грант ($0)' : `$${uni.tuitionUsdPerYear.toLocaleString()}`}
                    </td>
                  ))}
                </tr>

                {/* Стипендия */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Стипендия</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      <div className="font-medium text-white">{uni.scholarshipName}</div>
                      <div className="mt-0.5 text-[10px] font-mono text-amber-300">
                        {uni.scholarshipCoverage === 'full' ? 'Полное покрытие возможно' : uni.scholarshipCoverage === 'partial' ? 'Частичное покрытие' : 'Конкурсное финансирование'}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{uni.scholarshipDetails}</div>
                    </td>
                  ))}
                </tr>

                {/* Расходы */}
                <tr className="hover:bg-zinc-800/20 bg-zinc-950/40">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Проживание</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 text-zinc-300">
                      ~${uni.livingCostUsdPerYear.toLocaleString()} в год
                    </td>
                  ))}
                </tr>

                {/* Тесты */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Минимум тестов</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 space-y-1">
                      <div>IELTS: <strong className="text-white">{uni.minIelts}+</strong></div>
                      {uni.minSat && <div>SAT: <strong className="text-white">{uni.minSat}+</strong></div>}
                      {uni.minEnt && <div>ЕНТ: <strong className="text-white">{uni.minEnt}+</strong></div>}
                    </td>
                  ))}
                </tr>

                {/* Дедлайн */}
                <tr className="hover:bg-zinc-800/20 bg-zinc-950/40">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Дедлайн подачи</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 font-mono text-zinc-200">
                      {getDeadlineForTargetYear(uni.applicationDeadline, uni.deadlineLabel, profile.targetYear).label}
                    </td>
                  ))}
                </tr>

                {/* Карьера */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Карьерный трек</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 text-zinc-400 leading-relaxed">
                      {uni.careerProspects}
                    </td>
                  ))}
                </tr>

                {/* Сайт */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">Официальный сайт</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      <a
                        href={uni.officialSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-white underline text-xs"
                      >
                        <span>Admissions Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          onClick={() => setCurrentStage(4)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к рекомендациям</span>
        </button>

        <button
          onClick={() => setCurrentStage(6)}
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>Персональный Roadmap (Этап 6)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
