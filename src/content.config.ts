import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(155),
      track: z.enum(['product', 'concept']),
      order: z.number(),
      outcome: z.string(),
      prerequisites: z.array(z.string()),
      hero: image(),
      heroAlt: z.string(),
      heroCaption: z.string(),
      next: z.object({ href: z.string(), label: z.string() }).optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { lessons };
