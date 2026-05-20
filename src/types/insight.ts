export type InsightStage =
  | 'observation'
  | 'insight'
  | 'actionable'
  | 'impact';

export type InsightPriority =
  | 'P1'
  | 'P2'
  | 'P3'
  | 'P4';

export interface Hcp {
  id: string;
  name: string;
  specialty: string;
  institution: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Insight {
  nodeId: string;

  id: string;

  title: string;

  description?: string | null;

  stage: InsightStage;

  priority: InsightPriority;

  drugName?: string | null;

  categoryId?: string;

  hcpId?: string;

  tags?: string[];

  createdAt: string;

  updatedAt: string;

  hcp?: Hcp | null;

  category?: Category | null;

  updatedBy?: string;

  updatedByName?: string;
}

export interface InsightsResponse {
  insightsCollection: {
    edges: {
      node: Insight;
    }[];
  };
}