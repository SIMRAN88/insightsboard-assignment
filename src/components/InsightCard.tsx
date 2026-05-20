import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Insight } from '../types/insight';
import { formatDistanceToNow } from 'date-fns';
import {
  getNextStage,
  getPreviousStage,
} from '../utils/stage';
import styles from '../styles/InsightCard.styles';
type Props = {
  insight: Insight;

  onMoveStage: (
    insightId: string,
    newStage: string
  ) => void;

  onPress: () => void;
  onLongPress: () => void;
};

const priorityColors: Record<
  'P1' | 'P2' | 'P3' | 'P4',
  string
> = {
  P1: '#EF4444',
  P2: '#F97316',
  P3: '#EAB308',
  P4: '#94A3B8',
};

export default function InsightCard({
  insight,
  onMoveStage,
  onPress,
  onLongPress,
}: Props) {
  const nextStage = getNextStage(
    insight.stage
  );

  const previousStage = getPreviousStage(
    insight.stage
  );
  const safeDate =
    insight.createdAt
      ? new Date(
        insight.createdAt
      )
      : null;

  const relativeTime =
    safeDate &&
      !isNaN(
        safeDate.getTime()
      )
      ? formatDistanceToNow(
        safeDate,
        {
          addSuffix: true,
        }
      )
      : 'Unknown';
  return (
    <Swipeable
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      
      renderRightActions={() =>
        nextStage ? (
          <View style={styles.rightAction}>
            <Text style={styles.actionText}>
              Move → {nextStage}
            </Text>
          </View>
        ) : null
      }
      renderLeftActions={() =>
        previousStage ? (
          <View style={styles.leftAction}>
            <Text style={styles.actionText}>
              ← {previousStage}
            </Text>
          </View>
        ) : null
      }
      onSwipeableOpen={(direction) => {
        if (
          direction === 'right' &&
          nextStage
        ) {
          onMoveStage(
            insight.id,
            nextStage
          );
        }

        if (
          direction === 'left' &&
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
        onLongPress={onLongPress}
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

        <Text style={styles.timestamp}>
          {relativeTime}
        </Text>

        <View style={styles.bottomRow}>
          {/* Priority */}

          <View
            style={[
              styles.priority,
              {
                backgroundColor:
                  priorityColors[
                  insight.priority
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

          {/* Category */}

          {insight.category && (
            <View
              style={[
                styles.category,
                {
                  backgroundColor:
                    insight.category
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
                  insight.category
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

