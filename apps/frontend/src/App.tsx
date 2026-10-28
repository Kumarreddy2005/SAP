import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SkillsReviewPage } from './pages/SkillsReviewPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { CareerComparisonPage } from './pages/CareerComparisonPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPathwayPage } from './pages/LearningPathwayPage';
import { PracticalProjectsPage } from './pages/PracticalProjectsPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { JobsPage } from './pages/JobsPage';

export const App: React.FC = () => {
  return (
    <CareerProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F6F7' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
          <Footer />
        </div>
      </BrowserRouter>
    </CareerProvider>
  );
};

export default App;
