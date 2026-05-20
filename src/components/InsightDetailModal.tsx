import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Insight } from '../types/insight';
import {
  GET_ACTIVITIES
} from
  '../graphql/queries';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
type Props = {
  visible: boolean;

  insight: Insight | null;

  onClose: () => void;
  onEdit: () => void;
};
type ActivitiesQueryData = {
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

export default function InsightDetailModal({
  visible,
  insight,
  onClose,
  onEdit,
}: Props) {
  const [
    highlightedFields,
    setHighlightedFields,
  ] = useState<string[]>([]);
  const {
    data: activitiesData,
  } =
    useQuery<ActivitiesQueryData>(
      GET_ACTIVITIES,
      {
        variables: {
          insightId:
            insight?.id,
        },

        skip:
          !insight,
      }
    );
  console.log(
    'ACTIVITIES DATA',
    activitiesData
  );

  useEffect
    (() => {

      if (
        !activitiesData
          ?.insightActivitiesCollection
          ?.edges?.length
      ) {
        return;
      }

      const latest =
        activitiesData
          .insightActivitiesCollection
          .edges[0]
          ?.node;

      if (!latest?.fieldName) {
        return;
      }

      setHighlightedFields([
        latest.fieldName,
      ]);

      const timer =
        setTimeout(() => {

          setHighlightedFields([]);

        }, 3000);

      return () =>
        clearTimeout(timer);

    }, [activitiesData]);
  if (!insight) {
    return null;
  }




  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            contentContainerStyle={
              styles.content
            }
          >
            <View
              style={[
                styles.flashContainer,

                highlightedFields.includes(
                  'title'
                ) &&
                styles.flashHighlight,
              ]}
            >

              <Text style={styles.title}>
                {insight.title}
              </Text>

            </View>

            <View
              style={[
                styles.flashContainer,

                highlightedFields.includes(
                  'description'
                ) &&
                styles.flashHighlight,
              ]}
            >

              <Text
                style={styles.description}
              >
                {insight.description}
              </Text>

            </View>

            <View style={styles.section}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Insight Details
              </Text>

              <View
                style={[
                  styles.flashContainer,

                  highlightedFields.includes(
                    'priority'
                  ) &&
                  styles.flashHighlight,
                ]}
              >

                <Text>
                  Priority:{' '}
                  {insight.priority}
                </Text>

              </View>

              <View
                style={[
                  styles.flashContainer,

                  highlightedFields.includes(
                    'stage'
                  ) &&
                  styles.flashHighlight,
                ]}
              >

                <Text>
                  Stage:{' '}
                  {insight.stage}
                </Text>

              </View>
              <Text>
                Drug:{' '}
                {insight.drugName ??
                  'N/A'}
              </Text>
            </View>

            {insight.hcp && (
              <View
                style={
                  styles.section
                }
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  HCP Information
                </Text>

                <Text>
                  {
                    insight.hcp
                      .name
                  }
                </Text>

                <Text>
                  {
                    insight.hcp
                      .specialty
                  }
                </Text>

                <Text>
                  {
                    insight.hcp
                      .institution
                  }
                </Text>
              </View>
            )}



            <View style={styles.section}>
              <Text
                style={styles.sectionTitle}
              >
                Activity Timeline
              </Text>

              {activitiesData
                ?.insightActivitiesCollection
                ?.edges?.length === 0 ? (
                <Text
                  style={{
                    color: '#64748B',
                  }}
                >
                  No activity yet
                </Text>
              ) : (
                activitiesData
                  ?.insightActivitiesCollection
                  ?.edges
                  ?.map(({ node }) => {
                    console.log(node.createdAt, 'createdAt');
                    return (
                      <View
                        key={node.id}
                        style={styles.activityRow}
                      >
                        <View
                          style={styles.timelineDot}
                        />

                        <View
                          style={styles.activityContent}
                        >

                          <Text
                            style={
                              styles.activityField
                            }
                          >

                            {
                              node.user
                                ?.fullName ??
                              'Unknown User'
                            }

                            {' updated '}

                            {
                              node.fieldName
                            }

                          </Text>

                          <Text
                            style={
                              styles.activityChange
                            }
                          >

                            "{node.oldValue || '—'}"

                            <Text
                              style={
                                styles.activityArrow
                              }
                            >
                              {' → '}
                            </Text>

                            "{node.newValue || '—'}"

                          </Text>

                          <Text style={styles.activityTime}>
                            {node.createdAt
                              ? new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }).format(
                                new Date(String(node.createdAt))
                              )
                              : 'Unknown time'}
                          </Text>
                        </View>
                      </View>
                    );
                  })
              )}
            </View>

            <View
              style={
                styles.actions
              }
            >
              <Pressable
                style={
                  styles.button
                }
                onPress={onEdit}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Edit
                </Text>
              </Pressable>

              <Pressable
                style={
                  styles.button
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Move
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0,0,0,0.4)',
  },
  activityRow: {
    flexDirection: 'row',

    marginTop: 16,

    paddingBottom: 16,

    borderBottomWidth: 1,

    borderBottomColor:
      '#E5E7EB',
  },

  timelineDot: {
    width: 10,

    height: 10,

    borderRadius: 999,

    backgroundColor:
      '#4F46E5',

    marginTop: 6,

    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityField: {
    fontSize: 14,

    fontWeight: '700',

    color: '#111827',

    marginBottom: 4,
  },

  activityChange: {
    fontSize: 14,

    color: '#475569',

    lineHeight: 22,
  },

  activityArrow: {
    color: '#4F46E5',

    fontWeight: '700',
  },

  activityTime: {
    marginTop: 8,

    fontSize: 12,

    color: '#9CA3AF',
  },
  // activityRow: {
  //   marginTop: 12,

  //   paddingBottom: 12,

  //   borderBottomWidth: 1,

  //   borderColor: '#E2E8F0',
  // },

  activityUser: {
    fontWeight: '700',

    color: '#111827',
  },

  // activityTime: {
  //   marginTop: 4,

  //   fontSize: 12,

  //   color: '#64748B',
  // },
  backdrop: {
    flex: 1,
  },

  sheet: {
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  handle: {
    width: 48,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 12,
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },

  button: {
    flex: 1,
    backgroundColor: '#3F51B5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  flashContainer: {
    borderRadius: 10,
    padding: 6,
  },

  flashHighlight: {
    backgroundColor: '#FEF08A',
  },
});