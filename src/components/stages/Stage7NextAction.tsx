import React from 'react';
import { useApp } from '../../context/AppContext';
import { getImmediateNextAction } from '../../utils/roadmapGenerator';
import {
  Check,
  Calendar,
  ArrowLeft,
  Clock,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Stage7NextAction: React.FC = () => {
  const {
    roadmapTasks,
    toggleTaskCompletion,
    setCurrentStage,
    setIsCalendarModalOpen,
    setIsEssayModalOpen
  } = useApp();

  const nextAction = getImmediateNextAction(roadmapTasks);
  const completedTasks = roadmapTasks.filter(t => t.isCompleted);
  const upcomingTasks = roadmapTasks.filter(t => !t.isCompleted && t.id !== nextAction?.id);

  const handleCompleteCurrent = () => {
    if (!nextAction) return;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    toggleTaskCompletion(nextAction.id);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-zinc-400">
          <span>07 / ФОКУС-ДЕЙСТВИЕ</span>
          <span>•</span>
          <span>БЛИЖАЙШИЙ ШАГ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Что делать прямо сейчас
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Не распыляйтесь на десятки задач. Сконцентрируйтесь на одном ключевом действии с наивысшим приоритетом.
        </p>
      </div>

      {nextAction ? (
        /* Spotlight Card */
        <div className="rounded-2xl p-6 sm:p-8 bg-zinc-900 border border-zinc-700 shadow-xl space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Приоритет №1 в маршруте
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Срок: <strong className="text-white">{nextAction.dueLabel}</strong></span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {nextAction.title}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {nextAction.description}
            </p>
          </div>

          {/* Tactical Guide */}
          {nextAction.actionGuide && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Тактический план выполнения:
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {nextAction.actionGuide}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCompleteCurrent}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Отметить выполненным ✓</span>
            </button>

            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>В календарь</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed state */
        <div className="p-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold text-white">Все контрольные точки закрыты!</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Вы закрыли все этапы подготовки. Проверяйте почту и отслеживайте решения приемных комиссий.
          </p>
          <button
            onClick={() => setCurrentStage(6)}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-medium"
          >
            Посмотреть общий роадмап
          </button>
        </div>
      )}

      {/* Queue & History */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Next tasks in queue */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>Предстоящие шаги в очереди</span>
            <span>{upcomingTasks.length}</span>
          </div>

          <div className="space-y-2">
            {upcomingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-zinc-200 truncate">{task.title}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{task.dueLabel}</div>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-xs text-zinc-400 py-2 text-center">Очередь пуста</div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>Закрытые задачи</span>
            <span className="text-emerald-400 font-mono font-bold">{completedTasks.length}</span>
          </div>

          <div className="space-y-2">
            {completedTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-2.5 opacity-60"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-zinc-400 line-through truncate">{task.title}</div>
                  <div className="text-[10px] font-mono text-emerald-400/70 mt-0.5">Выполнено</div>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="text-xs text-zinc-400 py-2 text-center">Нет выполненных задач</div>
            )}
          </div>
        </div>
      </div>

      {/* Extra Tool Access */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs font-semibold text-zinc-200">
            Нужна помощь с написанием мотивационного письма?
          </div>
          <p className="text-xs text-zinc-400">
            Используйте AI-советник по структуре Personal Statement под выбранный университет.
          </p>
        </div>

        <button
          onClick={() => setIsEssayModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors shrink-0 cursor-pointer"
        >
          Открыть советник по эссе
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <button
          onClick={() => setCurrentStage(6)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к роадмапу</span>
        </button>

        <button
          onClick={() => setCurrentStage(1)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Compass className="w-4 h-4 text-zinc-400" />
          <span>На главную</span>
        </button>
      </div>
    </div>
  );
};
