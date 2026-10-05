import { describe, it, expect } from 'vitest';
import { toGrid, gridRef } from '../src/grid';

// Expected 100 km squares checked against an independent MGRS library on 5 October 2026.
describe('grid references', () => {
  it('puts Tallinn in 35V LF', () => {
    const [e, n] = toGrid(24.745, 59.437);
    expect(gridRef(e, n).startsWith('35V LF')).toBe(true);
  });
  it('puts Tartu in 35V ME', () => {
    const [e, n] = toGrid(26.729, 58.378);
    expect(gridRef(e, n).startsWith('35V ME')).toBe(true);
  });
  it('writes a 10 metre reference inside the exercise area', () => {
    expect(gridRef(434.78, 6584.91)).toBe('35V MF 3478 8491');
  });
});
