import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';

interface StepInfo {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  subtitle: string;
}

export const Stepper: React.FC = () => {
  const { currentStage, setCurrentStage } = useApp();
  const { t } = useLanguage();
  const steps: StepInfo[] = [
    { number: 1, title: t('login'), subtitle: t('service') }, { number: 2, title: t('profile'), subtitle: t('form') },
    { number: 3, title: t('diagnostics'), subtitle: t('audit') }, { number: 4, title: t('recommendations'), subtitle: t('universities') },
    { number: 5, title: t('comparison'), subtitle: t('matrix') }, { number: 6, title: t('roadmap'), subtitle: t('plan') },
    { number: 7, title: t('nextStep'), subtitle: t('focus') }
  ];

  return (
    <div className="w-full bg-[#09090b] border-b border-zinc-800/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile View */}
        <div className="sm:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400">
              {t('step')} {currentStage} / 7
            </span>
            <span className="font-semibold text-zinc-200">
              {steps[currentStage - 1].title} — {steps[currentStage - 1].subtitle}
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-200 transition-all duration-300"
              style={{ width: `${(currentStage / 7) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStage(step.number)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors shrink-0 ${
                  currentStage === step.number
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : currentStage > step.number
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    : 'bg-zinc-950 text-zinc-400'
                }`}
              >
                0{step.number} {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Pipeline View */}
        <nav aria-label="Progress" className="hidden sm:block">
          <ol className="flex items-center justify-between gap-2 w-full">
            {steps.map((step) => {
              const isCurrent = currentStage === step.number;
              const isPast = currentStage > step.number;

              return (
                <li key={step.number} className="flex-1">
                  <button
                    onClick={() => setCurrentStage(step.number)}
                    className={`w-full group text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-zinc-900 border-zinc-600 shadow-sm'
                        : isPast
                        ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                        : 'bg-transparent border-transparent hover:border-zinc-800/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-zinc-100 text-zinc-950'
                            : isPast
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {isPast ? <Check className="w-3 h-3 text-emerald-400" /> : `0${step.number}`}
                      </span>

                      <div className="truncate">
                        <div
                          className={`text-xs font-semibold leading-none truncate ${
                            isCurrent ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 truncate hidden md:block">
                          {step.subtitle}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
