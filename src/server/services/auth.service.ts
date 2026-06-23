import { env } from '@/server/env';
import { AppError, UnauthorizedError } from '@/server/errors';

interface LoginResult {
  token: string;
}

export async function login(loginName: string, password: string): Promise<LoginResult> {
  if (!env.GESTAR_API_LOGIN) {
    throw new AppError('GESTAR_API_LOGIN no está configurado', 'CONFIG_ERROR', 500);
  }

  const res = await fetch(env.GESTAR_API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginName, password }),
  });

  if (!res.ok) {
    throw new UnauthorizedError();
  }

  const data = await res.json();
  if (!data?.token) {
    throw new AppError('Respuesta inválida del servicio de login', 'INVALID_RESPONSE', 502);
  }

  return { token: data.token };
}
