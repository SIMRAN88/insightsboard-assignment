import { z } from 'zod';

export const insightSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required'),

  description: z
    .string()
    .min(
      10,
      'Description is required'
    ),

  categoryId:
    z.string().optional(),

  hcpId:
    z.string().optional(),

  tags:
    z.array(
      z.string()
    ).default([]),
  priority: z.enum([
    'P1',
    'P2',
    'P3',
    'P4',
  ]),

  stage: z.enum([
    'observation',
    'insight',
    'actionable',
    'impact',
  ]),

  drugName: z.string().optional(),
});

export type InsightFormData =
  z.infer<
    typeof insightSchema
  >;