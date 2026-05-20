import { LineChart } from 'react-native-chart-kit';

import { CHART_WIDTH, CHART_HEIGHT, chartConfig} from '../../constants/components/analytics/InsightsChart';
import { InsightsChartProps } from '../../types/components/analytics/InsightsChart';
import { useDebounce } from '../../hooks/useDebounce';


export default function InsightsChart({
  labels,
  data,
}: InsightsChartProps) {

  const animatedData =
    useDebounce(
      data,
      200
    );

  return (
    <LineChart
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
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
        ],
      }}
      chartConfig={chartConfig}
    />
  );
}