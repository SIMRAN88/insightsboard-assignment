import React from 'react';

import {
  render,
} from '@testing-library/react-native';

import KPICard from '../../components/analytics/KPICard';

describe(
  'KPICard',
  () => {

    it(
      'renders title and value',
      () => {

        const {
          getByText,
        } = render(
          <KPICard
            title="Total Insights"
            value={42}
          />,
        );

        expect(
          getByText(
            'Total Insights',
          ),
        ).toBeTruthy();

        expect(
          getByText('42'),
        ).toBeTruthy();
      },
    );
  },
);