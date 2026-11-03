import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { WorkflowJourneyBar } from './components/common/WorkflowJourneyBar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SkillsReviewPage } from './pages/SkillsReviewPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { CareerComparisonPage } from './pages/CareerComparisonPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPathwayPage } from './pages/LearningPathwayPage';
import { PracticalProjectsPage } from './pages/PracticalProjectsPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { JobsPage } from './pages/JobsPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isLanding = location.pathname === '/';
  const showWorkflowBar = !isDashboard && !isLanding;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {!isDashboard && <Navbar />}
      {showWorkflowBar && <WorkflowJourneyBar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/skills-review" element={<SkillsReviewPage />} />
          <Route path="/careers" element={<CareerExplorerPage />} />
          <Route path="/careers/compare" element={<CareerComparisonPage />} />
          <Route path="/career-gap" element={<SkillGapPage />} />
          <Route path="/learning" element={<LearningPathwayPage />} />
          <Route path="/projects" element={<PracticalProjectsPage />} />
          <Route path="/readiness" element={<ReadinessPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CareerProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </CareerProvider>
  );
};

export default App;
