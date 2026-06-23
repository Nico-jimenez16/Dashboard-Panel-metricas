import type { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} con id "${id}" no encontrado`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Usuario o contraseña incorrectos') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export function validationErrorFromZod(error: ZodError, message: string): ValidationError {
  return new ValidationError(message, error.flatten());
}

export function appErrorBody(err: AppError): { error: string; detalles?: unknown } {
  if (err instanceof ValidationError && err.details) {
    return { error: err.message, detalles: err.details };
  }
  return { error: err.message };
}
