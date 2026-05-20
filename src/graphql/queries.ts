import { gql } from '@apollo/client';

export const GET_INSIGHTS = gql`
  query GetInsights {
    insightsCollection(
      first: 50
      orderBy: [{ createdAt: DescNullsLast }]
    ) {
      edges {
        node {
          nodeId
          id
          title
          description
          stage
          priority
          drugName
          createdAt
          updatedAt

          hcp {
            nodeId
            id
            name
            specialty
            institution
          }

          category {
            nodeId
            id
            name
            color
          }
        }
      }
    }
  }
`;


export const GET_CATEGORIES = gql`
query Categories {
  categoriesCollection {
    edges {
      node {
        id
        name
        color
      }
    }
  }
}
`;

export const SEARCH_HCPS = gql`
query SearchHcps(
  $filter: HcpsFilter
) {
  hcpsCollection(
    first: 8
    filter: $filter
  ) {
    edges {
      node {
        id
        name
        specialty
        institution
      }
    }
  }
}
`;

export const GET_TAGS = gql`
query GetTags {
  tagsCollection {
    edges {
      node {
        id
        name
      }
    }
  }
}
`;

// export const GET_ACTIVITIES = gql`
// query GetActivities {

//   insightActivitiesCollection(
//     first:5
//   ) {

//     edges {

//       node {

//         id

//         insightId

//         action

//         fieldName

//         oldValue

//         newValue
//       }

//     }

//   }

// }
// `;


export const GET_ACTIVITIES = gql`
query GetActivities(
  $insightId: UUID!
) {

  insightActivitiesCollection(

    first:5

    filter:{
      insightId:{
        eq:$insightId
      }
    }

    orderBy:[
      {
        createdAt:
        DescNullsLast
      }
    ]

  ) {

    edges {

      node {

        id

        insightId

        action

        fieldName

        oldValue

        newValue

        createdAt
         
          user {

    id

    fullName

  }

      }

    }

  }

}
`;