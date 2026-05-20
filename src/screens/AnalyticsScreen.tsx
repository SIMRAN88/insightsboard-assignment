import React, { useMemo } from 'react';
import {
    ScrollView,
    RefreshControl,
    View,
} from 'react-native';

import {
    ActivityIndicator,
    Card,
    Text,
    Button,
} from 'react-native-paper';

import { useQuery } from '@apollo/client/react';

import { GET_INSIGHTS } from '../graphql/queries';

import KPICard from '../components/analytics/KPICard';
import StageBar from '../components/analytics/StageBar';
import InsightsChart from '../components/analytics/InsightsChart';

import {
    getStageCounts,
    buildWeeklyTrend,
} from '../utils/analytics';

import { Insight } from '../types/insight';

type AnalyticsQueryData = {
    insightsCollection: {
        edges: {
            node: Insight;
        }[];
    };
};

export default function AnalyticsScreen() {

    const {
        data,
        loading,
        error,
        refetch,
    } =
        useQuery<AnalyticsQueryData>(
            GET_INSIGHTS
        );
    console.log('ANALYTICS QUERY', data);

    const insights =
        data?.insightsCollection?.edges?.map(
            edge => edge.node
        ) ?? [];

    const stageCounts =
        useMemo(
            () => getStageCounts(insights),
            [insights],
        );

    const trend =
        useMemo(
            () => buildWeeklyTrend(insights),
            [insights],
        );

    if (loading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return (
            <View>
                <Text>
                    Failed to load analytics
                </Text>

                <Button
                    onPress={() => refetch()}
                >
                    Retry
                </Button>
            </View>
        );
    }

    if (!insights.length) {
        return (
            <View>
                <Text>
                    No analytics data available
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 16,
            }}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={refetch}
                />
            }
        ><Text
            variant="headlineMedium"
            style={{ marginBottom: 16 }}
        >
                Analytics
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <KPICard
                    title="Total Insights"
                    value={insights.length}
                />
            </View>

            <Card style={{
                marginBottom: 16,
                borderRadius: 20
            }}>
                <Card.Content>
                    <Text variant="titleMedium">
                        Insights by Stage
                    </Text>

                    <StageBar
                        counts={stageCounts}
                    />
                </Card.Content>
            </Card>

            <Card style={{
                marginBottom: 16,
                borderRadius: 20
            }}>
                <Card.Content>
                    <Text variant="titleMedium">
                        Insights Over Time
                    </Text>

                    <InsightsChart
                        labels={trend.labels}
                        data={trend.data}
                    />
                </Card.Content>
            </Card>

        </ScrollView>
    );
}