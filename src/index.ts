/**
 * Language of the returned weekday name.
 * - `ne`: Nepali (Devanagari)
 * - `en`: romanized Nepali
 */
export type Lang = 'ne' | 'en';

/**
 * Form of the weekday name.
 * - `full`: e.g. `आइतबार` / `Aaitabaar`
 * - `short`: e.g. `आइत` / `Aaita`
 * - `min`: e.g. `आ` / `Aai`
 */
export type NameType = 'full' | 'short' | 'min';

/** Weekday index as returned by `Date#getDay()` (0 = Sunday). */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** All three forms of a single weekday name. */
export interface WeekdayNames {
  full: string;
  short: string;
  min: string;
}

/** A seven-element tuple indexed by {@link WeekdayIndex}. */
export type WeekdayTuple = readonly [string, string, string, string, string, string, string];

/** Lookup table of weekday names for one language. */
export type WeekdayTable = Readonly<Record<NameType, WeekdayTuple>>;

export interface Options {
  /** Defaults to `ne`. */
  lang?: Lang;
  /** When omitted, all three forms are returned as a {@link WeekdayNames} object. */
  type?: NameType;
}

type OptionsWithType = Options & { type: NameType };
type OptionsWithoutType = Options & { type?: undefined };

/** Nepali (Devanagari) weekday names, Sunday first. */
export const WEEKDAYS_NE: WeekdayTable = Object.freeze({
  full: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'],
  short: ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'],
  min: ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'],
} as const);

/** Romanized Nepali weekday names, Sunday first. */
export const WEEKDAYS_EN: WeekdayTable = Object.freeze({
  full: ['Aaitabaar', 'Sombaar', 'Mangalbaar', 'Budhabaar', 'Bihibaar', 'Shukrabaar', 'Shanibaar'],
  short: ['Aaita', 'Som', 'Mangal', 'Budha', 'Bihi', 'Shukra', 'Shani'],
  min: ['Aai', 'So', 'Man', 'Bu', 'Bi', 'Shu', 'Sha'],
} as const);

const TABLES: Readonly<Record<Lang, WeekdayTable>> = { ne: WEEKDAYS_NE, en: WEEKDAYS_EN };

function tag(value: unknown): string {
  return Object.prototype.toString.call(value);
}

function isDate(value: unknown): value is Date {
  // Works across realms (e.g. iframes), unlike `instanceof Date`.
  return tag(value) === '[object Date]';
}

function isOptionsObject(value: unknown): value is Options {
  return tag(value) === '[object Object]';
}

function toWeekdayIndex(input: Date | number | undefined): WeekdayIndex {
  if (input === undefined) {
    // Local date, so "today" matches the caller's wall clock.
    return new Date().getDay() as WeekdayIndex;
  }

  if (isDate(input)) {
    const day = input.getDay();
    if (Number.isNaN(day)) {
      throw new RangeError('Expected a valid Date object');
    }
    return day as WeekdayIndex;
  }

  if (typeof input !== 'number') {
    throw new TypeError('Expected a date object or a number');
  }

  if (!Number.isInteger(input) || input < 0 || input > 6) {
    throw new RangeError('Expected the value of inp between 0-6');
  }

  return input as WeekdayIndex;
}

/**
 * Get the Nepali name of a weekday.
 *
 * @param input A `Date` (its local weekday is used) or a weekday index `0`–`6`
 *   where `0` is Sunday. When omitted, the current local day is used. An options
 *   object may also be passed as the first argument.
 * @param options `lang` (`'ne'` default, or `'en'`) and `type`
 *   (`'full' | 'short' | 'min'`). Without `type`, an object with all three
 *   forms is returned.
 * @throws {TypeError} if `input` is neither a `Date` nor a number.
 * @throws {RangeError} if `input` is a number outside `0`–`6`, or an invalid `Date`.
 */
export function getNepdayOfWeek(input?: Date | number): WeekdayNames;
export function getNepdayOfWeek(options: OptionsWithType): string;
export function getNepdayOfWeek(options: OptionsWithoutType): WeekdayNames;
export function getNepdayOfWeek(options: Options): string | WeekdayNames;
export function getNepdayOfWeek(input: Date | number | undefined, options: OptionsWithType): string;
export function getNepdayOfWeek(
  input: Date | number | undefined,
  options?: OptionsWithoutType,
): WeekdayNames;
export function getNepdayOfWeek(
  input: Date | number | undefined,
  options?: Options,
): string | WeekdayNames;
export function getNepdayOfWeek(
  input?: Date | number | Options,
  options?: Options,
): string | WeekdayNames {
  let value: Date | number | undefined;
  if (isOptionsObject(input)) {
    options = input;
    value = undefined;
  } else {
    value = input;
  }

  const index = toWeekdayIndex(value);
  const table = TABLES[options?.lang === 'en' ? 'en' : 'ne'];

  const type = options?.type;
  if (!type) {
    return {
      full: table.full[index],
      short: table.short[index],
      min: table.min[index],
    };
  }

  switch (type) {
    case 'short':
      return table.short[index];
    case 'min':
      return table.min[index];
    default:
      // 'full', or any unrecognised value (kept lenient for backwards compatibility).
      return table.full[index];
  }
}

export default getNepdayOfWeek;
