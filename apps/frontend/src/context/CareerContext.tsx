import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthResponse, ProficiencyLevel } from '@career-orchestrator/shared';
import { INITIAL_DEMO_SKILLS, UserSkillItem } from '../demo/demoSkills';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';

export interface ManualProfileData {
  fullName: string;
  currentTitle: string;
  yearsExperience: number;
  education: string;
  responsibilities: string;
}

export interface ProjectEvidenceSubmission {
  projectId: string;
  submissionUrl: string;
  reflectionText: string;
  submittedAt: string;
}

interface CareerContextType {
  // Profile State
  manualProfile: ManualProfileData;
  setManualProfile: React.Dispatch<React.SetStateAction<ManualProfileData>>;
  uploadedFile: { name: string; size: number; type: string } | null;
  setUploadedFile: (file: { name: string; size: number; type: string } | null) => void;
  
  // Skills State
  skills: UserSkillItem[];
  confirmSkill: (id: string) => void;
  rejectSkill: (id: string) => void;
  updateProficiency: (id: string, proficiency: ProficiencyLevel) => void;
  addManualSkill: (skill: Omit<UserSkillItem, 'id'>) => void;
  
  // Career Targets & Comparison
  targetRole: ExtendedCareerRole;
  targetRoleSlug: string;
  setTargetRoleSlug: (slug: string) => void;
  comparisonRoleSlugs: string[];
  toggleComparisonRole: (slug: string) => void;
  
  // Learning & Projects
  completedLearningIds: string[];
  toggleLearningCompletion: (id: string) => void;
  projectSubmissions: Record<string, ProjectEvidenceSubmission>;
  submitProjectEvidence: (projectId: string, url: string, reflection: string) => void;
  
  // Backend Health
  backendHealth: HealthResponse | null;
  healthStatus: 'checking' | 'online' | 'offline';
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [manualProfile, setManualProfile] = useState<ManualProfileData>({
    fullName: 'Alex Vance',
    currentTitle: 'Senior Financial Analyst',
    yearsExperience: 4.5,
    education: "Bachelor of Science in Accounting & Information Systems",
    responsibilities: 'Manage general ledger journal reconciliation, statutory balance sheet audits, and SQL-based variance audits.'
  });

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);

  // 2. Skills State
  const [skills, setSkills] = useState<UserSkillItem[]>(INITIAL_DEMO_SKILLS);

  const confirmSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isConfirmed: true } : s))
    );
  };

  const rejectSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const updateProficiency = (id: string, proficiency: ProficiencyLevel) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proficiency } : s))
    );
  };

  const addManualSkill = (newSkill: Omit<UserSkillItem, 'id'>) => {
    const item: UserSkillItem = {
      ...newSkill,
      id: `manual-skill-${Date.now()}`
    };
    setSkills((prev) => [item, ...prev]);
  };

  // 3. Career Role Selection & Comparison
  const [targetRoleSlug, setTargetRoleSlug] = useState<string>('sap-s4hana-finance-consultant');
  const [comparisonRoleSlugs, setComparisonRoleSlugs] = useState<string[]>([
    'sap-s4hana-finance-consultant',
    'sap-abap-cloud-developer'
  ]);

  const targetRole =
    DEMO_CAREER_ROLES.find((r) => r.slug === targetRoleSlug) || DEMO_CAREER_ROLES[0];

  const toggleComparisonRole = (slug: string) => {
    setComparisonRoleSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 career roles side-by-side.');
        return prev;
      }
      return [...prev, slug];
    });
  };

  // 4. Learning & Projects Evidence
  const [completedLearningIds, setCompletedLearningIds] = useState<string[]>(['learn-s4f01']);
  const [projectSubmissions, setProjectSubmissions] = useState<Record<string, ProjectEvidenceSubmission>>({});

  const toggleLearningCompletion = (id: string) => {
    setCompletedLearningIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submitProjectEvidence = (projectId: string, url: string, reflection: string) => {
    setProjectSubmissions((prev) => ({
      ...prev,
      [projectId]: {
        projectId,
        submissionUrl: url,
        reflectionText: reflection,
        submittedAt: new Date().toISOString()
      }
    }));
  };

  // 5. Backend Health Check
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => {
        setBackendHealth(data);
        setHealthStatus('online');
      })
      .catch(() => {
        setHealthStatus('offline');
      });
  }, []);

  return (
    <CareerContext.Provider
      value={{
        manualProfile,
        setManualProfile,
        uploadedFile,
        setUploadedFile,
        skills,
        confirmSkill,
        rejectSkill,
        updateProficiency,
        addManualSkill,
        targetRole,
        targetRoleSlug,
        setTargetRoleSlug,
        comparisonRoleSlugs,
        toggleComparisonRole,
        completedLearningIds,
        toggleLearningCompletion,
        projectSubmissions,
        submitProjectEvidence,
        backendHealth,
        healthStatus
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareerContext = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareerContext must be used within a CareerProvider');
  }
  return context;
};
