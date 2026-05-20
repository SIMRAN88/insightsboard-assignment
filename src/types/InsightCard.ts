import { Insight }
    from '../types/insight';
export type InsightCardProps = {
    insight: Insight;

    onMoveStage: (
        insightId: string,
        newStage: string
    ) => void;

    onPress: () => void;

    onLongPress: () => void;
};