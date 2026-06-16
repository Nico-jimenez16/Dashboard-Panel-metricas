import { z } from 'zod';

const envSchema = z.object({
  USE_MOCK: z.coerce.boolean().default(true),
  GESTAR_API_URL: z.string().url().optional(),
  GESTAR_API_KEY: z.string().optional(),
  CACHE_TTL_MS: z.coerce.number().default(60_000),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    USE_MOCK: process.env.USE_MOCK ?? 'true',
    GESTAR_API_URL: process.env.GESTAR_API_URL,
    GESTAR_API_KEY: process.env.GESTAR_API_KEY,
    CACHE_TTL_MS: process.env.CACHE_TTL_MS,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten());
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}

export const env = validateEnv();
