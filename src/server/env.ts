import { z } from 'zod';

const envSchema = z.object({
  USE_MOCK: z.coerce.boolean().default(true),
  GESTAR_API_LOGIN: z.string().url().optional(),
  GESTAR_API_CASES: z.string().url().optional(),
  GESTAR_API_TOKEN: z.string().optional(),
  // Credenciales por defecto para precargar el form de login (entorno interno) — no son secretos de la app.
  LOGIN_NAME: z.string().optional(),
  PASSWORD: z.string().optional(),
  CACHE_TTL_MS: z.coerce.number().default(60_000),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    USE_MOCK: process.env.USE_MOCK,
    GESTAR_API_LOGIN: process.env.GESTAR_API_LOGIN,
    GESTAR_API_CASES: process.env.GESTAR_API_CASES,
    GESTAR_API_TOKEN: process.env.GESTAR_API_TOKEN,
    LOGIN_NAME: process.env.LOGIN_NAME,
    PASSWORD: process.env.PASSWORD,
    CACHE_TTL_MS: process.env.CACHE_TTL_MS,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten());
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}

export const env = validateEnv();
