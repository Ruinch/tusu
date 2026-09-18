import { DemoPreset } from '../types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-alikhan',
    title: 'Алихан (11 класс) — Олимпиадник / STEM гранты',
    tagline: 'GPA 4.85, SAT 1440, IELTS 7.5. Цель: Топ-вузы мира и NU на 100% грант',
    avatar: '👨‍🎓',
    profile: {
      name: 'Алихан Сарсенов',
      level: 'grade_11',
      targetYear: 2026,
      fields: ['cs_it'],
      gpa: 4.85,
      gpaScale: '5.0',
      targetCountries: ['kz', 'eu_germany', 'asia_korea', 'usa'],
      budget: 'grant_only',
      ielts: 7.5,
      sat: 1440,
      ent: 128,
      toefl: null,
      duolingo: null,
      olympiadLevel: 'republic',
      hasVolunteeringOrProjects: true,
      notes: 'Призер республиканской олимпиады по информатике, опыт разработки Telegram-ботов и пет-проектов на Python.'
    }
  },
  {
    id: 'preset-diana',
    title: 'Диана (11 класс) — IT в Казахстане (Грант МОН РК)',
    tagline: 'GPA 4.25, ЕНТ 118, IELTS 6.0. Фокус: AITU, КБТУ, КазНУ с господдержкой',
    avatar: '👩‍💻',
    profile: {
      name: 'Диана Жумабаева',
      level: 'grade_11',
      targetYear: 2026,
      fields: ['cs_it', 'engineering'],
      gpa: 4.25,
      gpaScale: '5.0',
      targetCountries: ['kz'],
      budget: 'low_5k',
      ielts: 6.0,
      sat: null,
      ent: 118,
      toefl: null,
      duolingo: null,
      olympiadLevel: 'city',
      hasVolunteeringOrProjects: true,
      notes: 'Сдавала пробные ЕНТ (Мат-Инф), интересуется фронтенд-разработкой и UI/UX, активный волонтер Красного Полумесяца.'
    }
  },
  {
    id: 'preset-timur',
    title: 'Тимур (10 класс) — Ранняя подготовка в Европу',
    tagline: 'GPA 4.4, IELTS 5.5, ограниченный бюджет. Фокус: Стипендия DSU в Италии и Германия',
    avatar: '🚀',
    profile: {
      name: 'Тимур Идрисов',
      level: 'grade_10',
      targetYear: 2027,
      fields: ['engineering'],
      gpa: 4.4,
      gpaScale: '5.0',
      targetCountries: ['eu_italy', 'eu_germany'],
      budget: 'grant_only',
      ielts: 5.5,
      sat: null,
      ent: null,
      toefl: null,
      duolingo: null,
      olympiadLevel: 'school',
      hasVolunteeringOrProjects: false,
      notes: 'Хочет поступить на англоязычный бакалавриат в Милан или Мюнхен. Нужна пошаговая стратегия поднятия языка до B2/C1 и сдачи тестов.'
    }
  }
];
