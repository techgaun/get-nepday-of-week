# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 - 2026-11-11

### Breaking changes

- Invalid input now **throws** a `TypeError` (input is neither a `Date` nor a `number`)
  or a `RangeError` (number outside `0`–`6`) instead of returning the error object.
- Non-integer and `NaN` indexes, and invalid `Date` objects, now throw a `RangeError`
  instead of silently producing `undefined` names.
- Requires Node.js 18 or newer (previously `>=0.10`).

### Added

- Rewritten in TypeScript (strict) with bundled type definitions.
- ESM (`import`) and CommonJS (`require`) builds via a proper `exports` map.
  `require('get-nepday-of-week')` still returns the function directly; a named
  `getNepdayOfWeek` export is also available.
- Exported `WEEKDAYS_NE` and `WEEKDAYS_EN` lookup tables (frozen, Sunday first).
- Exported types: `Lang`, `NameType`, `Options`, `WeekdayNames`, `WeekdayIndex`,
  `WeekdayTuple`, `WeekdayTable`.
- `sideEffects: false` for tree-shaking bundlers.

### Fixed

- Tuesday was spelled `मगलवार` / `मगल` / `म` (missing anusvara) in the published 0.1.4.
  It is now `मंगलबार` / `मंगल` / `मं`. The `-वार` suffix of all seven full names was
  also changed to the more common `-बार` (e.g. `आइतबार`), matching the romanized
  `-baar` forms. (Both were committed to `master` after 0.1.4 but never published.)

### Internal

- Tests migrated from mocha + sinon to vitest.
- xo replaced with prettier and typescript-eslint.
- Travis CI replaced with GitHub Actions (Node 18, 20, 22).

## 0.1.4 and earlier

Initial CommonJS releases.
