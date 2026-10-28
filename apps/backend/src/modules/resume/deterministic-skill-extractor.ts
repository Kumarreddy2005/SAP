import { ExtractedSkillItem } from '@career-orchestrator/shared';
import { SkillExtractor, SkillExtractionResult } from './skill-extractor.interface';
import { SKILL_ONTOLOGY, OntologySkillDefinition } from './skill-ontology';

export class DeterministicSkillExtractor implements SkillExtractor {
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    if (!text || text.trim().length === 0) {
      return {
        skills: [],
        detectedCategories: [],
        extractionSummary: 'No extractable text was provided for competency analysis.'
      };
    }

    const matchedSkillsMap = new Map<string, ExtractedSkillItem>();
    const normalizedText = text.replace(/\r\n/g, '\n');
    const sentences = this.splitIntoSentences(normalizedText);

    for (const def of SKILL_ONTOLOGY) {
      // 1. Check for explicit alias matches
      const explicitMatch = this.findExplicitMatch(def, normalizedText, sentences);
      if (explicitMatch) {
        matchedSkillsMap.set(def.code, explicitMatch);
        continue;
      }

      // 2. Check for contextual inference (if defined and not already matched)
      if (def.inferredFrom && def.inferredFrom.length > 0) {
        const inferredMatch = this.findInferredMatch(def, normalizedText, sentences);
        if (inferredMatch) {
          matchedSkillsMap.set(def.code, inferredMatch);
        }
      }
    }

    const skills = Array.from(matchedSkillsMap.values());
    const detectedCategories = Array.from(new Set(skills.map((s) => s.category)));

    return {
      skills,
      detectedCategories,
      extractionSummary: `Identified ${skills.length} candidate competencies across ${detectedCategories.length} categories using deterministic ontology analysis.`
    };
  }

  /**
   * Searches for explicit keyword or alias matches using boundary-safe regex.
   */
  private findExplicitMatch(
    def: OntologySkillDefinition,
    text: string,
    sentences: string[]
  ): ExtractedSkillItem | null {
    for (const alias of def.aliases) {
      const regex = this.buildSafeRegex(alias);
      const match = regex.exec(text);

      if (match) {
        const evidenceSnippet = this.findContextSnippet(alias, sentences, text, match.index);
        
        // Multi-word matches carry higher heuristic confidence than single-word acronyms
        const isMultiWord = alias.includes(' ');
        const heuristicConfidence = isMultiWord ? 0.95 : alias.length > 3 ? 0.90 : 0.82;

        return {
          id: `extracted-${def.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
          code: def.code,
          name: def.name,
          category: def.category,
          proficiency: 'INTERMEDIATE', // Safe baseline; user calibrates in review
          yearsExperience: 2.0,         // Conservative placeholder for user verification
          isConfirmed: false,          // Never auto-confirm; upholds human-in-the-loop principle
          isTransferable: def.isTransferable,
          confidenceScore: heuristicConfidence,
          extractionMethod: 'EXPLICIT_MENTION',
          evidenceSnippet,
          reviewStatus: 'SUGGESTED'
        };
      }
    }

    return null;
  }

  /**
   * Searches for co-occurring contextual signals.
   */
  private findInferredMatch(
    def: OntologySkillDefinition,
    text: string,
    sentences: string[]
  ): ExtractedSkillItem | null {
    if (!def.inferredFrom) return null;

    for (const signal of def.inferredFrom) {
      const regex = this.buildSafeRegex(signal);
      const match = regex.exec(text);

      if (match) {
        const evidenceSnippet = this.findContextSnippet(signal, sentences, text, match.index);

        return {
          id: `inferred-${def.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
          code: def.code,
          name: def.name,
          category: def.category,
          proficiency: 'NOVICE',
          yearsExperience: 1.0,
          isConfirmed: false,
          isTransferable: def.isTransferable,
          confidenceScore: 0.72, // Inferred matches carry lower heuristic confidence
          extractionMethod: 'CONTEXTUAL_INFERENCE',
          evidenceSnippet: `Inferred from mention of "${signal}": ${evidenceSnippet}`,
          reviewStatus: 'SUGGESTED'
        };
      }
    }

    return null;
  }

  /**
   * Builds a boundary-safe regular expression that accounts for symbols such as '#', '+', and '.'
   */
  private buildSafeRegex(term: string): RegExp {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Boundary before and after: can be start/end of line or whitespace or punctuation
    return new RegExp(`(?:^|[\\s,.;:()/\\[\\]{}"'\\-])${escaped}(?:$|[\\s,.;:()/\\[\\]{}"'\\-])`, 'i');
  }

  /**
   * Locates the most relevant sentence or text slice containing the matched term.
   */
  private findContextSnippet(
    term: string,
    sentences: string[],
    fullText: string,
    matchIndex: number
  ): string {
    const lowerTerm = term.toLowerCase();

    // Try finding in pre-split sentences
    const matchedSentence = sentences.find((s) => s.toLowerCase().includes(lowerTerm));
    if (matchedSentence && matchedSentence.length <= 200) {
      return matchedSentence.trim();
    }

    // Fallback: extract surrounding window of 140 chars
    const start = Math.max(0, matchIndex - 50);
    const end = Math.min(fullText.length, matchIndex + term.length + 80);
    let snippet = fullText.slice(start, end).replace(/\s+/g, ' ').trim();

    if (start > 0) snippet = '...' + snippet;
    if (end < fullText.length) snippet = snippet + '...';

    return snippet;
  }

  private splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }
}
