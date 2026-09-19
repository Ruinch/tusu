import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, BookOpen, CalendarDays, Compass, Map, Sparkles, Target } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, recommendations, roadmapTasks, progressPercentage, setCurrentStage } = useApp();
  const { language } = useLanguage();
  const copy = language === 'kk' ? {
    workspace: '// ЖҰМЫС КЕҢІСТІГІ', hello: 'Сәлем', route: 'Оқуға түсу жолыңызға арналған бағдарламалар, әрекеттер мен мерзімдер бір жерде жиналды.', edit: 'Маршрутты өзгерту',
    progress: 'ЖОСПАР БАРЫСЫ', complete: 'тапсырманың орындалды', next: 'КЕЛЕСІ ӘРЕКЕТ', allDone: 'Барлық тапсырма орындалды', results: 'Өтінім нәтижелерін тексеріңіз',
    programmes: 'БАҒДАРЛАМАЛАР', variants: 'әртүрлі өтініш жолдары бар нұсқа', fitting: 'СӘЙКЕС БАҒДАРЛАМАЛАР', continue: 'Іріктеуді жалғастыру', allOptions: 'Барлық нұсқалар →',
    manage: 'Мерзімдерді басқарыңыз', manageText: 'Тапсырмаларды белгілеңіз, күнтізбені экспорттаңыз және маңызды өтініш кезеңдерін жіберіп алмаңыз.', openPlan: 'Жоспарды ашу',
    tools: 'Қосымша құралдарды зерттеңіз', toolsText: '«Кабинетте» мамандық таңдауы, ойлау стилі, портфолио және Chach қолжетімді.', openAccount: 'Кабинетті ашу →'
  } : language === 'en' ? {
    workspace: '// WORKSPACE', hello: 'Hello', route: 'Your admission programmes, actions and deadlines are collected in one place.', edit: 'Edit route',
    progress: 'PLAN PROGRESS', complete: 'tasks completed', next: 'NEXT ACTION', allDone: 'All tasks completed', results: 'Check application results',
    programmes: 'PROGRAMMES', variants: 'options with different application routes', fitting: 'MATCHED PROGRAMMES', continue: 'Continue matching', allOptions: 'All options →',
    manage: 'Manage deadlines', manageText: 'Mark tasks, export your calendar and never miss an important application step.', openPlan: 'Open plan',
    tools: 'Explore extra tools', toolsText: 'Career guidance, thinking style, portfolio and Chach are available in Account.', openAccount: 'Open account →'
  } : {
    workspace: '// РАБОЧЕЕ ПРОСТРАНСТВО', hello: 'Привет', route: 'Твой маршрут на поступление: программы, действия и дедлайны собраны в одном месте.', edit: 'Изменить маршрут',
    progress: 'ПРОГРЕСС ПЛАНА', complete: 'задач выполнено', next: 'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ', allDone: 'Все задачи выполнены', results: 'Проверьте результаты заявок',
    programmes: 'ПРОГРАММЫ', variants: 'вариантов с разными маршрутами подачи', fitting: 'ПОДХОДЯЩИЕ ПРОГРАММЫ', continue: 'Продолжить подбор', allOptions: 'Все варианты →',
    manage: 'Управляй дедлайнами', manageText: 'Отмечай задачи, экспортируй календарь и не теряй важные этапы подачи.', openPlan: 'Открыть план',
    tools: 'Исследуй дополнительные инструменты', toolsText: 'В «Кабинете» доступны профориентация, стиль мышления, портфолио и Chach.', openAccount: 'Открыть кабинет →'
  };
  const nextTask = roadmapTasks.find(task => !task.isCompleted);
  const topPrograms = recommendations.slice(0, 3);

  return <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
    <section className="punch-card rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-9">
      <div className="punch-kicker">{copy.workspace}</div>
      <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="text-3xl font-bold sm:text-4xl">{copy.hello}, {profile.name}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{copy.route} {profile.targetYear}.</p></div><button onClick={() => setCurrentStage(2)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-white"><Compass className="h-4 w-4" />{copy.edit}</button></div>
    </section>
    <section className="grid gap-4 md:grid-cols-3"><button onClick={() => setCurrentStage(6)} className="punch-card punch-card-compact rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left hover:border-zinc-600"><div className="flex items-center justify-between"><span className="text-xs font-mono text-zinc-400">{copy.progress}</span><Map className="h-5 w-5 text-emerald-400" /></div><div className="mt-5 text-3xl font-bold">{progressPercentage}%</div><p className="mt-1 text-xs text-zinc-400">{roadmapTasks.filter(task => task.isCompleted).length} / {roadmapTasks.length} {copy.complete}</p></button><button onClick={() => setCurrentStage(7)} className="punch-card punch-card-compact rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left hover:border-zinc-600"><div className="flex items-center justify-between"><span className="text-xs font-mono text-zinc-400">{copy.next}</span><Target className="h-5 w-5 text-amber-400" /></div><div className="mt-5 text-sm font-semibold text-zinc-100">{nextTask?.title || copy.allDone}</div><p className="mt-2 text-xs text-zinc-400">{nextTask?.dueLabel || copy.results}</p></button><button onClick={() => setCurrentStage(4)} className="punch-card punch-card-compact rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left hover:border-zinc-600"><div className="flex items-center justify-between"><span className="text-xs font-mono text-zinc-400">{copy.programmes}</span><BookOpen className="h-5 w-5 text-sky-400" /></div><div className="mt-5 text-3xl font-bold">{recommendations.length}</div><p className="mt-1 text-xs text-zinc-400">{copy.variants}</p></button></section>
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"><div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-xs font-mono text-zinc-400">{copy.fitting}</div><h2 className="mt-1 text-xl font-bold">{copy.continue}</h2></div><button onClick={() => setCurrentStage(4)} className="text-xs text-emerald-400 hover:text-emerald-300">{copy.allOptions}</button></div><div className="mt-5 space-y-2">{topPrograms.map(rec => <button key={rec.university.id} onClick={() => setCurrentStage(4)} className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left hover:border-zinc-600"><div><div className="text-sm font-semibold text-zinc-100">{rec.university.name}</div><div className="mt-0.5 text-xs text-zinc-400">{rec.university.programName}</div></div><span className="text-[11px] text-zinc-400">{rec.chanceCategory}</span></button>)}</div></div><div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6"><CalendarDays className="h-6 w-6 text-emerald-400"/><h2 className="mt-4 text-xl font-bold">{copy.manage}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy.manageText}</p><button onClick={() => setCurrentStage(6)} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">{copy.openPlan} <ArrowRight className="h-4 w-4" /></button></div></section>
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-emerald-400"/><div><div className="font-semibold">{copy.tools}</div><p className="mt-1 text-sm text-zinc-400">{copy.toolsText}</p><button onClick={() => window.dispatchEvent(new Event('open-account-hub'))} className="mt-3 text-sm font-semibold text-emerald-400">{copy.openAccount}</button></div></div></section>
  </div>;
};
