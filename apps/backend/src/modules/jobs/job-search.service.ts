import {
  ExternalJobSearchLink,
  RoleJobSearchResponse,
  CareerRole
} from '@career-orchestrator/shared';
import { getRoleByIdOrSlug } from '../career/career.catalogue';

export class JobSearchService {
  /**
   * Generates authenticated, properly encoded external search links for a career role.
   */
  generateSearchDestinations(
    roleIdOrSlug: string,
    options?: { location?: string; keywords?: string }
  ): RoleJobSearchResponse | null {
    const role = getRoleByIdOrSlug(roleIdOrSlug);
    if (!role) return null;

    const location = (options?.location || 'Remote').trim();
    const query = (options?.keywords || role.title).trim();

    // Key technical and functional skills associated with role
    const keySkills = role.requiredSkills.map((r) => r.skillName).slice(0, 3);
    const techQuery = `${query} ${keySkills.slice(0, 2).join(' ')}`.trim();

    const destinationLinks: ExternalJobSearchLink[] = [
      {
        portalName: 'SAP Official Careers Portal',
        portalKey: 'SAP_OFFICIAL',
        destinationUrl: `https://jobs.sap.com/search/?q=${encodeURIComponent(query)}&locationsearch=${encodeURIComponent(location)}`,
        roleKeywords: query,
        suggestedLocation: location,
        targetSkillsQuery: keySkills,
        isVerified: true,
        notes: 'Official corporate and ecosystem job openings directly hosted by SAP SE.',
        instructions:
          'Click to explore verified global opportunities and consulting partner engagements on jobs.sap.com.'
      },
      {
        portalName: 'LinkedIn Global Talent Search',
        portalKey: 'LINKEDIN',
        destinationUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(techQuery)}&location=${encodeURIComponent(location)}`,
        roleKeywords: techQuery,
        suggestedLocation: location,
        targetSkillsQuery: keySkills,
        isVerified: true,
        notes: 'Verified external professional network search query pre-filtered for target competencies.',
        instructions:
          'Opens LinkedIn Jobs with pre-filtered search terms. Review enterprise hiring requirements and connect with recruiters.'
      },
      {
        portalName: 'Indeed Enterprise Career Engine',
        portalKey: 'INDEED',
        destinationUrl: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`,
        roleKeywords: query,
        suggestedLocation: location,
        targetSkillsQuery: keySkills,
        isVerified: true,
        notes: 'Broad corporate employer search aggregation across Fortune 500 enterprises.',
        instructions:
          'Explores direct corporate postings and consulting agency listings with salary transparency data.'
      }
    ];

    const recommendedPreparationSkills = role.requiredSkills
      .filter((r) => r.isMandatory)
      .map((r) => r.skillName);

    return {
      roleId: role.id,
      roleSlug: role.slug,
      roleTitle: role.title,
      searchQueryUsed: query,
      locationUsed: location,
      destinationLinks,
      recommendedPreparationSkills,
      disclaimer:
        'Zero Fabrication Policy: All job search destinations link directly to official third-party career portals. Career Orchestrator strictly refrains from fabricating synthetic employment vacancies, does not scrape private employer databases without authorization, and does not predict commercial hiring outcomes.'
    };
  }
}

export const jobSearchService = new JobSearchService();
