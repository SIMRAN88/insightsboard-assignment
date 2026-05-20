import { Card, Text } from 'react-native-paper';

type Props = {
  title: string;
  value: string | number;
};

export default function KPICard({
  title,
  value,
}: Props) {
  return (
    <Card style={{ flex: 1 }}>
      <Card.Content>
        <Text variant="labelMedium">
          {title}
        </Text>

        <Text
          variant="headlineMedium"
          style={{ marginTop: 8 }}
        >
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}