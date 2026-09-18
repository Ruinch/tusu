import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask } from '../../types';
import {
  Calendar,
  Check,
  Filter,
  ArrowRight,
  ArrowLeft,
  Plane,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Stage6Roadmap: React.FC = () => {
  const {
    roadmapTasks,
    profile,
    toggleTaskCompletion,
    setCurrentStage,
    setIsCalendarModalOpen,
    progressPercentage
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | RoadmapTask['category']>('all');

  const filteredTasks = activeCategoryFilter === 'all'
    ? roadmapTasks
    : roadmapTasks.filter(t => t.category === activeCategoryFilter);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
  const needsVisa = profile.targetCountries.some(country => country !== 'kz');

  const handleToggle = (taskId: string, currentStatus: boolean) => {
    toggleTaskCompletion(taskId);
    if (!currentStatus) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const getPriorityBadge = (priority: RoadmapTask['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
            Критический
          </span>
        );
      case 'important':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
            Важный
          </span>
        );
      case 'recommended':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-950">
            Рекомендованный
          </span>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>06 / ПЕРСОНАЛЬНЫЙ ROADMAP</span>
            <span>•</span>
            <span>ПОКВАРТАЛЬНЫЙ ПЛАН</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Пошаговый график поступления
          </h1>
          <p className="text-sm text-zinc-400">
            План подготовки: экзамены, документы, дедлайны стипендий и визы.
          </p>
        </div>

        {/* Calendar Export */}
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>Экспорт дедлайнов в iCal (.ics)</span>
        </button>
      </div>

      {needsVisa && (
        <section className="relative overflow-hidden rounded-2xl border border-sky-900/60 bg-gradient-to-br from-sky-950/35 via-zinc-900/60 to-zinc-950 p-5 anim-fade-in-up">
          <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300"><Plane className="h-5 w-5" /></div>
              <div><h2 className="font-semibold text-white">Виза: начинай после оффера</h2><p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400">TUSU.AI добавил визовый шаг в план, но финальный список документов всегда проверяй на сайте посольства: правила, финансовые суммы и сроки меняются.</p></div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2 text-[11px] text-zinc-300"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />Оффер → финансы → страховка → запись</div>
          </div>
        </section>
      )}

      {/* Progress Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-fade-in-up anim-delay-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Общий прогресс:</span>
            <span className="text-sm font-mono font-bold text-white">{progressPercentage}%</span>
          </div>
          <p className="text-xs text-zinc-400">
            Выполнено {roadmapTasks.filter(t => t.isCompleted).length} из {roadmapTasks.length} контрольных точек
          </p>
        </div>

        <div className="w-full sm:w-60 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-100 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800 pb-3">
        <Filter className="w-3.5 h-3.5 text-zinc-400 mr-1" />
        <span className="text-xs text-zinc-400 font-mono mr-2">Категория:</span>
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === 'all'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Все ({roadmapTasks.length})
        </button>
        <button
          onClick={() => setActiveCategoryFilter('exams')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === 'exams'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Экзамены
        </button>
        <button
          onClick={() => setActiveCategoryFilter('documents')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === 'documents'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Документы и эссе
        </button>
        <button
          onClick={() => setActiveCategoryFilter('finance')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === 'finance'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Гранты и стипендии
        </button>
        <button
          onClick={() => setActiveCategoryFilter('activities')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === 'activities'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Внеучебка
        </button>
      </div>

      {/* Quarters Timeline */}
      <div className="space-y-8">
        {quarters.map((q) => {
          const qTasks = filteredTasks.filter(t => t.quarter === q);
          if (qTasks.length === 0) return null;

          return (
            <div key={q} className="space-y-3">
              {/* Quarter Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-5 h-5 rounded bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-[10px]">
                  {q}
                </span>
                <span className="font-semibold text-zinc-300">
                  {qTasks[0]?.quarterTitle}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-2.5 pl-3 border-l border-zinc-800 ml-2.5">
                {qTasks.map((task) => (
                  (() => {
                    const isApplicationChecklist = task.id.startsWith('apply-');
                    return (
                  <div
                    key={task.id}
                    onClick={() => handleToggle(task.id, task.isCompleted)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover-lift ${
                      task.isCompleted
                        ? 'bg-zinc-950/30 border-zinc-800/40 opacity-50'
                        : isApplicationChecklist ? 'bg-sky-950/20 border-sky-900/70 hover:border-sky-700' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        type="button"
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                          task.isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                            : 'border-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {task.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      {/* Content */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              task.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100'
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            <span className="text-[11px] font-mono text-zinc-400">
                              {task.dueLabel}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {task.description}
                        </p>

                        {task.actionGuide && (
                          <div className={`p-2.5 rounded-lg border text-[11px] text-zinc-300 ${isApplicationChecklist ? 'bg-sky-950/30 border-sky-900/70' : 'bg-zinc-950 border-zinc-800/80'}`}>
                            <span className={`${isApplicationChecklist ? 'text-sky-300' : 'text-zinc-400'} font-mono text-[10px] uppercase font-semibold mr-1.5`}>
                              {isApplicationChecklist ? 'Документы и условия:' : 'План действий:'}
                            </span>
                            {task.actionGuide}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          onClick={() => setCurrentStage(5)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к сравнению</span>
        </button>

        <button
          onClick={() => setCurrentStage(7)}
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>Ключевое действие (Этап 7)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
