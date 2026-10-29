import { CareerRole } from '@career-orchestrator/shared';
import { CAREER_CATALOGUE } from '../../../backend/src/modules/career/career.catalogue';

export interface ExtendedCareerRole extends CareerRole {
  isSapEcosystem?: boolean;
  matchScoreDemo: number;
  averageSalaryUsd: string;
  learningHoursEstimate: number;
}

export const DEMO_CAREER_ROLES: ExtendedCareerRole[] = CAREER_CATALOGUE.map((role) => ({
  ...role,
  isSapEcosystem: role.ecosystem === 'SAP',
  matchScoreDemo: role.slug === 'sap-s4hana-finance-consultant' ? 78 : role.slug === 'enterprise-business-analyst' ? 82 : role.slug === 'sap-analytics-cloud-consultant' ? 74 : role.slug === 'sap-abap-cloud-developer' ? 62 : 55,
  averageSalaryUsd:
    role.ecosystem === 'SAP'
      ? '$115,000 – $145,000'
      : role.ecosystem === 'HYBRID'
      ? '$100,000 – $130,000'
      : '$105,000 – $140,000',
  learningHoursEstimate: role.planningHoursEstimate || 80
}));
