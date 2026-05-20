import {
  formatStageLabel,
} from '../../utils/formatStageLabel';

describe(
  'formatStageLabel',
  () => {

    it(
      'formats observation',
      () => {
        expect(
          formatStageLabel(
            'observation',
          ),
        ).toBe(
          'Observation',
        );
      },
    );

    it(
      'formats impact',
      () => {
        expect(
          formatStageLabel(
            'impact',
          ),
        ).toBe(
          'Impact',
        );
      },
    );
  },
);