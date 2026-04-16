export interface ScanData {
  url: string;
  metadata: {
    title: string;
    description: string;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    imgCount: number;
    formCount: number;
    linkCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    scriptCount: number;
    imgWithAlt: number;
    ariaLabelCount: number;
    structuredDataCount: number;
    sectionCount: number;
    pageTextLength: number;
    metaKeywords: string;
    canonical: string;
    ogTitle: string;
    hasViewport: boolean;
    hasRobots: boolean;
  };
  content: string;
}

export interface AnalysisReport {
  overallScore: number;
  categories: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
  }>;
}
