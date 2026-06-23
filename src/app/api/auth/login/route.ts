import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { login } from '@/server/services/auth.service';
import { AppError } from '@/server/errors';

const loginBodySchema = z.object({
  loginName: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos', detalles: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { token } = await login(parsed.data.loginName, parsed.data.password);
    return NextResponse.json({ token });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('[POST /api/Incidents/login]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
