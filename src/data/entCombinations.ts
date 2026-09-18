import { StudyField } from '../types';

export type EntCombinationId = 'math_physics' | 'math_informatics' | 'math_geography' | 'biology_chemistry' | 'biology_geography' | 'foreign_world_history' | 'geography_foreign' | 'world_history_law' | 'world_history_geography' | 'language_literature' | 'chemistry_physics' | 'creative_exams';
export type EntCombination = { id: EntCombinationId; subjects: string; title: string; groups: string; fields: StudyField[]; specialNote?: string };

/** Current ENT profile combinations, explained in plain language for the KZ flow. */
export const ENT_COMBINATIONS: EntCombination[] = [
  { id: 'math_physics', subjects: 'Математика + Физика', title: 'Техника и инженерия', groups: 'Инженерия, энергетика, строительство, транспорт, часть педагогических направлений', fields: ['engineering', 'aviation_transport'] },
  { id: 'math_informatics', subjects: 'Математика + Информатика', title: 'IT и вычисления', groups: 'Информационные системы, Computer Science, кибербезопасность, data-направления', fields: ['cs_it'] },
  { id: 'math_geography', subjects: 'Математика + География', title: 'Экономика и управление', groups: 'Экономика, финансы, менеджмент, маркетинг, логистика', fields: ['business_econ'] },
  { id: 'biology_chemistry', subjects: 'Биология + Химия', title: 'Медицина и здоровье', groups: 'Медицина, стоматология, фармация, сестринское дело, биотехнологии', fields: ['medicine_bio'] },
  { id: 'biology_geography', subjects: 'Биология + География', title: 'Агро и экология', groups: 'Агрономия, экология, животноводство, ветеринария, часть педагогики', fields: ['agriculture_environment', 'medicine_bio'] },
  { id: 'foreign_world_history', subjects: 'Иностранный язык + Всемирная история', title: 'Языки и международные отношения', groups: 'Переводческое дело, иностранная филология, международные отношения', fields: ['humanities_law'] },
  { id: 'geography_foreign', subjects: 'География + Иностранный язык', title: 'Туризм и сервис', groups: 'Туризм, гостинично-ресторанное дело, сервис', fields: ['sports_tourism'] },
  { id: 'world_history_law', subjects: 'Всемирная история + Основы права', title: 'Право', groups: 'Право, правоохранительная деятельность', fields: ['humanities_law', 'military_security'] },
  { id: 'world_history_geography', subjects: 'Всемирная история + География', title: 'Общество и гуманитарные науки', groups: 'История, археология, философия, социология, регионоведение', fields: ['humanities_law'] },
  { id: 'language_literature', subjects: 'Язык + Литература', title: 'Филология и медиа', groups: 'Казахская/русская филология, журналистика, подготовка учителей языка', fields: ['humanities_law', 'design_media'] },
  { id: 'chemistry_physics', subjects: 'Химия + Физика', title: 'Химическая инженерия', groups: 'Химическая инженерия и процессы, производство, материалы', fields: ['engineering', 'medicine_bio'] },
  { id: 'creative_exams', subjects: '2 творческих экзамена', title: 'Творческий конкурс', groups: 'Дизайн, архитектура, искусство, музыка, спорт и часть медиа', fields: ['creative_arts', 'design_media', 'sports_tourism'], specialNote: 'На ЕНТ сдаются обязательные предметы; два творческих экзамена проводит выбранный вуз.' },
];

export const getEntCombination = (id?: EntCombinationId) => ENT_COMBINATIONS.find(item => item.id === id);
