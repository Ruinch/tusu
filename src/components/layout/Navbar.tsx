import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_PRESETS } from '../../data/presets';
import {
  Calendar,
  RotateCcw,
  FileText,
  UserRound,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStage,
    setCurrentStage,
    loadPreset,
    resetAll,
    setIsCalendarModalOpen,
    setIsEssayModalOpen,
    progressPercentage
  } = useApp();

  return (
    <header className="punch-header sticky top-0 z-40 w-full backdrop-blur-md bg-[#09090b]/90 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentStage(1)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="punch-logo w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-sm tracking-tighter group-hover:bg-white transition-colors shadow-sm">
            TU
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-100">
            TUSU<span className="text-zinc-500 font-semibold">.AI</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Jury Presets Dropdown */}
          <div className="hidden relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 hover:border-zinc-600 transition-colors cursor-pointer"
              title="Готовые профили абитуриентов для быстрой проверки жюри"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden xs:inline">Демо-профили</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-semibold">Жюри</span>
              <ChevronDown className="w-3 h-3 text-zinc-500 ml-0.5" />
            </button>

            {/* Menu */}
            <div className="absolute right-0 mt-1.5 w-80 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 hidden group-hover:block group-focus-within:block animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800/80">
                Тестовые сценарии проверки (1 клик)
              </div>
              <div className="space-y-1 mt-1">
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-zinc-800/70 transition-colors group/item cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-200 group-hover/item:text-white">
                        {preset.title.split('—')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {preset.profile.budget === 'grant_only' ? '100% грант' : 'бюджет'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                      {preset.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Essay Advisor */}
          <button
            onClick={() => setIsEssayModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Советник по эссе</span>
          </button>

          {/* Calendar Export */}
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Календарь</span>
          </button>

          {/* Progress bar */}
          {currentStage >= 3 && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-zinc-800">
              <div className="text-right">
                <div className="text-[10px] font-mono text-zinc-400">Прогресс</div>
                <div className="text-xs font-mono font-bold text-zinc-200">{progressPercentage}%</div>
              </div>
              <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-100 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={() => {
              if (window.confirm('Очистить анкету, прогресс и тестовые данные? Приложение откроется как для нового пользователя.')) {
                resetAll();
              }
            }}
            title="Начать заново: очистить все данные"
            aria-label="Начать заново и очистить все данные"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Начать заново</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event('open-account-hub'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            title="Открыть личный кабинет"
          >
            <UserRound className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Кабинет</span>
          </button>
        </div>
      </div>
    </header>
  );
};
