import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  },
};

type LanguageContextValue = { language: AppLanguage; setLanguage: (language: AppLanguage) => void; t: (key: keyof typeof dictionaries.ru) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'tusu_language_v1';

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => (localStorage.getItem(STORAGE_KEY) as AppLanguage) || 'ru');
  useEffect(() => { localStorage.setItem(STORAGE_KEY, language); document.documentElement.lang = language === 'kk' ? 'kk' : language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (key: keyof typeof dictionaries.ru) => dictionaries[language][key] || dictionaries.ru[key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
