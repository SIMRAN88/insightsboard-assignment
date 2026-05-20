import { View, Text } from 'react-native';
import { STAGE_COLORS } from '../../utils/analytics';

export default function StageBar({
    counts,
}: {
    counts: Record<string, number>;
}) {
    const total =
        Object.values(counts).reduce(
            (a, b) => a + b,
            0,
        ) || 1;

    return (
        <View>

            <View
                style={{
                    flexDirection: 'row',
                    height: 12,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginBottom: 12,
                }}
            >
                {Object.entries(counts).map(
                    ([stage, count]) => (
                        <View
                            key={stage}
                            style={{
                                flex: count / total,
                                backgroundColor:
                                    STAGE_COLORS[
                                    stage as keyof typeof STAGE_COLORS
                                    ],
                            }}
                        />
                    ),
                )}
            </View>

            {Object.entries(counts).map(
                ([stage, count]) => (
                    <Text key={stage}>
                        {stage.charAt(0).toUpperCase() +
                            stage.slice(1)}: {count}
                    </Text>
                ),
            )}
        </View>
    );
}