import { gql } from '@apollo/client';

export const UPDATE_INSIGHT_STAGE = gql`
mutation UpdateInsight(
  $filter: InsightsFilter!
  $set: InsightsUpdateInput!
) {
  updateInsightsCollection(
    filter: $filter
    set: $set
  ) {
    affectedCount

    records {
      nodeId
      id
      title
      stage
      priority
      updatedAt
    }
  }
}
`;

export const CREATE_ACTIVITY = gql`
mutation CreateActivity(
  $input:[InsightActivitiesInsertInput!]!
) {
  insertIntoInsightActivitiesCollection(
    objects:$input
  ) {
    affectedCount
  }
}
`;

export const UPDATE_INSIGHT =
gql`
mutation UpdateInsight(
  $filter: InsightsFilter!
  $set: InsightsUpdateInput!
) {
  updateInsightsCollection(
    filter: $filter
    set: $set
  ) {
    affectedCount
  }
}
`;
