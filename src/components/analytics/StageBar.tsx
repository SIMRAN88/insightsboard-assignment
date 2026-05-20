import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import {
  STAGE_COLORS,
} from '../../utils/analytics';

import {
  formatStageLabel,
} from '../../utils/formatStageLabel';
import {
  styles,
} from '../../styles/components/analytics/StageBar.styles';
import {
  StageBarProps,
} from '../../types/components/analytics/StageBar';

export default function StageBar({
  counts,
}: StageBarProps) {

  const total =
    Object.values(counts)
      .reduce(
        (sum, value) =>
          sum + value,
        0
      ) || 1;

  return (

    <View style={styles.container}>

      <View style={styles.bar}>

        {Object.entries(
          counts
        ).map(
          ([stage, count]) => (

            <View
              key={stage}
              style={{
                flex:
                  count / total,

                backgroundColor:
                  STAGE_COLORS[
                    stage as keyof typeof STAGE_COLORS
                  ],
              }}
            />

          )
        )}

      </View>

      {Object.entries(
        counts
      ).map(
        ([stage, count]) => (

          <Text
            key={stage}
            style={
              styles.label
            }
          >
            {
              formatStageLabel(
                stage
              )
            }: {count}
          </Text>

        )
      )}

    </View>

  );

}