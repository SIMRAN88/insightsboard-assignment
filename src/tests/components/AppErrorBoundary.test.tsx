import React from 'react';

import {
  render,
} from '@testing-library/react-native';
import AppErrorBoundary from '../../components/AppErrorBoundary';



const CrashComponent =
  (): React.JSX.Element => {
    throw new Error(
      'Test error',
    );
  };

describe(
  'AppErrorBoundary',
  () => {

    it(
      'shows fallback UI',
      () => {

        jest
          .spyOn(
            console,
            'error',
          )
          .mockImplementation(
            () => {},
          );

        const {
          getByText,
        } = render(
          <AppErrorBoundary>
            <CrashComponent />
          </AppErrorBoundary>,
        );

        expect(
          getByText(
            /something went wrong/i,
          ),
        ).toBeTruthy();
      },
    );
  },
);