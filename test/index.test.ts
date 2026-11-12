import { afterEach, describe, expect, it, vi } from 'vitest';

import getNepdayOfWeekDefault, {
  WEEKDAYS_EN,
  WEEKDAYS_NE,
  getNepdayOfWeek,
  type WeekdayNames,
} from '../src/index';

describe('exports', () => {
  it('exposes the function as both default and named export', () => {
    expect(getNepdayOfWeekDefault).toBe(getNepdayOfWeek);
    expect(typeof getNepdayOfWeek).toBe('function');
  });

  it('exposes the raw name tables', () => {
    expect(WEEKDAYS_NE.full).toHaveLength(7);
    expect(WEEKDAYS_NE.short).toHaveLength(7);
    expect(WEEKDAYS_NE.min).toHaveLength(7);
    expect(WEEKDAYS_EN.full).toHaveLength(7);
    expect(WEEKDAYS_EN.short).toHaveLength(7);
    expect(WEEKDAYS_EN.min).toHaveLength(7);
    expect(Object.isFrozen(WEEKDAYS_NE)).toBe(true);
    expect(Object.isFrozen(WEEKDAYS_EN)).toBe(true);
  });
});

describe('index input', () => {
  it('should return Tuesday for index 2', () => {
    let obj: WeekdayNames = { full: 'मंगलबार', short: 'मंगल', min: 'मं' };
    expect(getNepdayOfWeek(2)).toEqual(obj);
    expect(typeof getNepdayOfWeek(2)).toBe('object');
    obj = { full: 'Mangalbaar', short: 'Mangal', min: 'Man' };
    expect(getNepdayOfWeek(2, { lang: 'en' })).toEqual(obj);
    expect(getNepdayOfWeek(2, { lang: 'en', type: 'short' })).toBe('Mangal');
    expect(getNepdayOfWeek(2, { type: 'min' })).toBe('मं');
    expect(getNepdayOfWeek(2, { type: 'full' })).toBe('मंगलबार');
    expect(getNepdayOfWeek(2, { type: 'full', lang: 'en' })).toBe('Mangalbaar');
  });

  it('spells Tuesday with the anusvara (regression for 0.1.4 typo)', () => {
    expect(getNepdayOfWeek(2, { type: 'full' })).toBe('मंगलबार');
    expect(getNepdayOfWeek(2, { type: 'short' })).toBe('मंगल');
    expect(getNepdayOfWeek(2, { type: 'min' })).toBe('मं');
    expect(getNepdayOfWeek(2, { type: 'full' })).not.toBe('मगलबार');
    expect(getNepdayOfWeek(2, { type: 'short' })).not.toBe('मगल');
  });

  it('returns the expected names for every weekday', () => {
    const ne = [
      { full: 'आइतबार', short: 'आइत', min: 'आ' },
      { full: 'सोमबार', short: 'सोम', min: 'सो' },
      { full: 'मंगलबार', short: 'मंगल', min: 'मं' },
      { full: 'बुधबार', short: 'बुध', min: 'बु' },
      { full: 'बिहिबार', short: 'बिहि', min: 'बि' },
      { full: 'शुक्रबार', short: 'शुक्र', min: 'शु' },
      { full: 'शनिबार', short: 'शनि', min: 'श' },
    ];
    const en = [
      { full: 'Aaitabaar', short: 'Aaita', min: 'Aai' },
      { full: 'Sombaar', short: 'Som', min: 'So' },
      { full: 'Mangalbaar', short: 'Mangal', min: 'Man' },
      { full: 'Budhabaar', short: 'Budha', min: 'Bu' },
      { full: 'Bihibaar', short: 'Bihi', min: 'Bi' },
      { full: 'Shukrabaar', short: 'Shukra', min: 'Shu' },
      { full: 'Shanibaar', short: 'Shani', min: 'Sha' },
    ];
    for (let i = 0; i < 7; i++) {
      expect(getNepdayOfWeek(i)).toEqual(ne[i]);
      expect(getNepdayOfWeek(i, { lang: 'ne' })).toEqual(ne[i]);
      expect(getNepdayOfWeek(i, { lang: 'en' })).toEqual(en[i]);
    }
  });

  it('defaults to Nepali for an unknown lang and to full for an unknown type', () => {
    // Runtime leniency kept from 0.x; the types forbid this at compile time.
    expect(getNepdayOfWeek(0, { lang: 'fr' as never })).toEqual({
      full: 'आइतबार',
      short: 'आइत',
      min: 'आ',
    });
    expect(getNepdayOfWeek(0, { type: 'bogus' as never })).toBe('आइतबार');
  });
});

describe('invalid input', () => {
  it('should throw TypeError for invalid input', () => {
    expect(() => getNepdayOfWeek('samar' as never)).toThrow(TypeError);
    expect(() => getNepdayOfWeek('samar' as never)).toThrow('Expected a date object or a number');
    expect(() => getNepdayOfWeek(null as never)).toThrow(TypeError);
    expect(() => getNepdayOfWeek([] as never)).toThrow(TypeError);
    expect(() => getNepdayOfWeek(true as never)).toThrow(TypeError);
  });

  it('should throw RangeError for invalid range', () => {
    expect(() => getNepdayOfWeek(-10)).toThrow(RangeError);
    expect(() => getNepdayOfWeek(-10)).toThrow('Expected the value of inp between 0-6');
    expect(() => getNepdayOfWeek(7)).toThrow(RangeError);
    expect(() => getNepdayOfWeek(7)).toThrow('Expected the value of inp between 0-6');
  });

  it('should throw RangeError for non-integer or NaN indexes', () => {
    expect(() => getNepdayOfWeek(2.5)).toThrow(RangeError);
    expect(() => getNepdayOfWeek(Number.NaN)).toThrow(RangeError);
  });

  it('should throw RangeError for an invalid Date', () => {
    expect(() => getNepdayOfWeek(new Date('not a date'))).toThrow(RangeError);
  });

  it('throws instead of returning an error object', () => {
    let result: unknown = 'not called';
    expect(() => {
      result = getNepdayOfWeek('samar' as never);
    }).toThrow();
    expect(result).toBe('not called');
  });
});

describe('Date input', () => {
  it('should return correct output for Date object', () => {
    expect(getNepdayOfWeek(new Date('2015/10/25'), { lang: 'en', type: 'full' })).toBe('Aaitabaar');
    expect(getNepdayOfWeek(new Date('2015/10/26'), { lang: 'ne', type: 'short' })).toBe('सोम');
    expect(getNepdayOfWeek(new Date('2015/10/23'), { lang: 'ne', type: 'min' })).toBe('शु');
  });

  it('uses the local weekday of the Date', () => {
    const saturday = new Date(2015, 9, 24, 12, 0, 0);
    expect(saturday.getDay()).toBe(6);
    expect(getNepdayOfWeek(saturday)).toEqual({ full: 'शनिबार', short: 'शनि', min: 'श' });
  });
});

describe('current day', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return correct output for current day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2015/10/24'));
    expect(getNepdayOfWeek({ lang: 'en', type: 'min' })).toBe('Sha');
    expect(getNepdayOfWeek(new Date())).toEqual({ full: 'शनिबार', short: 'शनि', min: 'श' });
  });

  it('accepts options as the only argument and undefined as the first argument', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2015/10/26'));
    expect(getNepdayOfWeek()).toEqual({ full: 'सोमबार', short: 'सोम', min: 'सो' });
    expect(getNepdayOfWeek({})).toEqual({ full: 'सोमबार', short: 'सोम', min: 'सो' });
    expect(getNepdayOfWeek({ lang: 'en' })).toEqual({ full: 'Sombaar', short: 'Som', min: 'So' });
    expect(getNepdayOfWeek(undefined, { lang: 'en', type: 'full' })).toBe('Sombaar');
  });
});
