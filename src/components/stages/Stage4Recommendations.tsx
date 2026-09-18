import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationTier } from '../../types';
import { getDeadlineForTargetYear } from '../../utils/admissionCycle';
import { getAdmissionRoute } from '../../utils/admissionRoute';
import {
  ExternalLink,
  GitCompare,
  Check,
  Calendar,
  DollarSign,
  GraduationCap,
  FileText,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Filter,
  ChevronDown
} from 'lucide-react';

export const Stage4Recommendations: React.FC = () => {
  const {
    recommendations,
    comparedUniIds,
    toggleCompareUni,
    setCurrentStage,
    setSelectedUniForDetail,
    setIsEssayModalOpen,
    profile
  } = useApp();

  const [activeTierFilter, setActiveTierFilter] = useState<'all' | RecommendationTier>('all');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [expandedUniId, setExpandedUniId] = useState<string | null>(null);

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesTier = activeTierFilter === 'all' || rec.tier === activeTierFilter;
    const matchesCountry = selectedCountryFilter === 'all' || rec.university.country === selectedCountryFilter;
    return matchesTier && matchesCountry;
  });

  const getTierBadge = (tier: RecommendationTier) => {
    switch (tier) {
      case 'dream':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            Требуется усиление
          </span>
        );
      case 'target':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-600">
            Требования в работе
          </span>
        );
      case 'safety':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/60">
            Базовые требования закрыты
          </span>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>04 / ПОДБОР ПРОГРАММ</span>
            <span>•</span>
            <span>МАТРИЦА СООТВЕТСТВИЯ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Рекомендованные университеты и программы
          </h1>
          <p className="text-sm text-zinc-400">
            Каждая программа сопоставлена с вашим GPA, экзаменами и условиями финансирования.
          </p>
        </div>

        {/* Floating Compare Button */}
        {comparedUniIds.length > 0 && (
          <button
            onClick={() => setCurrentStage(5)}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Сравнить выбранные ({comparedUniIds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        {/* Tier Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-zinc-400 mr-1 font-mono">Тип:</span>
          {(['all', 'target', 'dream', 'safety'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTierFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                activeTierFilter === t
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t === 'all' ? 'Все' : t}
            </button>
          ))}
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 text-zinc-400" />
          <select
            value={selectedCountryFilter}
            onChange={(e) => setSelectedCountryFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">Все регионы</option>
            <option value="kz">Казахстан</option>
            <option value="eu_germany">Германия</option>
            <option value="eu_italy">Италия</option>
            <option value="asia_korea">Южная Корея</option>
            <option value="usa">США</option>
          </select>
        </div>
      </div>

      {/* Compact catalogue: details are opened only for the programme the user is studying. */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredRecommendations.map((rec) => {
          const uni = rec.university;
          const deadline = getDeadlineForTargetYear(uni.applicationDeadline, uni.deadlineLabel, profile.targetYear);
          const admissionRoute = getAdmissionRoute(uni);
          const isCompared = comparedUniIds.includes(uni.id);

          return (
            <div
              key={uni.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-zinc-900/40 backdrop-blur-sm ${expandedUniId === uni.id ? 'lg:col-span-2' : ''} ${
                isCompared
                  ? 'border-zinc-500 bg-zinc-900/80 shadow-md'
                  : 'border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex flex-col gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{uni.name}</h3>
                    <span className="text-xs text-zinc-400">({uni.nativeName})</span>
                    {getTierBadge(rec.tier)}
                  </div>
                  <div className="text-xs font-semibold text-zinc-300">
                    {uni.programName}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono pt-1">
                    <span>{uni.city}, {uni.countryName}</span>
                    <span>•</span>
                    <span>{uni.language}</span>
                    <span>•</span>
                    <span>{uni.ranking}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleCompareUni(uni.id)}
                    className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${isCompared ? 'border-zinc-100 bg-zinc-100 text-zinc-950' : 'border-zinc-700 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-800'}`}
                  >
                    <GitCompare className="mr-1 inline h-3.5 w-3.5" />{isCompared ? 'Выбран' : 'Сравнить'}
                  </button>
                  <button
                    onClick={() => setExpandedUniId(current => current === uni.id ? null : uni.id)}
                    aria-expanded={expandedUniId === uni.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    {expandedUniId === uni.id ? 'Свернуть' : 'Детали'} <ChevronDown className={`ml-1 inline h-3.5 w-3.5 transition-transform ${expandedUniId === uni.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="hidden rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 lg:block">
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Статус требований: <span className="text-zinc-200 font-medium">{rec.chanceCategory}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 lg:hidden">
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Статус требований: <span className="text-zinc-200 font-medium">{rec.chanceCategory}</span>
                  </div>
                </div>
              </div>

              {/* Detailed data is deliberately collapsed so a large catalogue is quick to scan. */}
              {expandedUniId === uni.id && <div className="p-5 sm:p-6 space-y-4">
                <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Маршрут подачи</div>
                    <div className="text-sm font-semibold text-zinc-100">{admissionRoute.title}</div>
                    <p className="text-xs leading-relaxed text-zinc-400">{admissionRoute.steps}</p>
                    <p className="text-[11px] leading-relaxed text-amber-300">{admissionRoute.disclaimer}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Что сделать дальше</div>
                    <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                      {rec.risksAndBottlenecks.slice(0, 3).map((risk, index) => <li key={index} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />{risk}</li>)}
                    </ul>
                  </div>
                </div>
                {/* Why it fits */}
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Обоснование соответствия профилю:
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-mono uppercase">Академический критерий:</span>
                      <p className="mt-0.5 text-zinc-300">{rec.whyItFits.academicFit}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-mono uppercase">Финансовая модель:</span>
                      <p className="mt-0.5 text-zinc-300">{rec.whyItFits.financialFit}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-mono uppercase">Карьерный трек:</span>
                      <p className="mt-0.5 text-zinc-300">{rec.whyItFits.careerFit}</p>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    {rec.whyItFits.points.map((p, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase mb-0.5">
                      <DollarSign className="w-3 h-3 text-zinc-400" />
                      <span>Стоимость в год</span>
                    </div>
                    <div className="font-semibold text-zinc-100">
                      {uni.tuitionUsdPerYear === 0 ? '100% Грант ($0)' : `$${uni.tuitionUsdPerYear.toLocaleString()}`}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {uni.scholarshipName}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase mb-0.5">
                      <GraduationCap className="w-3 h-3 text-zinc-400" />
                      <span>Пороги тестов</span>
                    </div>
                    <div className="font-semibold text-zinc-100">
                      {uni.minIelts > 0 ? `IELTS ${uni.minIelts}+` : 'Языковой тест не заявлен'} {uni.minSat ? `• SAT ${uni.minSat}+` : ''} {uni.minEnt ? `• ЕНТ ${uni.minEnt}+` : ''}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      Мин. GPA: {uni.minGpa}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase mb-0.5">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>Дедлайн</span>
                    </div>
                    <div className="font-semibold text-zinc-100 truncate">
                      {deadline.label.split(' ')[0]} {deadline.label.split(' ')[1]}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                      {deadline.label}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase mb-0.5">
                      <ShieldCheck className="w-3 h-3 text-zinc-400" />
                      <span>Верификация</span>
                    </div>
                    <div className="text-zinc-200 text-xs truncate">
                      {uni.dataSourceNotice}
                    </div>
                    <a
                      href={uni.officialSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mt-0.5"
                    >
                      <span>Сайт вуза</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompareUni(uni.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-zinc-100 text-zinc-950 font-semibold'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'В сравнении' : 'Добавить к сравнению'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUniForDetail(uni);
                        setIsEssayModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Гид по эссе</span>
                    </button>
                  </div>

                  <a
                    href={uni.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <span>Официальные правила приема</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          onClick={() => setCurrentStage(3)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к диагностике</span>
        </button>

        <button
          onClick={() => setCurrentStage(5)}
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>Сравнение вариантов (Этап 5)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
