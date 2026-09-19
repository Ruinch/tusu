import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type AppLanguage = 'ru' | 'kk' | 'en';
type Dictionary = Record<string, string>;

const dictionaries: Record<AppLanguage, Dictionary> = {
  ru: {
    language: 'Язык', step: 'Шаг', russian: 'Русский', kazakh: 'Қазақша', english: 'English',
    login: 'Вход', profile: 'Профиль', diagnostics: 'Диагностика', recommendations: 'Рекомендации', comparison: 'Сравнение', roadmap: 'Roadmap', nextStep: 'Следующий шаг',
    service: 'О сервисе', form: 'Анкета', audit: 'Аудит', universities: 'Вузы', matrix: 'Матрица', plan: 'План', focus: 'Фокус',
    essayAdvisor: 'Советник по эссе', calendar: 'Календарь', startOver: 'Начать заново', account: 'Кабинет', progress: 'Прогресс',
    buildRoute: 'Построить маршрут', routeLead: 'Перестань гуглить,', routeAccent: 'начни действовать', routeDescription: 'Твой понятный маршрут поступления в одном месте',
    profileTitle: 'Параметры абитуриента и академические цели', profileDescription: 'Изменение каждого параметра напрямую влияет на матрицу соответствия и пошаговый роадмап.',
    whereApply: 'Где вы планируете поступать?', kazakhstan: 'Казахстан', abroad: 'Зарубеж', both: 'Казахстан + зарубеж',
    financial: 'Финансовые рамки и география', budget: 'Комфортный бюджет на обучение в год:', countries: 'Приоритетные страны:',
    back: 'Назад', continue: 'Продолжить', compare: 'Сравнить', details: 'Детали', selected: 'Выбрано', all: 'Все', allRegions: 'Все регионы',
    recommendedPrograms: 'Рекомендованные университеты и программы', recommendedDescription: 'Каждая программа сопоставлена с вашим GPA, экзаменами и условиями финансирования.',
    personalRoadmap: 'Пошаговый график поступления', roadmapDescription: 'План подготовки: экзамены, документы, дедлайны стипендий и визы.',
    currentStatus: 'Текущий статус и сроки', applicantName: 'Имя абитуриента', currentGrade: 'Текущий класс / Статус', startYear: 'Год начала учебы в вузе',
    scopeDescription: 'Этот выбор разделяет логику: Казахстан использует ЕНТ и конкурс грантов, а зарубежные заявки — язык, академический профиль и правила конкретного вуза.',
    scopeKz: 'ЕНТ, группы программ, государственный грант, контракт и внутренние экзамены вузов', scopeAbroad: 'IELTS / TOEFL, SAT только при необходимости, документы, виза и правила каждой страны', scopeBoth: 'Два независимых набора задач: ЕНТ для РК и международная заявка для выбранных стран',
    entTitle: 'Выберите комбинацию профильных предметов ЕНТ', entDescription: 'Подаваться можно только на группы программ с той же комбинацией, что указана в сертификате ЕНТ',
    academic: 'Академическая успеваемость и экзамены', subjects: 'Приоритетные специальности', multiSelect: 'Мультивыбор', notTaken: 'Не сдан', optional: 'необязательно',
    grade9: '9 класс (ранняя подготовка)', grade10: '10 класс (активный трек)', grade11: '11 класс (выпускной)', graduate: 'Выпускник школы', gapYear: 'Gap Year (повторное поступление)', autumn: 'Осень',
  },
  kk: {
    language: 'Тіл', step: 'Қадам', russian: 'Орысша', kazakh: 'Қазақша', english: 'English',
    login: 'Кіру', profile: 'Профиль', diagnostics: 'Диагностика', recommendations: 'Ұсынымдар', comparison: 'Салыстыру', roadmap: 'Жоспар', nextStep: 'Келесі қадам',
    service: 'Сервис туралы', form: 'Сауалнама', audit: 'Талдау', universities: 'Университеттер', matrix: 'Матрица', plan: 'Жоспар', focus: 'Фокус',
    essayAdvisor: 'Эссе кеңесшісі', calendar: 'Күнтізбе', startOver: 'Қайта бастау', account: 'Кабинет', progress: 'Прогресс',
    buildRoute: 'Маршрут құру', routeLead: 'Іздеуді тоқтат,', routeAccent: 'әрекет ет', routeDescription: 'Оқуға түсу жолыңыз бір жерде',
    profileTitle: 'Талапкер параметрлері және академиялық мақсаттар', profileDescription: 'Әр параметр сәйкестік матрицасына және жеке жол картасына әсер етеді.',
    whereApply: 'Қайда оқуға түсуді жоспарлайсыз?', kazakhstan: 'Қазақстан', abroad: 'Шетел', both: 'Қазақстан + шетел',
    financial: 'Қаржылық шеңбер және география', budget: 'Жылдық оқу бюджеті:', countries: 'Басым елдер:',
    back: 'Артқа', continue: 'Жалғастыру', compare: 'Салыстыру', details: 'Толығырақ', selected: 'Таңдалды', all: 'Барлығы', allRegions: 'Барлық өңірлер',
    recommendedPrograms: 'Ұсынылған университеттер мен бағдарламалар', recommendedDescription: 'Әр бағдарлама GPA, емтихандар және қаржыландыру шарттарымен салыстырылды.',
    personalRoadmap: 'Оқуға түсу кестесі', roadmapDescription: 'Дайындық жоспары: емтихандар, құжаттар, грант мерзімдері және виза.',
    currentStatus: 'Қазіргі мәртебе және мерзімдер', applicantName: 'Талапкердің аты', currentGrade: 'Қазіргі сынып / Мәртебе', startYear: 'Университеттегі оқу басталатын жыл',
    scopeDescription: 'Бұл таңдау логиканы бөледі: Қазақстанда ЕНТ мен грант конкурсы, ал шетелде тіл, академиялық профиль және нақты университет ережелері қолданылады.',
    scopeKz: 'ЕНТ, бағдарламалар топтары, мемлекеттік грант, келісімшарт және университет ішкі емтихандары', scopeAbroad: 'IELTS / TOEFL, қажет болса SAT, құжаттар, виза және әр елдің талаптары', scopeBoth: 'Екі бөлек міндеттер жинағы: Қазақстанға ЕНТ және таңдалған елдерге халықаралық өтінім',
    entTitle: 'ЕНТ бейіндік пәндерінің комбинациясын таңдаңыз', entDescription: 'Сертификаттағы комбинацияға сәйкес келетін бағдарлама топтарына ғана өтініш бере аласыз',
    academic: 'Академиялық үлгерім және емтихандар', subjects: 'Басым мамандықтар', multiSelect: 'Бірнеше таңдау', notTaken: 'Тапсырылмаған', optional: 'міндетті емес',
    grade9: '9-сынып (ерте дайындық)', grade10: '10-сынып (белсенді бағыт)', grade11: '11-сынып (бітіруші)', graduate: 'Мектеп түлегі', gapYear: 'Gap Year (қайта түсу)', autumn: 'Күз',
  },
  en: {
    language: 'Language', step: 'Step', russian: 'Русский', kazakh: 'Қазақша', english: 'English',
    login: 'Welcome', profile: 'Profile', diagnostics: 'Diagnostics', recommendations: 'Recommendations', comparison: 'Compare', roadmap: 'Roadmap', nextStep: 'Next step',
    service: 'About', form: 'Form', audit: 'Audit', universities: 'Universities', matrix: 'Matrix', plan: 'Plan', focus: 'Focus',
    essayAdvisor: 'Essay advisor', calendar: 'Calendar', startOver: 'Start over', account: 'Account', progress: 'Progress',
    buildRoute: 'Build my route', routeLead: 'Stop googling,', routeAccent: 'start acting', routeDescription: 'Your clear admission route in one place',
    profileTitle: 'Applicant profile and academic goals', profileDescription: 'Every parameter directly affects your fit matrix and admission roadmap.',
    whereApply: 'Where are you planning to apply?', kazakhstan: 'Kazakhstan', abroad: 'Abroad', both: 'Kazakhstan + abroad',
    financial: 'Financial framework and geography', budget: 'Comfortable annual tuition budget:', countries: 'Priority countries:',
    back: 'Back', continue: 'Continue', compare: 'Compare', details: 'Details', selected: 'Selected', all: 'All', allRegions: 'All regions',
    recommendedPrograms: 'Recommended universities and programmes', recommendedDescription: 'Each programme is matched against your GPA, exams and funding conditions.',
    personalRoadmap: 'Step-by-step admission timeline', roadmapDescription: 'Preparation plan: exams, documents, scholarship deadlines and visas.',
    currentStatus: 'Current status and timeline', applicantName: 'Applicant name', currentGrade: 'Current grade / status', startYear: 'University start year',
    scopeDescription: 'This choice separates the logic: Kazakhstan uses the UNT and state-grant competition, while international applications rely on language, academic profile and each university’s rules.',
    scopeKz: 'UNT, programme groups, state grants, tuition and internal university exams', scopeAbroad: 'IELTS / TOEFL, SAT only when needed, documents, visa and country-specific requirements', scopeBoth: 'Two independent task sets: UNT for Kazakhstan and international applications for selected countries',
    entTitle: 'Choose your UNT subject combination', entDescription: 'You can apply only to programme groups matching the combination shown on your UNT certificate',
    academic: 'Academic performance and exams', subjects: 'Priority study fields', multiSelect: 'Multiple choice', notTaken: 'Not taken', optional: 'optional',
    grade9: 'Grade 9 (early preparation)', grade10: 'Grade 10 (active track)', grade11: 'Grade 11 (graduating)', graduate: 'School graduate', gapYear: 'Gap year (reapplying)', autumn: 'Autumn',
  },
};

// Legacy components still contain Russian copy. This table keeps the switcher
// comprehensive while those screens are progressively moved to t('key').
const legacyCopy: Record<string, { kk: string; en: string }> = {
  'Советник по эссе': { kk: 'Эссе кеңесшісі', en: 'Essay advisor' }, 'Календарь': { kk: 'Күнтізбе', en: 'Calendar' }, 'Начать заново': { kk: 'Қайта бастау', en: 'Start over' }, 'Кабинет': { kk: 'Кабинет', en: 'Account' },
  'Диагностика': { kk: 'Диагностика', en: 'Diagnostics' }, 'Рекомендации': { kk: 'Ұсынымдар', en: 'Recommendations' }, 'Сравнение': { kk: 'Салыстыру', en: 'Compare' }, 'Следующий шаг': { kk: 'Келесі қадам', en: 'Next step' },
  'Текущий статус и сроки': { kk: 'Қазіргі мәртебе және мерзімдер', en: 'Current status and timeline' }, 'Имя абитуриента': { kk: 'Талапкердің аты', en: 'Applicant name' }, 'Текущий класс / Статус': { kk: 'Қазіргі сынып / Мәртебе', en: 'Current grade / status' }, 'Год начала учебы в вузе': { kk: 'Университеттегі оқу басталатын жыл', en: 'University start year' },
  'Приоритетные специальности': { kk: 'Басым мамандықтар', en: 'Priority study fields' }, 'Мультивыбор': { kk: 'Бірнеше таңдау', en: 'Multiple choice' }, 'Академическая успеваемость и экзамены': { kk: 'Академиялық үлгерім және емтихандар', en: 'Academic performance and exams' },
  'Финансовые рамки и география': { kk: 'Қаржылық шеңбер және география', en: 'Financial framework and geography' }, 'Комфортный бюджет на обучение в год:': { kk: 'Жылдық оқу бюджеті:', en: 'Comfortable annual tuition budget:' }, 'Приоритетные страны:': { kk: 'Басым елдер:', en: 'Priority countries:' },
  'Назад': { kk: 'Артқа', en: 'Back' }, 'Детали': { kk: 'Толығырақ', en: 'Details' }, 'Сравнить': { kk: 'Салыстыру', en: 'Compare' }, 'Выбран': { kk: 'Таңдалды', en: 'Selected' }, 'Все': { kk: 'Барлығы', en: 'All' }, 'Все регионы': { kk: 'Барлық өңірлер', en: 'All regions' },
  'Рекомендованные университеты и программы': { kk: 'Ұсынылған университеттер мен бағдарламалар', en: 'Recommended universities and programmes' }, 'Сравнение вариантов': { kk: 'Нұсқаларды салыстыру', en: 'Compare options' }, 'Пошаговый график поступления': { kk: 'Оқуға түсу кестесі', en: 'Admission timeline' },
  'Личный кабинет': { kk: 'Жеке кабинет', en: 'Personal account' }, 'Твоя рабочая зона': { kk: 'Сенің жұмыс кеңістігің', en: 'Your workspace' }, 'Спросить Chach': { kk: 'Chach-тан сұрау', en: 'Ask Chach' }, 'Стиль мышления': { kk: 'Ойлау стилі', en: 'Thinking style' }, 'Профориентация': { kk: 'Мамандық таңдауы', en: 'Career guidance' }, 'Портфолио': { kk: 'Портфолио', en: 'Portfolio' },
  'Создать профиль TUSU.AI': { kk: 'TUSU.AI профилін құру', en: 'Create a TUSU.AI profile' }, 'Войти в кабинет': { kk: 'Кабинетке кіру', en: 'Sign in' }, 'Нет аккаунта? Создать': { kk: 'Аккаунт жоқ па? Құру', en: 'No account? Create one' }, 'Войти': { kk: 'Кіру', en: 'Sign in' },
  'Тест психотипа MBTI': { kk: 'MBTI ойлау стилі тесті', en: 'MBTI personality test' }, 'Тест профориентации': { kk: 'Мамандық таңдау тесті', en: 'Career guidance test' }, 'Вернуться в кабинет': { kk: 'Кабинетке оралу', en: 'Return to account' },
  'Общий прогресс:': { kk: 'Жалпы прогресс:', en: 'Overall progress:' }, 'Экзамены': { kk: 'Емтихандар', en: 'Exams' }, 'Документы и эссе': { kk: 'Құжаттар және эссе', en: 'Documents and essays' }, 'Гранты и стипендии': { kk: 'Гранттар мен шәкіртақылар', en: 'Grants and scholarships' }, 'Внеучебка': { kk: 'Сабақтан тыс', en: 'Activities' },
};

type LanguageContextValue = { language: AppLanguage; setLanguage: (language: AppLanguage) => void; t: (key: keyof typeof dictionaries.ru) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'tusu_language_v1';

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => (localStorage.getItem(STORAGE_KEY) as AppLanguage) || 'ru');
  const originalText = useRef(new WeakMap<Text, string>());
  useEffect(() => { localStorage.setItem(STORAGE_KEY, language); document.documentElement.lang = language === 'kk' ? 'kk' : language; }, [language]);
  useEffect(() => {
    const translateNode = (node: Text) => {
      const original = originalText.current.get(node) ?? node.nodeValue ?? '';
      originalText.current.set(node, original);
      const translated = language === 'ru' ? original : legacyCopy[original.trim()]?.[language];
      if (translated) node.nodeValue = original.replace(original.trim(), translated);
      else if (language === 'ru') node.nodeValue = original;
    };
    const translateTree = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) translateNode(node as Text);
    };
    translateTree(document.body);
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => translateTree(node))));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (key: keyof typeof dictionaries.ru) => dictionaries[language][key] || dictionaries.ru[key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
