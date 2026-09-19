import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { language } = useLanguage();
  const copy = language === 'kk' ? {
    code: '07 / ӘРЕКЕТ ФОКУСЫ', subcode: 'ЖАҚЫНДАҒЫ ҚАДАМ', title: 'Дәл қазір не істеу керек', description: 'Ондаған тапсырмаға шашырамаңыз. Ең жоғары басымдықтағы бір негізгі әрекетке назар аударыңыз.', priority: 'МАРШРУТТАҒЫ №1 БАСЫМДЫҚ', due: 'Мерзімі:', guide: 'ОРЫНДАУДЫҢ ТАКТИКАЛЫҚ ЖОСПАРЫ:', complete: 'Орындалған деп белгілеу', calendar: 'Күнтізбеге', done: 'Барлық бақылау нүктелері жабылды!', doneText: 'Дайындықтың барлық кезеңін аяқтадыңыз. Поштаңызды тексеріп, қабылдау комиссияларының шешімдерін бақылаңыз.', roadmap: 'Жалпы жоспарды көру', queue: 'КЕЗЕКТЕГІ КЕЛЕСІ ҚАДАМДАР', emptyQueue: 'Кезек бос', closed: 'АЯҚТАЛҒАН ТАПСЫРМАЛАР', completed: 'Орындалды', noCompleted: 'Орындалған тапсырма жоқ', help: 'Мотивациялық хат жазуға көмек керек пе?', helpText: 'Таңдалған университетке арналған Personal Statement құрылымы бойынша AI-кеңесшіні пайдаланыңыз.', essay: 'Эссе кеңесшісін ашу', back: 'Жоспарға оралу', home: 'Басты бетке'
  } : language === 'en' ? {
    code: '07 / ACTION FOCUS', subcode: 'NEXT STEP', title: 'What to do right now', description: 'Do not scatter your attention across dozens of tasks. Focus on the single highest-priority action.', priority: 'NO. 1 PRIORITY IN YOUR ROUTE', due: 'Due:', guide: 'TACTICAL ACTION PLAN:', complete: 'Mark as complete', calendar: 'Add to calendar', done: 'All checkpoints are complete!', doneText: 'You have completed every preparation stage. Check your email and follow admissions decisions.', roadmap: 'View full roadmap', queue: 'UPCOMING TASKS', emptyQueue: 'The queue is empty', closed: 'COMPLETED TASKS', completed: 'Completed', noCompleted: 'No completed tasks', help: 'Need help writing a motivation letter?', helpText: 'Use the AI advisor for a Personal Statement structure tailored to your selected university.', essay: 'Open essay advisor', back: 'Back to roadmap', home: 'Home'
  } : {
    code: '07 / ФОКУС-ДЕЙСТВИЕ', subcode: 'БЛИЖАЙШИЙ ШАГ', title: 'Что делать прямо сейчас', description: 'Не распыляйтесь на десятки задач. Сконцентрируйтесь на одном ключевом действии с наивысшим приоритетом.', priority: 'ПРИОРИТЕТ №1 В МАРШРУТЕ', due: 'Срок:', guide: 'ТАКТИЧЕСКИЙ ПЛАН ВЫПОЛНЕНИЯ:', complete: 'Отметить выполненным', calendar: 'В календарь', done: 'Все контрольные точки закрыты!', doneText: 'Вы закрыли все этапы подготовки. Проверяйте почту и отслеживайте решения приемных комиссий.', roadmap: 'Посмотреть общий роадмап', queue: 'ПРЕДСТОЯЩИЕ ШАГИ В ОЧЕРЕДИ', emptyQueue: 'Очередь пуста', closed: 'ЗАКРЫТЫЕ ЗАДАЧИ', completed: 'Выполнено', noCompleted: 'Нет выполненных задач', help: 'Нужна помощь с написанием мотивационного письма?', helpText: 'Используйте AI-советник по структуре Personal Statement под выбранный университет.', essay: 'Открыть советник по эссе', back: 'Назад к роадмапу', home: 'На главную'
  };

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
          <span>{copy.code}</span>
          <span>•</span>
          <span>{copy.subcode}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {copy.title}
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          {copy.description}
        </p>
      </div>

      {nextAction ? (
        /* Spotlight Card */
        <div className="rounded-2xl p-6 sm:p-8 bg-zinc-900 border border-zinc-700 shadow-xl space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              {copy.priority}
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{copy.due} <strong className="text-white">{nextAction.dueLabel}</strong></span>
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
                {copy.guide}
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
              <span>{copy.complete} ✓</span>
            </button>

            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>{copy.calendar}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed state */
        <div className="p-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold text-white">{copy.done}</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {copy.doneText}
          </p>
          <button
            onClick={() => setCurrentStage(6)}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-medium"
          >
            {copy.roadmap}
          </button>
        </div>
      )}

      {/* Queue & History */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Next tasks in queue */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>{copy.queue}</span>
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
              <div className="text-xs text-zinc-400 py-2 text-center">{copy.emptyQueue}</div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>{copy.closed}</span>
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
                  <div className="text-[10px] font-mono text-emerald-400/70 mt-0.5">{copy.completed}</div>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="text-xs text-zinc-400 py-2 text-center">{copy.noCompleted}</div>
            )}
          </div>
        </div>
      </div>

      {/* Extra Tool Access */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs font-semibold text-zinc-200">
            {copy.help}
          </div>
          <p className="text-xs text-zinc-400">
            {copy.helpText}
          </p>
        </div>

        <button
          onClick={() => setIsEssayModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors shrink-0 cursor-pointer"
        >
          {copy.essay}
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <button
          onClick={() => setCurrentStage(6)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{copy.back}</span>
        </button>

        <button
          onClick={() => setCurrentStage(1)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Compass className="w-4 h-4 text-zinc-400" />
          <span>{copy.home}</span>
        </button>
      </div>
    </div>
  );
};
