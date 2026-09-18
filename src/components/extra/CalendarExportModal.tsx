import React from 'react';
import { useApp } from '../../context/AppContext';
import { exportTasksToICalendar } from '../../utils/icsExport';
import {
  X,
  Calendar,
  Download,
  Clock,
  Smartphone
} from 'lucide-react';

export const CalendarExportModal: React.FC = () => {
  const {
    isCalendarModalOpen,
    setIsCalendarModalOpen,
    roadmapTasks,
    profile
  } = useApp();

  if (!isCalendarModalOpen) return null;

  const handleDownload = () => {
    exportTasksToICalendar(roadmapTasks, profile.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between gap-4 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-zinc-300" />
            <div>
              <h3 className="text-base font-bold text-white">Календарь контрольных дедлайнов</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Экспорт персонального расписания в iCal / Google Calendar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-zinc-300">
          {/* Action Box */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-zinc-100">
                {roadmapTasks.length} дедлайнов в одном файле
              </div>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Включает даты тестов, дедлайны вузов и стипендий.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать .ICS</span>
            </button>
          </div>

          {/* Guide */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Инструкция по синхронизации:</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                <div className="font-semibold text-zinc-200">Apple Calendar / iOS:</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Откройте скачанный файл <code className="text-zinc-300">.ics</code> и нажмите «Добавить все».
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                <div className="font-semibold text-zinc-200">Google Calendar:</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Настройки Google Календаря → «Импорт и экспорт» → Загрузить файл.
                </p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              Список событий:
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {roadmapTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate text-zinc-200">{t.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                    {t.dueLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-end">
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
