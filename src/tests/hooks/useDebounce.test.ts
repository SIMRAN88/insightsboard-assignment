import {
  renderHook,
  act,
} from '@testing-library/react-native';
import { useDebounce } from '../../hooks/useDebounce';


describe(
  'useDebounce',
  () => {

    jest.useFakeTimers();

    it(
      'debounces updates',
      () => {

        const {
          result,
          rerender,
        } = renderHook(
          (
            props: {
              value: string;
            },
          ) =>
            useDebounce(
              props.value,
              500,
            ),

          {
            initialProps: {
              value:'A',
            },
          },
        );

        rerender({
          value:'B',
        });

        expect(
          result.current,
        ).toBe('A');

        act(() => {
          jest.advanceTimersByTime(
            500,
          );
        });

        expect(
          result.current,
        ).toBe('B');
      },
    );
  },
);