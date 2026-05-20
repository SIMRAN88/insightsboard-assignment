import { subWeeks, startOfWeek, format } from 'date-fns';
import { Insight } from '../types/insight';

export const STAGE_COLORS = {
  observation: '#6366F1',
  insight: '#06B6D4',
  actionable: '#22C55E',
  impact: '#F59E0B',
} as const;

export function getStageCounts(insights: Insight[]) {
  return {
    observation: insights.filter(i => i.stage === 'observation').length,
    insight: insights.filter(i => i.stage === 'insight').length,
    actionable: insights.filter(i => i.stage === 'actionable').length,
    impact: insights.filter(i => i.stage === 'impact').length,
  };
}

export function buildWeeklyTrend(
  insights: Insight[],
) {
  const weeks = Array.from({
    length: 8,
  }).map((_, index) => {
    const date =
      subWeeks(new Date(), 7 - index);

    return {
      label: format(date, 'MMM d'),
      count: 0,
      start: startOfWeek(date),
    };
  });

  insights.forEach(insight => {
    if (!insight.createdAt) return;

    const created =
      startOfWeek(
        new Date(insight.createdAt),
      );

    const bucket = weeks.find(
      week =>
        week.start.getTime() ===
        created.getTime(),
    );

    if (bucket) {
      bucket.count += 1;
    }
  });

  return {
    labels: weeks.map(w => w.label),
    data: weeks.map(w => w.count),
  };
}