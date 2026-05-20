import React from 'react';

import {
  Card,
  Text,
} from 'react-native-paper';

import { styles } from '../../styles/components/analytics/KPICard.styles';
import { KPICardProps } from '../../types/components/analytics/KPICard';

export default function KPICard({
  title,
  value,
}: KPICardProps) {

  return (
    <Card style={styles.card}>

      <Card.Content>

        <Text variant="labelMedium">
          {title}
        </Text>

        <Text
          variant="headlineMedium"
          style={styles.value}
        >
          {value}
        </Text>

      </Card.Content>

    </Card>
  );

}