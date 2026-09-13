export interface AdvisorRule {
  id: string;
  category: 'meeting' | 'progress' | 'integrity' | 'writing' | 'defense' | 'custom';
  title: string;
  description: string;
  isMandatory: boolean;
  severity: 'high' | 'medium' | 'info';
  checkListItems: string[];
}

export interface Milestone {
  id: string;
  phase: number;
  title: string;
  shortDesc: string;
  targetTimeline: string;
  deliverables: string[];
  checkItems: { id: string; text: string; completed: boolean }[];
  advisorTips: string;
}

export interface ThesisFAQ {
  id: string;
  category: 'topic' | 'literature' | 'methodology' | 'results' | 'discussion' | 'formatting' | 'defense';
  categoryName: string;
  question: string;
  shortAnswer: string;
  detailedGuidance: string[];
  commonMistakes: string[];
  advisorChecklist: string[];
  phraseBankSuggestions?: string[];
}

export interface SectionGuide {
  title: string;
  purpose: string;
  essentialElements: string[];
  advisorTips: string[];
  sentenceStarters: { label: string; examples: string[] }[];
  pitfallsToAvoid: string[];
}

export interface ChapterGuide {
  chapterNumber: number;
  chapterCode: string;
  title: string;
  subTitle: string;
  estimatedPages: string;
  coreObjective: string;
  sections: SectionGuide[];
  exemplarSnippet: {
    title: string;
    content: string;
    analysis: string;
  };
}

export interface ExemplarChapter {
  chapterTitle: string;
  highlight: string;
  advisorComment: string;
  sampleExcerpt: string;
}

export interface ExemplarThesis {
  id: string;
  title: string;
  author: string;
  degree: '碩士論文' | '博士論文';
  year: number;
  field: string;
  methodologyType: '量化研究' | '質性研究' | '混合研究' | '系統/工程開發';
  awardOrHonor: string;
  abstract: string;
  researchQuestions: string[];
  frameworkSummary: string;
  chapters: ExemplarChapter[];
  keyTakeaways: string[];
  downloadableTemplateOutline: string;
}

export interface FormatSpec {
  id: string;
  standardName: string;
  description: string;
  fontRules: { zh: string; en: string; titleSize: string; bodySize: string; lineHeight: string };
  margins: string;
  figureTableRules: { tableTitlePosition: string; figureTitlePosition: string; noteFormat: string };
  citationRules: { inTextChinese: string; inTextEnglish: string; multipleAuthors: string };
  referenceTemplates: { type: string; template: string; sample: string }[];
}

export interface DiagnosticIssue {
  type: 'logic' | 'academic_tone' | 'format' | 'advisor_rule' | 'citation';
  severity: 'warning' | 'error' | 'suggestion';
  title: string;
  snippet: string;
  suggestion: string;
  advisorGuidelineRef?: string;
}

export interface DiagnosticResult {
  overallScore: number;
  logicCoherenceScore: number;
  academicToneScore: number;
  advisorRuleComplianceScore: number;
  critiqueSummary: string;
  strengths: string[];
  issues: DiagnosticIssue[];
  rewrittenSample: string;
  nextStepAdvice: string;
}

export interface DefenseQuestion {
  id: string;
  category: 'motivation' | 'literature' | 'methodology' | 'contribution' | 'limitation';
  categoryLabel: string;
  question: string;
  committeeIntent: string; // 委員背後的考量
  responseStrategy: string; // 建議回答架構
  trapToAvoid: string;
}

export interface ThesisStep {
  id: string;
  phase: 1 | 2;
  stepNumber: number;
  globalIndex: number;
  title: string;
  category: 'topic' | 'review' | 'writing' | 'oral' | 'admin' | 'data' | 'publication' | 'revision' | 'graduation';
  categoryLabel: string;
  importantReminders: string[];
  description: string;
  recommendedDuration?: string;
  actionItems: string[];
}

export interface StudentProgressRecord {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  photoURL?: string;
  thesisTopic?: string;
  currentPhase: 1 | 2;
  currentStepNumber?: number;
  currentStepTitle?: string;
  completedSteps: string[];
  stepDates: Record<string, string>;
  stepNotes: Record<string, string>;
  lastUpdated: string;
}
