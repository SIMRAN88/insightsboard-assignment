export const chartConfig = {
  decimalPlaces: 0,

  backgroundGradientFrom: '#ffffff',

  backgroundGradientTo: '#ffffff',

  color: (opacity: number) =>
    `rgba(63,81,181,${opacity})`,

  labelColor: (opacity: number) =>
    `rgba(80,80,80,${opacity})`,

  propsForDots: {
    r: '5',
    strokeWidth: '2',
  },

  propsForBackgroundLines: {
    strokeDasharray: '6',
  },
};