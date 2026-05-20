import {
    Dimensions,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import React, { useEffect, useState } from 'react';
const width =
    Dimensions.get('window').width - 32;

export default function InsightsChart({
    labels,
    data,
}: {
    labels: string[];
    data: number[];
}) {
    const [animatedData, setAnimatedData] =
        useState(data.map(() => 0));

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedData(data);
        }, 200);

        return () => clearTimeout(timeout);
    }, [data]);
    return (
        <LineChart
            width={width}
            height={220}
            bezier
            withShadow={false}
            fromZero
            yAxisInterval={1}
            data={{
                labels,
                datasets: [
                    {
                        data: animatedData,
                    },
                ]
            }}
            chartConfig={{
                decimalPlaces: 0,

                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',

                color: opacity =>
                    `rgba(63,81,181,${opacity})`,

                labelColor: opacity =>
                    `rgba(80,80,80,${opacity})`,

                propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                },

                propsForBackgroundLines: {
                    strokeDasharray: '6',
                },
            }}
        />
    );
}