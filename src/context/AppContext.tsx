import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  ScoredRecommendation,
  DiagnosticReport,
  RoadmapTask,
  UniversityProgram,
  DemoPreset
} from '../types';
import { UNIVERSITIES } from '../data/universities';
import { computeRecommendations, generateDiagnostics } from '../utils/recommendationEngine';
import { generatePersonalRoadmap } from '../utils/roadmapGenerator';
import { getEarliestTargetYear } from '../utils/admissionCycle';
import { getStoredSession, isSupabaseConfigured, loadUserRoute, saveUserRoute } from '../lib/supabase';

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface AppContextType {
  currentStage: StageNumber;
  setCurrentStage: (stage: StageNumber) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  loadPreset: (preset: DemoPreset) => void;
  resetAll: () => void;
  recommendations: ScoredRecommendation[];
  diagnostics: DiagnosticReport;
  roadmapTasks: RoadmapTask[];
  toggleTaskCompletion: (taskId: string) => void;
  comparedUniIds: string[];
  toggleCompareUni: (uniId: string) => void;
  clearCompare: () => void;
  selectedUniForDetail: UniversityProgram | null;
  setSelectedUniForDetail: (uni: UniversityProgram | null) => void;
  isEssayModalOpen: boolean;
  setIsEssayModalOpen: (open: boolean) => void;
  isCalendarModalOpen: boolean;
  setIsCalendarModalOpen: (open: boolean) => void;
  progressPercentage: number;
}

const DEFAULT_PROFILE: UserProfile = {
  // Стартовое состояние не содержит демо-данных: пользователь заполняет анкету с нуля.
  name: '',
  level: 'grade_11',
  targetYear: getEarliestTargetYear(),
  fields: [],
  gpa: 3.0,
  gpaScale: '5.0',
  targetCountries: [],
  admissionScope: undefined,
  entCombination: undefined,
  budget: 'grant_only',
  ielts: null,
  sat: null,
  ent: null,
  toefl: null,
  duolingo: null,
  additionalExams: {},
  olympiadLevel: 'none',
  hasVolunteeringOrProjects: false,
  notes: ''
};

const STORAGE_KEY_PROFILE = 'admitroute_profile_v1';
const STORAGE_KEY_STAGE = 'admitroute_stage_v1';
const STORAGE_KEY_TASKS = 'admitroute_tasks_completed_v1';
const STORAGE_KEY_COMPARE = 'admitroute_compare_v1';

const isProfileComplete = (profile: UserProfile) => (
  profile.name.trim().length > 0 && profile.fields.length > 0 && profile.targetCountries.length > 0 && (profile.admissionScope !== 'kz' || Boolean(profile.entCombination))
);

const loadStoredProfile = (): UserProfile => {
  const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
  if (!saved) return DEFAULT_PROFILE;

  try {
    const stored = JSON.parse(saved) as Partial<UserProfile>;
    return {
      ...DEFAULT_PROFILE,
      ...stored,
      // Старые сохранения не должны открывать уже прошедший набор.
      targetYear: Math.max(stored.targetYear ?? getEarliestTargetYear(), getEarliestTargetYear())
    };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const ROADMAP_INPUT_KEYS: (keyof UserProfile)[] = [
  'level', 'targetYear', 'fields', 'gpa', 'gpaScale', 'targetCountries', 'admissionScope', 'entCombination', 'budget',
  'ielts', 'sat', 'ent', 'toefl', 'duolingo', 'additionalExams', 'olympiadLevel', 'hasVolunteeringOrProjects'
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Загрузка состояния из localStorage
  const [currentStage, setCurrentStageState] = useState<StageNumber>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STAGE);
    if (saved) {
      const n = parseInt(saved);
      if (n >= 1 && n <= 7) {
        return n >= 3 && !isProfileComplete(loadStoredProfile()) ? 2 : n as StageNumber;
      }
    }
    return 1;
  });

  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [comparedUniIds, setComparedUniIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPARE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [selectedUniForDetail, setSelectedUniForDetail] = useState<UniversityProgram | null>(null);
  const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Синхронизация с localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STAGE, currentStage.toString());
  }, [currentStage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(comparedUniIds));
  }, [comparedUniIds]);

  useEffect(() => {
    const session = getStoredSession();
    if (!session || !isSupabaseConfigured) return;
    const timer = window.setTimeout(() => {
      saveUserRoute(session, profile, completedTaskIds, comparedUniIds).catch(() => {
        // Local storage remains the resilient fallback if the user is offline.
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [profile, completedTaskIds, comparedUniIds]);

  // После входа подтягиваем сохраненный маршрут с другого устройства.
  useEffect(() => {
    const restoreRemoteRoute = () => {
      const session = getStoredSession();
      if (!session || !isSupabaseConfigured) return;
      loadUserRoute(session).then((route) => {
        if (!route) return;
        setProfile(prev => ({ ...DEFAULT_PROFILE, ...prev, ...(route.profile as Partial<UserProfile>) }));
        setCompletedTaskIds(Array.isArray(route.completed_task_ids) ? route.completed_task_ids : []);
        setComparedUniIds(Array.isArray(route.compared_uni_ids) ? route.compared_uni_ids : []);
      }).catch(() => {
        // Локальная версия остается доступной, если таблица еще не создана или сеть недоступна.
      });
    };
    restoreRemoteRoute();
    window.addEventListener('tusu-auth-changed', restoreRemoteRoute);
    return () => window.removeEventListener('tusu-auth-changed', restoreRemoteRoute);
  }, []);

  const setCurrentStage = (stage: StageNumber) => {
    // Нельзя показывать «персональный» расчет без минимально заполненной анкеты.
    if (stage >= 3 && !isProfileComplete(profile)) {
      setCurrentStageState(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentStageState(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const changesRoadmap = ROADMAP_INPUT_KEYS.some((key) => key in updates);
    if (changesRoadmap) setCompletedTaskIds([]);
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const loadPreset = (preset: DemoPreset) => {
    setProfile({
      ...preset.profile,
      // Старые демонстрационные сценарии не должны формировать план с прошедшими сроками.
      targetYear: Math.max(preset.profile.targetYear, getEarliestTargetYear())
    });
    setCompletedTaskIds([]);
    setCurrentStageState(3); // Сразу переводим жюри на экран диагностики для оценки
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAll = () => {
    // Очищаем также данные AccountHub, которые живут в localStorage отдельно.
    localStorage.clear();
    // Сбрасываем всё состояние компонентов за один раз, как при первом открытии сайта.
    window.location.reload();
  };

  // Реактивный пересчет рекомендаций
  const recommendations = useMemo(() => {
    return computeRecommendations(profile, UNIVERSITIES);
  }, [profile]);

  // Реактивный расчет диагностики
  const diagnostics = useMemo(() => {
    return generateDiagnostics(profile, recommendations);
  }, [profile, recommendations]);

  // Реактивная генерация дорожной карты
  const roadmapTasks = useMemo(() => {
    const rawTasks = generatePersonalRoadmap(profile, recommendations);
    return rawTasks.map(task => ({
      ...task,
      isCompleted: completedTaskIds.includes(task.id)
    }));
  }, [profile, recommendations, completedTaskIds]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleCompareUni = (uniId: string) => {
    if (!comparedUniIds.includes(uniId) && comparedUniIds.length >= 3) {
      window.alert('В сравнении может быть не больше трёх программ. Удалите один вариант, чтобы добавить другой.');
      return;
    }

    setComparedUniIds(prev => {
      if (prev.includes(uniId)) {
        return prev.filter(id => id !== uniId);
      }
      return [...prev, uniId];
    });
  };

  const clearCompare = () => {
    setComparedUniIds([]);
  };

  // Расчет общего прогресса
  const progressPercentage = useMemo(() => {
    if (roadmapTasks.length === 0) return 0;
    const completedCount = roadmapTasks.filter(t => t.isCompleted).length;
    return Math.round((completedCount / roadmapTasks.length) * 100);
  }, [roadmapTasks]);

  return (
    <AppContext.Provider
      value={{
        currentStage,
        setCurrentStage,
        profile,
        updateProfile,
        loadPreset,
        resetAll,
        recommendations,
        diagnostics,
        roadmapTasks,
        toggleTaskCompletion,
        comparedUniIds,
        toggleCompareUni,
        clearCompare,
        selectedUniForDetail,
        setSelectedUniForDetail,
        isEssayModalOpen,
        setIsEssayModalOpen,
        isCalendarModalOpen,
        setIsCalendarModalOpen,
        progressPercentage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
