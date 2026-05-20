import React, {
  useEffect,
  useState,
} from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useQuery,
} from '@apollo/client/react';

import {
  GET_ACTIVITIES,
} from '../graphql/queries';

import {
  useDebounce,
} from '../hooks/useDebounce';

import {
  formatActivityTime,
} from '../utils/date';

import styles from
  '../styles/InsightDetailModal.styles';

import {
  ActivitiesQueryData,
  InsightDetailModalProps,
} from '../types/components/InsightDetailModal';

export default function InsightDetailModal({
  visible,
  insight,
  onClose,
  onEdit,
}: InsightDetailModalProps) {

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

  const debouncedFields =
    useDebounce(
      highlightedFields,
      3000
    );

  useEffect(() => {

    const latest =
      activitiesData
        ?.insightActivitiesCollection
        ?.edges?.[0]
        ?.node;

    if (!latest?.fieldName) {
      return;
    }

    setHighlightedFields([
      latest.fieldName,
    ]);

  }, [activitiesData]);

  useEffect(() => {

    if (
      debouncedFields.length >
      0
    ) {

      setHighlightedFields(
        []
      );

    }

  }, [debouncedFields]);

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
                {
                  insight.description
                }
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
                  {
                    insight.priority
                  }
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
                    insight.hcp.name
                  }
                </Text>

                <Text>
                  {
                    insight.hcp.specialty
                  }
                </Text>

                <Text>
                  {
                    insight.hcp.institution
                  }
                </Text>

              </View>

            )}

            <View style={styles.section}>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Activity Timeline
              </Text>

              {activitiesData
                ?.insightActivitiesCollection
                ?.edges
                ?.length === 0 ? (

                <Text
                  style={
                    styles.emptyActivity
                  }
                >
                  No activity yet
                </Text>

              ) : (

                activitiesData
                  ?.insightActivitiesCollection
                  ?.edges
                  ?.map(
                    ({
                      node,
                    }) => (

                      <View
                        key={node.id}
                        style={
                          styles.activityRow
                        }
                      >

                        <View
                          style={
                            styles.timelineDot
                          }
                        />

                        <View
                          style={
                            styles.activityContent
                          }
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

                          <Text
                            style={
                              styles.activityTime
                            }
                          >

                            {
                              formatActivityTime(
                                node.createdAt
                              )
                            }

                          </Text>

                        </View>

                      </View>

                    )
                  )

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