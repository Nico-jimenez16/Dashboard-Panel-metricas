import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  validationErrorFromZod,
  appErrorBody,
} from './errors';

const sampleSchema = z.object({ loginName: z.string().min(1) });

function makeZodError() {
  const result = sampleSchema.safeParse({ loginName: '' });
  if (result.success) throw new Error('expected parse failure in test fixture');
  return result.error;
}

describe('validationErrorFromZod', () => {
  it('produce una ValidationError con status 400 y details desde el ZodError', () => {
    const zodError = makeZodError();
    const err = validationErrorFromZod(zodError, 'Datos inválidos');

    expect(err).toBeInstanceOf(ValidationError);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Datos inválidos');
    expect(err.details).toEqual(zodError.flatten());
  });
});

describe('appErrorBody', () => {
  it('incluye detalles cuando el AppError es una ValidationError con details', () => {
    const err = validationErrorFromZod(makeZodError(), 'Datos inválidos');
    expect(appErrorBody(err)).toEqual({ error: 'Datos inválidos', detalles: err.details });
  });

  it('NO incluye detalles para una ValidationError sin details', () => {
    const err = new ValidationError('Body JSON inválido');
    expect(appErrorBody(err)).toEqual({ error: 'Body JSON inválido' });
  });

  it('NO incluye detalles para otros AppError (NotFoundError, UnauthorizedError)', () => {
    expect(appErrorBody(new NotFoundError('Caso', '123'))).toEqual({
      error: 'Caso con id "123" no encontrado',
    });
    expect(appErrorBody(new UnauthorizedError())).toEqual({
      error: 'Usuario o contraseña incorrectos',
    });
  });

  it('expone statusCode semántico en los AppError genéricos (CONFIG_ERROR/GESTAR_ERROR)', () => {
    const config = new AppError('Falta configuración', 'CONFIG_ERROR', 500);
    const gestar = new AppError('Gestar API error: 503', 'GESTAR_ERROR', 502);
    expect(config.statusCode).toBe(500);
    expect(gestar.statusCode).toBe(502);
    expect(appErrorBody(gestar)).toEqual({ error: 'Gestar API error: 503' });
  });
});
