import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Stepper } from './components/layout/Stepper';
import { Footer } from './components/layout/Footer';
import { Stage1Hero } from './components/stages/Stage1Hero';
import { Stage2Profile } from './components/stages/Stage2Profile';
import { Stage3Diagnostic } from './components/stages/Stage3Diagnostic';
import { Stage4Recommendations } from './components/stages/Stage4Recommendations';
import { Stage5Compare } from './components/stages/Stage5Compare';
import { Stage6Roadmap } from './components/stages/Stage6Roadmap';
import { Stage7NextAction } from './components/stages/Stage7NextAction';
import { AccountHub } from './components/extra/AccountHub';
import { AuthGate } from './components/extra/AuthGate';
import { Dashboard } from './components/dashboard/Dashboard';
import { LanguageProvider } from './context/LanguageContext';

const EssayAdvisorModal = lazy(() => import('./components/extra/EssayAdvisorModal').then(module => ({ default: module.EssayAdvisorModal })));
const CalendarExportModal = lazy(() => import('./components/extra/CalendarExportModal').then(module => ({ default: module.CalendarExportModal })));
const UniversityDetailModal = lazy(() => import('./components/extra/UniversityDetailModal').then(module => ({ default: module.UniversityDetailModal })));

const MainContent: React.FC = () => {
  const { currentStage, profile } = useApp();
  const hasRoute = profile.name.trim().length > 0 && profile.fields.length > 0 && profile.targetCountries.length > 0;

  return (
    <main className="flex-1 w-full flex flex-col">
      <div key={currentStage} className="anim-fade-in-up">
        {currentStage === 1 && (hasRoute ? <Dashboard /> : <Stage1Hero />)}
        {currentStage === 2 && <Stage2Profile />}
        {currentStage === 3 && <Stage3Diagnostic />}
        {currentStage === 4 && <Stage4Recommendations />}
        {currentStage === 5 && <Stage5Compare />}
        {currentStage === 6 && <Stage6Roadmap />}
        {currentStage === 7 && <Stage7NextAction />}
      </div>
    </main>
  );
};

export function App() {
  return (
    <LanguageProvider>
    <AppProvider>
      <div className="punch-shell oxide-shell min-h-screen bg-[#09090b] text-zinc-100 selection:bg-amber-200 selection:text-zinc-950 font-sans">
        <div className="punch-terminal min-h-screen flex flex-col">
          <Navbar />
          <div className="punch-masthead" aria-label="TUSU AI admissions control plane">
            <div className="punch-masthead-mark">◉</div>
            <div><div className="punch-system-title">TUSU<span>.AI</span></div><div className="punch-system-subtitle">ADMISSIONS CONTROL PLANE · KZ / GLOBAL</div></div>
          </div>
          <Stepper />
          <MainContent />
          <Footer />
          <AccountHub />
          <AuthGate />

          {/* These are loaded only when a user opens the corresponding action. */}
          <Suspense fallback={null}>
            <EssayAdvisorModal />
            <CalendarExportModal />
            <UniversityDetailModal />
          </Suspense>
        </div>
      </div>
    </AppProvider>
    </LanguageProvider>
  );
}

export default App;
