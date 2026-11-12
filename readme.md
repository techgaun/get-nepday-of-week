# get-nepday-of-week [![CI](https://github.com/techgaun/get-nepday-of-week/actions/workflows/ci.yml/badge.svg)](https://github.com/techgaun/get-nepday-of-week/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/get-nepday-of-week.svg)](https://www.npmjs.com/package/get-nepday-of-week)

> Get nepali day of week from Date object or index (with 0 for Sunday and so on)

Written in TypeScript, ships ESM and CommonJS builds with type definitions, has zero
dependencies and works in Node.js (18+) and browsers.

## Install

```
$ npm install get-nepday-of-week
```

## Usage

If no input is passed, the name for the current (local) day is returned.

```ts
// ESM / TypeScript
import getNepdayOfWeek from 'get-nepday-of-week';
// or a named import
import { getNepdayOfWeek } from 'get-nepday-of-week';
```

```js
// CommonJS
const getNepdayOfWeek = require('get-nepday-of-week');
```

```js
getNepdayOfWeek(new Date('2015/10/24'));
//=> { full: 'शनिबार', short: 'शनि', min: 'श' }

getNepdayOfWeek({ lang: 'en' });
//=> { full: 'Aaitabaar', short: 'Aaita', min: 'Aai' }   (today's name)

getNepdayOfWeek(2);
//=> { full: 'मंगलबार', short: 'मंगल', min: 'मं' }

getNepdayOfWeek(1, { lang: 'ne', type: 'short' });
//=> 'सोम'

getNepdayOfWeek(new Date(), { lang: 'en', type: 'full' });
//=> 'Aaitabaar' (or whichever day it is)

getNepdayOfWeek(-2);
//=> throws RangeError: Expected the value of inp between 0-6
```

### Raw name tables

The underlying lookup tables are exported for callers that want to build their own
pickers, calendars and the like. Each is a frozen object with `full`, `short` and `min`
arrays, indexed Sunday first.

```ts
import { WEEKDAYS_NE, WEEKDAYS_EN } from 'get-nepday-of-week';

WEEKDAYS_NE.full;
//=> ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार']
WEEKDAYS_EN.short;
//=> ['Aaita', 'Som', 'Mangal', 'Budha', 'Bihi', 'Shukra', 'Shani']
```

### Timezones

When called without an input the library uses `new Date().getDay()`, i.e. the local
weekday of the machine it runs on. If you need to control the timezone, build the `Date`
yourself and pass it in; only `getDay()` is read from it.

## API

### getNepdayOfWeek([input], [options])

Returns a `string` when `options.type` is given, otherwise a `WeekdayNames` object
(`{ full, short, min }`).

Throws a `TypeError` if `input` is neither a `Date` nor a `number`, and a `RangeError`
if it is a number outside `0`–`6` (or not an integer) or an invalid `Date`.

#### input

Type: `Date | number`

Range: `0-6` if `number` with 0 for Sunday/Aaitabaar and so on. For a `Date`, its local
weekday (`getDay()`) is used. Defaults to the current day. An options object may also be
passed as the first and only argument.

#### options

##### lang

Type: `'ne' | 'en'`
Default: `'ne'`

`ne` returns Devanagari names, `en` returns romanized names.

##### type

Type: `'full' | 'short' | 'min'`

Possible values: `full` (eg. Aaitabaar), `short` (eg. Aaita), `min` (eg. Aai). When
omitted all three forms are returned as an object.

### Types

The package exports the following types for TypeScript users:

```ts
import type {
  Lang, // 'ne' | 'en'
  NameType, // 'full' | 'short' | 'min'
  Options, // { lang?: Lang; type?: NameType }
  WeekdayNames, // { full: string; short: string; min: string }
  WeekdayIndex, // 0 | 1 | 2 | 3 | 4 | 5 | 6
  WeekdayTable, // Record<NameType, readonly [string x7]>
} from 'get-nepday-of-week';
```

## Upgrading from 0.x

Version 1.0.0 is a rewrite in TypeScript. The input/options semantics are unchanged with
one **breaking change**:

- Invalid input now **throws** a `TypeError`/`RangeError` instead of _returning_ the error
  object. Wrap calls in `try`/`catch` if you were previously checking the return value
  with `instanceof Error`.

Other notable changes:

- Native ESM (`import`) and CommonJS (`require`) entry points with bundled `.d.ts` types.
  `require('get-nepday-of-week')` still returns the function directly.
- `WEEKDAYS_NE` and `WEEKDAYS_EN` name tables are exported.
- Non-integer / `NaN` indexes and invalid `Date`s now throw a `RangeError` instead of
  producing `undefined` names.
- Requires Node.js 18 or newer.
- The Tuesday typo in the published 0.1.4 (`मगलवार`, missing anusvara) is fixed, and the
  full names use the `-बार` suffix (`मंगलबार`, `आइतबार`, ...).

See [CHANGELOG.md](CHANGELOG.md) for details.

## License

MIT © [techgaun](http://samar.techgaun.com)
