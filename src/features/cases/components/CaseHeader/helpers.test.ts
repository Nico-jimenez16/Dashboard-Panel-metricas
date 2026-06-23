import { describe, it, expect } from 'vitest';
import { initials, elapsedLabel } from './helpers';

describe('initials', () => {
  it('devuelve la primera letra en mayúscula para un nombre simple', () => {
    expect(initials('martina')).toBe('M');
  });

  it('devuelve las iniciales de las dos primeras palabras para un nombre compuesto', () => {
    expect(initials('Martina Gomez Lopez')).toBe('MG');
  });

  it('devuelve "?" cuando el nombre es null, undefined o vacío', () => {
    expect(initials(null)).toBe('?');
    expect(initials(undefined)).toBe('?');
    expect(initials('')).toBe('?');
  });
});

describe('elapsedLabel', () => {
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

  it('reporta "menos de 1 hora" para menos de 60 minutos transcurridos', () => {
    expect(elapsedLabel(hoursAgo(0.5), null)).toBe('menos de 1 hora');
  });

  it('reporta horas transcurridas para menos de 24 horas', () => {
    expect(elapsedLabel(hoursAgo(5), null)).toBe('5 h transcurridas');
  });

  it('reporta 1 día (singular) para exactamente 24 horas', () => {
    expect(elapsedLabel(hoursAgo(24), null)).toBe('1 día transcurrido');
  });

  it('reporta días en plural para más de 24 horas', () => {
    expect(elapsedLabel(hoursAgo(50), null)).toBe('2 días transcurridos');
  });

  it('usa solvedAt en vez de "ahora" cuando el caso está cerrado', () => {
    const createdAt = hoursAgo(48);
    const solvedAt = hoursAgo(24);
    expect(elapsedLabel(createdAt, solvedAt)).toBe('1 día transcurrido');
  });
});
