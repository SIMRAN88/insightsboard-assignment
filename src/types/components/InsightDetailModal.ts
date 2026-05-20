import { Insight } from '../insight';

export type InsightDetailModalProps = {
  visible: boolean;

  insight: Insight | null;

  onClose: () => void;

  onEdit: () => void;
};

export type ActivitiesQueryData = {
  insightActivitiesCollection: {
    edges: {
      node: {
        id: string;

        action: string;

        fieldName: string;

        oldValue?: string | null;

        newValue?: string | null;

        createdAt: string;

        user?: {
          id: string;

          fullName: string;
        } | null;
      };
    }[];
  };
};