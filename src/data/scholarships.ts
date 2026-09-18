export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  coverage: string;
  country: string;
  deadline: string;
  targetCriteria: string;
  keyRequirements: string[];
  link: string;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'kz-mon-grant',
    name: 'Государственный образовательный грант МОН РК',
    provider: 'Министерство науки и высшего образования РК',
    coverage: '100% стоимости обучения + ежемесячная стипендия (~47,000–52,000 ₸)',
    country: 'Казахстан',
    deadline: '13-20 июля 2026',
    targetCriteria: 'ЕНТ от 90-115+ баллов (в зависимости от вуза и профиля)',
    keyRequirements: [
      'Сертификат ЕНТ профильной комбинации (Математика-Информатика / Физика)',
      'Аттестат об окончании школы',
      'Квоты для сельской молодежи, победителей олимпиад'
    ],
    link: 'https://testcenter.kz'
  },
  {
    id: 'italy-dsu',
    name: 'Стипендия DSU (Diritto allo Studio Universitario)',
    provider: 'Региональные власти Италии (Ломбардия, Лацио, Пьемонт)',
    coverage: 'Бесплатное обучение + выплата до €7,500 в год + льготное общежитие',
    country: 'Италия (Polimi, Sapienza, UniTo и др.)',
    deadline: 'Июль — Август 2026',
    targetCriteria: 'Низкий/средний показатель семейного дохода (эквивалент ISEE Parificato < €25,000)',
    keyRequirements: [
      'Официальный оффер или зачисление в итальянский вуз',
      'Справки о доходах семьи и недвижимости с апостилем и переводом (Декларация ISEE)',
      'Регистрация на портале Universitaly'
    ],
    link: 'https://www.polimi.it/en/international-prospective-students/how-to-apply'
  },
  {
    id: 'germany-daad',
    name: 'Deutschlandstipendium / DAAD Поддержка',
    provider: 'Федеральное правительство Германии и фонды вузов (TUM, LMU)',
    coverage: '€300 в месяц (€3,600 в год) + нетворкинг с менторами и компаниями',
    country: 'Германия',
    deadline: 'Июнь — Июль 2026',
    targetCriteria: 'Выдающаяся успеваемость (Abitur/GPA 4.8+) и социальная активность',
    keyRequirements: [
      'Подтверждение зачисления в университет Германии',
      'Мотивационное письмо и CV в европейском формате Europass',
      'Сертификат немецкого (TestDaF/DSD) или английского языка (IELTS 6.5+)'
    ],
    link: 'https://www.deutschlandstipendium.de'
  },
  {
    id: 'korea-kaist-grant',
    name: 'KAIST International Student Fellowship',
    provider: 'Институт науки и технологий KAIST',
    coverage: '100% стоимости обучения на 4 года + ~350,000 KRW/мес на карманные расходы',
    country: 'Южная Корея',
    deadline: 'Январь 2026 (Regular) / Октябрь 2025 (Early)',
    targetCriteria: 'Сильный STEM профиль, победы в олимпиадах или высокий балл SAT/IELTS',
    keyRequirements: [
      'Аттестат со средним баллом от 4.7/5.0',
      '2 рекомендательных письма от учителей математики/физики',
      'Сертификат IELTS от 6.5 или TOEFL iBT 83'
    ],
    link: 'https://admission.kaist.ac.kr'
  }
];
