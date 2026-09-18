import { UserProfile, ScoredRecommendation, RoadmapTask } from '../types';
import { getDeadlineForTargetYear } from './admissionCycle';
import { getBestLanguageTest } from './recommendationEngine';
import { getAdmissionChecklist } from './admissionChecklist';
import { getEntCombination } from '../data/entCombinations';

const createTask = (data: Omit<RoadmapTask, 'isCompleted'>): RoadmapTask => ({ ...data, isCompleted: false });

/** Builds a plan from the student's explicitly selected programmes. */
export function generatePersonalRoadmap(profile: UserProfile, recommendations: ScoredRecommendation[], selectedUniversityIds: string[] = []): RoadmapTask[] {
  const targetYear = profile.targetYear;
  const prepYear = targetYear - 1;
  const languageTest = getBestLanguageTest(profile);
  const selectedIds = new Set(selectedUniversityIds);
  const targets = recommendations
    .filter(({ university }) => selectedIds.has(university.id))
    .map(item => item.university);
  const hasKz = profile.targetCountries.includes('kz');
  const hasInternational = profile.targetCountries.some(country => country !== 'kz');
  const minLanguage = Math.max(0, ...targets.map(uni => uni.minIelts));
  const minSat = Math.max(0, ...targets.filter(uni => uni.country !== 'kz').map(uni => uni.minSat ?? 0));
  const minEnt = Math.max(0, ...targets.filter(uni => uni.country === 'kz').map(uni => uni.minEnt ?? 0));
  const q1 = `Q1 (Сентябрь — Ноябрь ${prepYear}): подготовка`;
  const q2 = `Q2 (Декабрь — Февраль): документы и заявки`;
  const q3 = `Q3 (Март — Май ${targetYear}): экзамены и финансирование`;
  const q4 = `Q4 (Июнь — Август ${targetYear}): зачисление`;
  const tasks: RoadmapTask[] = [];
  const entCombination = getEntCombination(profile.entCombination);

  if (hasKz && entCombination) {
    tasks.push(createTask({ id: 'ent-combination', quarter: 'Q1', quarterTitle: q1, title: `Закрепить трек ЕНТ: ${entCombination.subjects}`, description: `Этот сертификат открывает группы программ: ${entCombination.groups}. Не смешивайте его с несовпадающими группами при подаче.`, category: 'exams', dueDate: `${prepYear}-09-20`, dueLabel: `до 20 сентября ${prepYear}`, priority: 'critical', actionGuide: entCombination.specialNote ?? 'Сверяйте актуальный список групп образовательных программ и профильных предметов на сайте НЦТ.' }));
  }

  if (minLanguage > 0 && (!languageTest || languageTest.ieltsEquivalent < minLanguage)) {
    tasks.push(createTask({ id: 'language-test', quarter: 'Q1', quarterTitle: q1, title: `Сдать IELTS / TOEFL: ориентир IELTS ${minLanguage}+`, description: `Сертификат нужен для: ${targets.filter(uni => uni.minIelts > 0).map(uni => uni.name).join(', ')}.`, category: 'exams', dueDate: `${prepYear}-10-25`, dueLabel: `до 25 октября ${prepYear}`, priority: 'critical', actionGuide: 'Сверьте, какие именно сертификаты принимает каждая программа, до регистрации.' }));
  }

  // SAT never appears merely because Kazakhstan is selected.
  if (minSat > 0 && (!profile.sat || profile.sat < minSat)) {
    tasks.push(createTask({ id: 'sat', quarter: 'Q1', quarterTitle: q1, title: `Подготовиться к SAT Digital: ориентир ${minSat}+`, description: `SAT относится к целям: ${targets.filter(uni => (uni.minSat ?? 0) > 0).map(uni => uni.name).join(', ')}. Для программ РК без SAT задача не создаётся.`, category: 'exams', dueDate: `${prepYear}-11-05`, dueLabel: `до 5 ноября ${prepYear}`, priority: 'important', actionGuide: 'Используйте официальные тесты Bluebook и требование конкретной программы.' }));
  }

  const needsPortfolio = profile.fields.some(field => ['creative_arts', 'design_media'].includes(field));
  if (hasInternational || needsPortfolio) {
    tasks.push(createTask({ id: 'portfolio', quarter: 'Q1', quarterTitle: q1, title: needsPortfolio ? 'Собрать творческое портфолио' : 'Упаковать достижения в академическое CV', description: needsPortfolio ? 'Отберите работы, покажите процесс и вашу роль; формат портфолио сверяйте у конкретного вуза.' : 'Соберите проекты, олимпиады, волонтерство и достижения для международных заявок.', category: 'activities', dueDate: `${prepYear}-11-20`, dueLabel: `до 20 ноября ${prepYear}`, priority: 'important', actionGuide: 'Каждая работа должна подтверждать конкретный навык или результат.' }));
  }

  if (hasInternational) {
    tasks.push(createTask({ id: 'translations', quarter: 'Q2', quarterTitle: q2, title: 'Подготовить транскрипт и переводы документов', description: 'Запросите школьный транскрипт и подготовьте только требуемые программой переводы/заверения.', category: 'documents', dueDate: `${prepYear}-12-15`, dueLabel: `до 15 декабря ${prepYear}`, priority: 'critical', actionGuide: 'Сначала откройте требования каждой программы: язык и заверение документов различаются.' }));
    tasks.push(createTask({ id: 'essays', quarter: 'Q2', quarterTitle: q2, title: 'Подготовить эссе и рекомендации, если их запрашивает вуз', description: `Международные цели: ${targets.filter(uni => uni.country !== 'kz').map(uni => uni.name).join(', ')}.`, category: 'documents', dueDate: `${targetYear}-01-20`, dueLabel: `до 20 января ${targetYear}`, priority: 'important', actionGuide: 'Не все программы требуют эссе или рекомендации — сверяйтесь с официальным списком.' }));
  }

  if (hasKz && minEnt > 0 && (!profile.ent || profile.ent < minEnt)) {
    tasks.push(createTask({ id: 'ent', quarter: 'Q3', quarterTitle: q3, title: `Подготовиться к ЕНТ: ориентир от ${minEnt}`, description: `ЕНТ относится к целям: ${targets.filter(uni => uni.country === 'kz' && (uni.minEnt ?? 0) > 0).map(uni => uni.name).join(', ')}. Проходной на грант меняется ежегодно.`, category: 'exams', dueDate: `${targetYear}-05-25`, dueLabel: `до 25 мая ${targetYear}`, priority: 'critical', actionGuide: 'Выберите профильные предметы под группу программ и следите за сроками НЦТ.' }));
  }

  if (targets.some(uni => uni.country === 'eu_italy')) {
    tasks.push(createTask({ id: 'italy-dsu', quarter: 'Q3', quarterTitle: q3, title: 'Подготовить пакет на DSU / региональную стипендию Италии', description: 'Соберите документы о доходах семьи, проверьте перевод и легализацию для выбранного региона.', category: 'finance', dueDate: `${targetYear}-05-15`, dueLabel: `до 15 мая ${targetYear}`, priority: 'important', actionGuide: 'Требования различаются по регионам и меняются по циклам.' }));
  }

  if (hasKz && targets.some(uni => !uni.admissionRoute || uni.admissionRoute === 'kz_grant')) {
    tasks.push(createTask({ id: 'kz-grant', quarter: 'Q4', quarterTitle: q4, title: 'Подать документы на конкурс государственных грантов РК', description: 'Подайте заявление через eGov или приемную комиссию, выбирая только группы программ, совместимые с комбинацией ЕНТ.', category: 'finance', dueDate: `${targetYear}-07-18`, dueLabel: `13–20 июля ${targetYear}`, priority: 'critical', actionGuide: 'Распределите выбор: мечта, реалистичные и надежный вариант в одном треке ЕНТ. Следите за ежегодным приказом о сроках.' }));
  }

  // A university-specific checklist exists only after the student explicitly adds
  // that recommendation to comparison. This avoids presenting unchosen universities
  // as though they were part of the student's admission plan.
  targets.forEach(uni => {
    const deadline = getDeadlineForTargetYear(uni.applicationDeadline, uni.deadlineLabel, targetYear);
    const checklist = getAdmissionChecklist(uni);
    const quarter = deadline.date.slice(5, 7) <= '02' ? 'Q2' : deadline.date.slice(5, 7) <= '05' ? 'Q3' : 'Q4';
    const quarterTitle = quarter === 'Q2' ? q2 : quarter === 'Q3' ? q3 : q4;
    tasks.push(createTask({ id: `apply-${uni.id}`, quarter, quarterTitle, title: `Чек-лист подачи: ${uni.name}`, description: `${checklist.summary}. Официальный источник: ${uni.officialSourceUrl}`, category: 'documents', dueDate: deadline.date, dueLabel: deadline.label, priority: 'critical', relatedUniversityId: uni.id, actionGuide: `Собрать: ${checklist.documents.join(' • ')}. ${checklist.note}` }));
  });

  if (hasInternational) {
    tasks.push(createTask({ id: 'visa-housing', quarter: 'Q4', quarterTitle: q4, title: 'Оформить визу и бронь общежития после оффера', description: 'После Letter of Acceptance подготовьте финансы, страховку и запись в консульство.', category: 'documents', dueDate: `${targetYear}-08-10`, dueLabel: `до 10 августа ${targetYear}`, priority: 'critical', actionGuide: 'Проверяйте список документов только на сайте консульства страны назначения.' }));
  }
  return tasks;
}

export function getImmediateNextAction(tasks: RoadmapTask[]): RoadmapTask | null {
  const today = new Date().toISOString().slice(0, 10);
  const uncompleted = tasks.filter(item => !item.isCompleted);
  if (uncompleted.length === 0) return null;
  const priorityWeight = { critical: 0, important: 1, recommended: 2 };
  return [...uncompleted].sort((a, b) => {
    const aOverdue = a.dueDate < today;
    const bOverdue = b.dueDate < today;
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  })[0];
}
