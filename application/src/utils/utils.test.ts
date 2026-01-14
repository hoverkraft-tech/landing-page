import { describe, expect, it } from 'vitest';

import { trim, toUiAmount } from '~/utils/utils';

describe('utils', () => {
  describe('trim', () => {
    it('trims the given character from both ends', () => {
      expect(trim('///hello///', '/')).toBe('hello');
    });

    it('returns input when no trim is needed', () => {
      expect(trim('hello', '/')).toBe('hello');
    });
  });

  describe('toUiAmount', () => {
    it('formats thousands, millions, and billions', () => {
      expect(toUiAmount(999)).toBe('999');
      expect(toUiAmount(1000)).toBe('1K');
      expect(toUiAmount(1500)).toBe('1.5K');
      expect(toUiAmount(2_000_000)).toBe('2M');
      expect(toUiAmount(2_500_000_000)).toBe('2.5B');
    });

    it('returns 0 for falsy values', () => {
      expect(toUiAmount(0)).toBe(0);
    });
  });
});
