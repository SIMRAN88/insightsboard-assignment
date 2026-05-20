import { InsightStage } from '../types/insight';

const stages: InsightStage[] = [
  'observation',
  'insight',
  'actionable',
  'impact',
];

export function getNextStage(
  stage: InsightStage
): InsightStage | null {
  const index = stages.indexOf(stage);

  if (index === stages.length - 1) {
    return null;
  }

  return stages[index + 1];
}

export function getPreviousStage(
  stage: InsightStage
): InsightStage | null {
  const index = stages.indexOf(stage);

  if (index === 0) {
    return null;
  }

  return stages[index - 1];
}