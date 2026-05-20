import {
    insightSchema,
} from '../../validation/insightSchema';

describe(
    'insightSchema',
    () => {
        const validData = {
            title:
                'Supply Chain Delay',

            description:
                'Observed recurring stock issues.',

            priority: 'P1',

            stage: 'insight',

            tags: [],
        };

        it(
            'accepts valid data',
            () => {
                expect(() =>
                    insightSchema.parse(
                        validData,
                    ),
                ).not.toThrow();
            },
        );

        it(
            'rejects short title',
            () => {
                expect(() =>
                    insightSchema.parse({
                        ...validData,
                        title: 'Hi',
                    }),
                ).toThrow();
            },
        );

        it(
            'rejects short description',
            () => {
                expect(() =>
                    insightSchema.parse({
                        ...validData,
                        description: 'Too short',
                    }),
                ).toThrow();
            },
        );

        it(
            'rejects invalid priority',
            () => {
                expect(() =>
                    insightSchema.parse({
                        ...validData,
                        priority: 'P5',
                    }),
                ).toThrow();
            },
        );

        it(
            'rejects invalid stage',
            () => {
                expect(() =>
                    insightSchema.parse({
                        ...validData,
                        stage: 'draft',
                    }),
                ).toThrow();
            },
        );

        it(
            'defaults tags to empty array',
            () => {
                const result =
                    insightSchema.parse({
                        ...validData,
                        tags: undefined,
                    });

                expect(
                    result.tags,
                ).toEqual([]);
            },
        );
    },
);