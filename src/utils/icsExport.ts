import { RoadmapTask } from '../types';

/**
 * Создание и скачивание .ics файла для добавления дедлайнов в календарь
 */
export function exportTasksToICalendar(tasks: RoadmapTask[], studentName: string = 'Абитуриент') {
  const exportedAt = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const events = tasks.map((task) => {
    // Форматирование даты в формат YYYYMMDD
    const cleanDate = task.dueDate.replace(/-/g, '');
    const endDate = nextDate(cleanDate);
    const uid = `admitroute-${task.id}-${cleanDate}@admitroute.ai`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${exportedAt}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeIcsText(`[Поступление] ${task.title}`)}`,
      `DESCRIPTION:${escapeIcsText(`${task.description}\nПриоритет: ${task.priority.toUpperCase()}`)}`,
      `STATUS:${task.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`,
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AdmitRoute AI//Personal Admission Roadmap//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(`Маршрут поступления — ${studentName}`)}`,
    'X-WR-TIMEZONE:Asia/Almaty',
    events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `admitroute-deadlines-${cleanFilename(studentName)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function nextDate(date: string): string {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6)) - 1;
  const day = Number(date.slice(6, 8));
  const next = new Date(Date.UTC(year, month, day + 1));
  return next.toISOString().slice(0, 10).replace(/-/g, '');
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function cleanFilename(str: string): string {
  return str.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-');
}
