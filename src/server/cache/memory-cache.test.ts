import { describe, it, expect } from 'vitest';
import { cacheGet, cacheSet, cacheDelete } from './memory-cache';

describe('memory-cache', () => {
  it('set seguido de get devuelve el valor', () => {
    cacheSet('test:set-get', { foo: 'bar' }, 60_000);
    expect(cacheGet('test:set-get')).toEqual({ foo: 'bar' });
  });

  it('delete seguido de get devuelve null (miss)', () => {
    cacheSet('test:delete', 'valor', 60_000);
    expect(cacheGet('test:delete')).toBe('valor');

    cacheDelete('test:delete');
    expect(cacheGet('test:delete')).toBeNull();
  });

  it('get de una clave nunca seteada devuelve null', () => {
    expect(cacheGet('test:never-set')).toBeNull();
  });

  it('delete de una clave inexistente no lanza', () => {
    expect(() => cacheDelete('test:does-not-exist')).not.toThrow();
  });
});
