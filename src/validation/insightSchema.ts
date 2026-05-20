import { z } from 'zod';

export const insightSchema = z.object({
title: z
  .string()
  .min(3, 'Title must be at least 3 characters'),

description: z
  .string()
  .min(
    10,
    'Description must be at least 10 characters',
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