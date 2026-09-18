import { UserProfile, UniversityProgram, ScoredRecommendation, DiagnosticReport, RecommendationTier } from '../types';
import { UNIVERSITIES } from '../data/universities';
import { getEntCombination } from '../data/entCombinations';

/**
 * Нормализация GPA к 5-балльной шкале для сопоставления
 */
export function normalizeGpa(gpa: number, scale: '4.0' | '5.0'): number {
  if (scale === '4.0') {
    return Math.min(5.0, (gpa / 4.0) * 5.0);
  }
  return gpa;
}

export function getBestLanguageTest(profile: UserProfile): { label: string; ieltsEquivalent: number } | null {
  const tests: { label: string; ieltsEquivalent: number }[] = [];
  if (profile.ielts !== null) tests.push({ label: `IELTS ${profile.ielts}`, ieltsEquivalent: profile.ielts });
  if (profile.toefl !== null) {
    const equivalent = profile.toefl >= 110 ? 7.5 : profile.toefl >= 100 ? 7 : profile.toefl >= 90 ? 6.5 : profile.toefl >= 78 ? 6 : profile.toefl >= 60 ? 5.5 : 5;
    tests.push({ label: `TOEFL iBT ${profile.toefl}`, ieltsEquivalent: equivalent });
  }
  if (profile.duolingo !== null) {
    const equivalent = profile.duolingo >= 135 ? 7.5 : profile.duolingo >= 125 ? 7 : profile.duolingo >= 115 ? 6.5 : profile.duolingo >= 105 ? 6 : profile.duolingo >= 95 ? 5.5 : 5;
    tests.push({ label: `Duolingo English Test ${profile.duolingo}`, ieltsEquivalent: equivalent });
  }
  return tests.sort((a, b) => b.ieltsEquivalent - a.ieltsEquivalent)[0] ?? null;
}

/**
 * Анализ профиля и расчет скоринга рекомендаций
 */
export function computeRecommendations(
  profile: UserProfile,
  universities: UniversityProgram[] = UNIVERSITIES
): ScoredRecommendation[] {
  const normGpa = normalizeGpa(profile.gpa, profile.gpaScale);
  const languageTest = getBestLanguageTest(profile);
  const extraExams = profile.additionalExams ?? {};
  const entCombination = getEntCombination(profile.entCombination);
  const scopedUniversities = universities.filter(uni => {
    if (profile.admissionScope === 'kz' && uni.country !== 'kz') return false;
    if (profile.admissionScope === 'international' && uni.country === 'kz') return false;
    // A Kazakhstan application is valid only when the program belongs to the
    // field family opened by the selected ENT subject combination.
    if (uni.country === 'kz' && entCombination && !entCombination.fields.includes(uni.field)) return false;
    return true;
  });

  const scoredList: ScoredRecommendation[] = scopedUniversities.map((uni) => {
    let score = 50; // Базовый скор
    const matchReasons: string[] = [];
    const risks: string[] = [];
    const scholarships: string[] = [];

    // 1. Совпадение по направлению
    const fieldMatch = profile.fields.includes(uni.field);
    if (fieldMatch) {
      score += 20;
      matchReasons.push(`Программа точно соответствует интересу: ${uni.programName}`);
    } else {
      score -= 15;
    }

    // 2. Совпадение по стране
    const countryMatch = profile.targetCountries.includes(uni.country);
    if (countryMatch) {
      score += 15;
    } else {
      score -= 25; // Если страна вообще не выбрана пользователем
    }

    // 3. Академическая успеваемость (GPA)
    if (normGpa >= uni.minGpa) {
      score += 15;
      matchReasons.push(`Ваш средний балл (${profile.gpa.toFixed(2)}) выше проходного (${uni.minGpa})`);
    } else {
      score -= 20;
      risks.push(`Текущий GPA (${profile.gpa.toFixed(2)}) ниже желаемого минимума вуза (${uni.minGpa})`);
    }

    // 4. Языковой тест (IELTS)
    if (uni.country !== 'kz' && uni.minIelts > 0 && languageTest && languageTest.ieltsEquivalent >= uni.minIelts) {
      score += 15;
      matchReasons.push(`${languageTest.label} закрывает языковое требование (эквивалент IELTS ${uni.minIelts}+)`);
    } else if (uni.country !== 'kz' && uni.minIelts > 0 && languageTest) {
      score -= 15;
      risks.push(`${languageTest.label} ниже требуемого языкового уровня (эквивалент IELTS ${uni.minIelts}+)`);
    } else if (uni.country !== 'kz' && uni.minIelts > 0) {
      // IELTS не сдан
      risks.push(`Сертификат IELTS пока не сдан (для поступления нужен балл от ${uni.minIelts})`);
      score -= 10;
    }

    // 5. Тесты SAT и ЕНТ
    if (uni.minSat && uni.country !== 'kz') {
      if (profile.sat && profile.sat >= uni.minSat) {
        score += 15;
        matchReasons.push(`Балл SAT ${profile.sat} конкурентен для отбора (мин. ${uni.minSat})`);
      } else if (profile.sat && profile.sat < uni.minSat) {
        score -= 15;
        risks.push(`Балл SAT ${profile.sat} ниже медианы зачисленных (${uni.minSat})`);
      } else {
        risks.push(`Программа требует или рекомендует SAT (от ${uni.minSat})`);
        score -= 5;
      }
    }

    // NUET — отдельный трек NU. Он не объявляется автоматической заменой SAT:
    // проходной балл и доступные способы подачи меняются по циклам приема.
    if (uni.admissionRoute === 'nu_internal' && extraExams.nuet) {
      score += 8;
      matchReasons.push(`В профиле указан NUET ${extraExams.nuet}: проверьте актуальные правила применения результата в приемном цикле.`);
    }

    // Международные школьные квалификации усиливают академический профиль, но не
    // заменяют опубликованные университетом обязательные пороги.
    if (extraExams.ib && extraExams.ib >= 30) {
      score += 6;
      matchReasons.push(`IB Diploma (${extraExams.ib}/45) добавляет академический контекст заявке.`);
    }
    if (extraExams.a_level_ucas && extraExams.a_level_ucas >= 96) {
      score += 6;
      matchReasons.push(`A-Level / UCAS Tariff (${extraExams.a_level_ucas}) усиливает академический профиль.`);
    }

    if (uni.country === 'kz' && uni.minEnt) {
      if (profile.ent && profile.ent >= uni.minEnt) {
        score += 20;
        matchReasons.push(`Балл ЕНТ ${profile.ent} выше ориентира программы; конкурс грантов остаётся отдельным конкурсом`);
      } else if (profile.ent && profile.ent < uni.minEnt) {
        score -= 20;
        risks.push(`Балл ЕНТ ${profile.ent} рискован для гранта (желательно ${uni.minEnt}+)`);
      }
    }

    // 6. Олимпиады и внеучебная деятельность
    if (profile.olympiadLevel === 'republic' || profile.olympiadLevel === 'international') {
      score += 15;
      matchReasons.push('Олимпиадный бэкграунд дает преимущество в конкурсном отборе портфолио');
    }

    // У творческих, спортивных и военных треков есть обязательные этапы,
    // которые нельзя сводить только к GPA и ЕНТ.
    if (uni.field === 'creative_arts' || uni.field === 'design_media') {
      risks.push('Нужны творческий экзамен и/или портфолио: сверьте формат, дедлайны и требования выбранной программы.');
    }
    if (uni.field === 'sports_tourism') {
      risks.push('Для спортивных программ могут потребоваться медзаключение, нормативы или подтверждение спортивных достижений.');
    }
    if (uni.field === 'aviation_transport') {
      risks.push('Для части авиационных и морских программ нужны профильные медосмотры, языковые требования или психофизиологический допуск.');
    }
    if (uni.admissionRoute === 'military_service') {
      risks.push('Военный трек требует отдельного допуска: eGov-заявка, медкомиссия, психотбор, физподготовка и проверка критериев кандидата.');
    }

    // 7. Финансовое соответствие (Бюджет)
    if (uni.scholarshipAvailable) {
      scholarships.push(`${uni.scholarshipName}: ${uni.scholarshipDetails}`);
    }

    const hasFullFundingPath = uni.tuitionUsdPerYear === 0 || uni.scholarshipCoverage === 'full';

    if (profile.budget === 'grant_only') {
      if (hasFullFundingPath) {
        score += 15;
        matchReasons.push('100% возможность учиться без оплаты за счет гранта/стипендии');
      } else {
        score -= 35;
        risks.push(
          uni.scholarshipAvailable
            ? 'Стипендия доступна только на конкурсной или частичной основе и не гарантирует 100% покрытия.'
            : `Высокая стоимость обучения ($${uni.tuitionUsdPerYear}/год) при нулевом бюджете`
        );
      }
    } else if (profile.budget === 'low_5k') {
      if (uni.tuitionUsdPerYear <= 5000) {
        score += 10;
      } else if (!hasFullFundingPath) {
        score -= 20;
        risks.push(`Стоимость программы ($${uni.tuitionUsdPerYear}) превышает комфортный лимит ($5,000/год), а полного покрытия нет.`);
      }
    }

    // Нормализация скора в диапазон 20 - 98
    const finalScore = Math.max(20, Math.min(98, Math.round(score)));

    // Определение категории (Dream / Target / Safety)
    let tier: RecommendationTier = 'target';
    let chanceCategory: ScoredRecommendation['chanceCategory'] = 'Высокая неопределённость конкурса';

    const hasUnmetRequirement = risks.some(risk => /ниже|Требуется|не сдан|требует|нужен|превышает|не гарантирует/i.test(risk));

    if (!hasUnmetRequirement && finalScore >= 75) {
      tier = 'safety';
      chanceCategory = 'Требования закрыты';
    } else if (finalScore >= 60) {
      tier = 'target';
      chanceCategory = 'Нужно закрыть требования';
    } else {
      tier = 'dream';
      chanceCategory = 'Высокая неопределённость конкурса';
    }

    return {
      university: uni,
      tier,
      matchScore: finalScore,
      chanceCategory,
      whyItFits: {
        title: `Почему ${uni.name} подходит под ваш профиль:`,
        points: matchReasons.length > 0 ? matchReasons.slice(0, 3) : ['Совпадение по профилю и академическому треку'],
        academicFit: normGpa >= uni.minGpa
          ? `Ваш GPA (${profile.gpa.toFixed(2)}) полностью удовлетворяет академическому порогу программы.`
          : `Требуется усилить академический средний балл (порог ${uni.minGpa}).`,
        financialFit: uni.scholarshipAvailable
          ? `${uni.scholarshipName}: ${uni.scholarshipCoverage === 'full' ? 'есть путь к полному покрытию.' : uni.scholarshipCoverage === 'partial' ? 'покрывает часть расходов.' : 'конкурсное финансирование, его получение не гарантировано.'}`
          : `Стоимость обучения составляет ~$${uni.tuitionUsdPerYear} в год + проживание ~$${uni.livingCostUsdPerYear}.`,
        careerFit: uni.careerProspects
      },
      risksAndBottlenecks: risks.length > 0 ? risks : [uni.country === 'kz' ? 'Конкурс на грант зависит от результатов других абитуриентов и ежегодных правил.' : 'Высокая конкуренция среди иностранных аппликантов.'],
      scholarshipOpportunities: scholarships
    };
  });

  // Сортировка: сначала с наивысшим matchScore
  return scoredList.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Генерация AI-диагностики профиля абитуриента
 */
export function generateDiagnostics(
  profile: UserProfile,
  recommendations: ScoredRecommendation[]
): DiagnosticReport {
  const normGpa = normalizeGpa(profile.gpa, profile.gpaScale);
  const languageTest = getBestLanguageTest(profile);
  const strengths: string[] = [];
  const limitations: string[] = [];

  // Сильные стороны
  if (normGpa >= 4.5) {
    strengths.push(`Отличный академический показатель: GPA ${profile.gpa.toFixed(2)} открывает доступ к селективным грантам.`);
  } else if (normGpa >= 4.0) {
    strengths.push(`Уверенный средний балл (GPA ${profile.gpa.toFixed(2)}), достаточный для большинства бакалаврских программ.`);
  }

  if (languageTest && languageTest.ieltsEquivalent >= 7.0) {
    strengths.push(`Высокий уровень английского (${languageTest.label}): дает преимущество при поступлении.`);
  } else if (languageTest && languageTest.ieltsEquivalent >= 6.0) {
    strengths.push(`Рабочий уровень английского (${languageTest.label}), покрывающий стандартные требования.`);
  }

  if (profile.sat && profile.sat >= 1350) {
    strengths.push(`Сильный результат SAT (${profile.sat}) позволяет конкурировать за стипендии в США, Корее и NU.`);
  }

  if (profile.additionalExams?.ib && profile.additionalExams.ib >= 30) {
    strengths.push(`IB Diploma (${profile.additionalExams.ib}/45) подтверждает готовность к международной учебной нагрузке.`);
  }
  if (profile.additionalExams?.a_level_ucas && profile.additionalExams.a_level_ucas >= 96) {
    strengths.push(`A-Level / UCAS Tariff (${profile.additionalExams.a_level_ucas}) усиливает академическую часть заявки.`);
  }

  if (profile.ent && profile.ent >= 110) {
    strengths.push(`Высокий балл ЕНТ (${profile.ent}) гарантирует отличные шансы на грант МОН РК.`);
  }

  if (profile.olympiadLevel === 'republic' || profile.olympiadLevel === 'international') {
    strengths.push('Победы на республиканских/международных олимпиадах — сильнейший дифференциатор для приемных комиссий.');
  }

  if (profile.hasVolunteeringOrProjects) {
    strengths.push('Наличие внеучебных проектов и волонтерства усиливает Holistic Admissions (целостный отбор).');
  }

  if (strengths.length === 0) {
    strengths.push('Четкая мотивация и готовность к поступлению на профильные программы.');
  }

  // Ограничения и риски
  if (!languageTest || languageTest.ieltsEquivalent < 6.0) {
    limitations.push('Отсутствие подтвержденного сертификата IELTS 6.5+ — главный барьер для зарубежных грантов прямо сейчас.');
  }

  if (profile.budget === 'grant_only') {
    limitations.push('Ограничение бюджета: требуются программы со 100% финансированием (госгранты, стипендии DSU/DAAD/KAIST).');
  }

  if (!profile.hasVolunteeringOrProjects && profile.targetCountries.includes('usa')) {
    limitations.push('Для американских вузов критически не хватает внеклассной активности и лидерского портфолио.');
  }

  if (profile.level === 'grade_11' && (!profile.sat || !languageTest)) {
    limitations.push('Сжатые сроки (11 класс): необходимо сдать экзамены в первой половине учебного года до основных дедлайнов.');
  }

  if (limitations.length === 0) {
    limitations.push('Высокая конкуренция в пуле аппликантов на топовые грантовые места.');
  }

  // Расчет индекса готовности (Readiness Score)
  let readiness = 45;
  if (normGpa >= 4.5) readiness += 15;
  if (languageTest && languageTest.ieltsEquivalent >= 6.5) readiness += 15;
  if (profile.sat && profile.sat >= 1300) readiness += 15;
  if (profile.ent && profile.ent >= 105) readiness += 10;
  if (profile.olympiadLevel !== 'none') readiness += 10;
  if (profile.hasVolunteeringOrProjects) readiness += 5;

  const finalReadiness = Math.min(95, Math.max(35, readiness));

  // Формулировка образовательной цели
  const fieldNames: Record<string, string> = {
    cs_it: 'Computer Science & AI',
    engineering: 'Инженерия и робототехника',
    business_econ: 'Бизнес и аналитика',
    medicine_bio: 'Медицина и биотехнологии',
    design_media: 'Дизайн и цифровые медиа',
    humanities_law: 'Гуманитарные науки и право',
    creative_arts: 'Искусство и творческие индустрии',
    sports_tourism: 'Спорт, туризм и гостеприимство',
    military_security: 'Военное дело и безопасность',
    agriculture_environment: 'Агро, ветеринария и экология',
    aviation_transport: 'Авиация и транспортные технологии'
  };

  const selectedFields = profile.fields.map(f => fieldNames[f] || f).join(' / ');
  const goal = `Поступление на бакалавриат по направлению «${selectedFields}» на ${profile.targetYear} год с максимальным покрытием расходов через гранты и стипендии.`;

  const topTierUni = recommendations[0]?.university.name || 'целевые университеты';

  const strategy = profile.budget === 'grant_only'
    ? `Сфокусироваться на триаде: 1 Dream (например, ${topTierUni}), 2 Target с гарантированными региональными грантами (DSU / МОН РК) и 1 Safety. Первоочередной акцент — добор баллов по языку и подача в ранние раунды.`
    : `Стратегия сбалансированной подачи: подача документов в 3-5 программ с распределением рисков и упором на практическое портфолио.`;

  return {
    summary: `Абитуриент ${profile.name ? profile.name : 'пользователь'} ориентируется на направление ${selectedFields}. Обладает ${normGpa >= 4.5 ? 'высоким' : 'уверенным'} академическим потенциалом, планирует старт обучения в ${profile.targetYear} году.`,
    strengths,
    limitations,
    educationalGoal: goal,
    readinessScore: finalReadiness,
    recommendedStrategy: strategy
  };
}
