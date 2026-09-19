import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { language } = useLanguage();
  const copy = language === 'kk' ? {
    code: '05 / САЛЫСТЫРУ МАТРИЦАСЫ', report: 'НҰСҚАЛАРДЫ САЛЫСТЫРУ', title: 'Негізгі бағдарламаларды салыстырмалы талдау', description: 'Талаптарды, мерзімдерді, құнын және шәкіртақы мүмкіндіктерін салыстыру.', choose: 'Салыстыру үшін кемінде 2 университет таңдаңыз', chooseText: 'Жеке ұсыныстарға оралып, кемінде екі сәйкес нұсқаны таңдаңыз.', catalog: 'Каталогқа оралу', verdict: 'TUSU.AI АЛГОРИТМІНІҢ ТАЛДАУ ҚОРЫТЫНДЫСЫ:', preparing: 'IELTS-ке дайындалуда', grant: '100% грант', family: 'отбасылық', verdictText: 'таңдалған нұсқалар ішінде қазіргі профильге ең жоғары сәйкестікке ие, ал', then: 'келесі сәйкестікке ие. Қаржыландыру шарттары мен шәкіртақы конкурсын әр бағдарлама үшін бөлек тексеріңіз.', parameter: 'ПАРАМЕТР', remove: 'Жою', location: 'Орналасуы', tuition: 'Жылдық құны', scholarship: 'Шәкіртақы', housing: 'Тұру', tests: 'Емтихандар минимумы', deadline: 'Өтінім беру мерзімі', career: 'Мансап бағыты', official: 'Ресми сайт', full: 'Толық қамту мүмкін', partial: 'Ішінара қамту', competitive: 'Конкурстық қаржыландыру', perYear: 'жылына', portal: 'Қабылдау порталы', back: 'Ұсыныстарға оралу', forward: 'Жеке жол картасы (6-қадам)'
  } : language === 'en' ? {
    code: '05 / COMPARISON MATRIX', report: 'OPTION COMPARISON', title: 'Comparative analysis of key programmes', description: 'Compare requirements, deadlines, cost and scholarship prospects.', choose: 'Select at least two universities to compare', chooseText: 'Return to personalised recommendations and select at least two suitable options.', catalog: 'Return to catalogue', verdict: 'TUSU.AI ALGORITHM VERDICT:', preparing: 'IELTS in preparation', grant: '100% grant', family: 'family-funded', verdictText: 'is the strongest match for your current profile among the selected options, while', then: 'is the next-best match. Check funding terms and scholarship competitions separately for every programme.', parameter: 'PARAMETER', remove: 'Remove', location: 'Location', tuition: 'Annual tuition', scholarship: 'Scholarship', housing: 'Living costs', tests: 'Minimum tests', deadline: 'Application deadline', career: 'Career path', official: 'Official website', full: 'Full coverage possible', partial: 'Partial coverage', competitive: 'Competitive funding', perYear: 'per year', portal: 'Admissions portal', back: 'Back to recommendations', forward: 'Personal roadmap (Step 6)'
  } : {
    code: '05 / МАТРИЦА СРАВНЕНИЯ', report: 'СОПОСТАВЛЕНИЕ ВАРИАНТОВ', title: 'Сравнительный анализ ключевых программ', description: 'Сравнение требований, дедлайнов, стоимости и перспектив стипендий.', choose: 'Выберите минимум 2 университета для сравнения', chooseText: 'Вернитесь к персональным рекомендациям и выберите там минимум два подходящих варианта.', catalog: 'Вернуться к каталогу', verdict: 'АНАЛИТИЧЕСКИЙ ВЕРДИКТ АЛГОРИТМА TUSU.AI:', preparing: 'IELTS в подготовке', grant: '100% грант', family: 'семейный', verdictText: 'имеет наивысшее соответствие текущему профилю среди выбранных вариантов, а', then: '— следующий по соответствию. Условия финансирования и конкурс на стипендию проверяйте отдельно для каждой программы.', parameter: 'ПАРАМЕТР', remove: 'Удалить', location: 'Локация', tuition: 'Стоимость в год', scholarship: 'Стипендия', housing: 'Проживание', tests: 'Минимум тестов', deadline: 'Дедлайн подачи', career: 'Карьерный трек', official: 'Официальный сайт', full: 'Полное покрытие возможно', partial: 'Частичное покрытие', competitive: 'Конкурсное финансирование', perYear: 'в год', portal: 'Admissions Portal', back: 'Назад к рекомендациям', forward: 'Персональный Roadmap (Этап 6)'
  };

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
            <span>{copy.code}</span>
            <span>•</span>
            <span>{copy.report}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {copy.title}
          </h1>
          <p className="text-sm text-zinc-400">
            {copy.description}
          </p>
        </div>

      </div>

      {!isReady ? (
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">{copy.choose}</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {copy.chooseText}
          </p>
          <button
            onClick={() => setCurrentStage(4)}
            className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-white transition-colors"
          >
            {copy.catalog}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Comparative Verdict */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {copy.verdict}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              GPA {profile.gpa.toFixed(2)}, {profile.ielts !== null ? `IELTS ${profile.ielts.toFixed(1)}` : copy.preparing}; {profile.budget === 'grant_only' ? copy.grant : copy.family}.{' '}
              <strong className="text-white">{bestOption?.name}</strong> {copy.verdictText} <strong className="text-white">{nextBestOption?.name}</strong> {copy.then}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  <th className="p-4 text-zinc-400 font-mono text-xs uppercase w-1/4">{copy.parameter}</th>
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
                          title={copy.remove}
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
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.location}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      {uni.city}, {uni.countryName}
                    </td>
                  ))}
                </tr>

                {/* Стоимость */}
                <tr className="hover:bg-zinc-800/20 bg-zinc-950/40">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.tuition}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 font-semibold text-zinc-100">
                      {uni.tuitionUsdPerYear === 0 ? '100% Грант ($0)' : `$${uni.tuitionUsdPerYear.toLocaleString()}`}
                    </td>
                  ))}
                </tr>

                {/* Стипендия */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.scholarship}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      <div className="font-medium text-white">{uni.scholarshipName}</div>
                      <div className="mt-0.5 text-[10px] font-mono text-amber-300">
                        {uni.scholarshipCoverage === 'full' ? copy.full : uni.scholarshipCoverage === 'partial' ? copy.partial : copy.competitive}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{uni.scholarshipDetails}</div>
                    </td>
                  ))}
                </tr>

                {/* Расходы */}
                <tr className="hover:bg-zinc-800/20 bg-zinc-950/40">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.housing}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 text-zinc-300">
                      ~${uni.livingCostUsdPerYear.toLocaleString()} {copy.perYear}
                    </td>
                  ))}
                </tr>

                {/* Тесты */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.tests}</td>
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
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.deadline}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 font-mono text-zinc-200">
                      {getDeadlineForTargetYear(uni.applicationDeadline, uni.deadlineLabel, profile.targetYear).label}
                    </td>
                  ))}
                </tr>

                {/* Карьера */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.career}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800 text-zinc-400 leading-relaxed">
                      {uni.careerProspects}
                    </td>
                  ))}
                </tr>

                {/* Сайт */}
                <tr className="hover:bg-zinc-800/20">
                  <td className="p-4 font-mono text-zinc-400 text-[11px] uppercase">{copy.official}</td>
                  {comparedUnis.map((uni) => (
                    <td key={uni.id} className="p-4 border-l border-zinc-800">
                      <a
                        href={uni.officialSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-white underline text-xs"
                      >
                        <span>{copy.portal}</span>
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
          <span>{copy.back}</span>
        </button>

        <button
          onClick={() => setCurrentStage(6)}
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>{copy.forward}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
