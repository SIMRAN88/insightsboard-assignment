import React from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import Swipeable from
  'react-native-gesture-handler/Swipeable';

import {
  PRIORITY_COLORS,
} from '../constants/priorityColors';

import {
  formatRelativeTime,
} from '../utils/date';

import {
  getNextStage,
  getPreviousStage,
} from '../utils/stage';

import styles from '../styles/InsightCard.styles';
import { InsightCardProps } from '../types/InsightCard';


export default function InsightCard({
  insight,
  onMoveStage,
  onPress,
  onLongPress,
}: InsightCardProps) {

  const nextStage =
    getNextStage(
      insight.stage
    );

  const previousStage =
    getPreviousStage(
      insight.stage
    );

  const relativeTime =
    formatRelativeTime(
      insight.createdAt
    );

  return (

    <Swipeable
      friction={2}
      overshootLeft={false}
      overshootRight={false}

      renderRightActions={() =>
        nextStage ? (
          <View
            style={
              styles.rightAction
            }
          >
            <Text
              style={
                styles.actionText
              }
            >
              Move → {nextStage}
            </Text>
          </View>
        ) : null
      }

      renderLeftActions={() =>
        previousStage ? (
          <View
            style={
              styles.leftAction
            }
          >
            <Text
              style={
                styles.actionText
              }
            >
              ← {previousStage}
            </Text>
          </View>
        ) : null
      }

      onSwipeableOpen={(
        direction
      ) => {

        if (
          direction ===
            'right' &&
          nextStage
        ) {

          onMoveStage(
            insight.id,
            nextStage
          );

        }

        if (
          direction ===
            'left' &&
          previousStage
        ) {

          onMoveStage(
            insight.id,
            previousStage
          );

        }

      }}
    >

      <Pressable
        style={styles.card}
        onPress={onPress}
        onLongPress={
          onLongPress
        }
      >

        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {insight.title}
        </Text>

        <Text style={styles.hcp}>
          {insight.hcp?.name ??
            'Unknown HCP'}
        </Text>

        <Text
          style={
            styles.timestamp
          }
        >
          {relativeTime}
        </Text>

        <View
          style={
            styles.bottomRow
          }
        >

          <View
            style={[
              styles.priority,

              {
                backgroundColor:
                  PRIORITY_COLORS[
                    insight
                      .priority
                  ],
              },
            ]}
          >

            <Text
              style={
                styles.priorityText
              }
            >
              {insight.priority}
            </Text>

          </View>

          {insight.category && (

            <View
              style={[
                styles.category,

                {
                  backgroundColor:
                    insight
                      .category
                      .color ??
                    '#64748B',
                },
              ]}
            >

              <Text
                style={
                  styles.categoryText
                }
              >
                {
                  insight
                    .category
                    .name
                }
              </Text>

            </View>

          )}

        </View>

      </Pressable>

    </Swipeable>

  );

}