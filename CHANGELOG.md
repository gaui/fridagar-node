# Change Log for `fridagar`

## Upcoming...

- ... <!-- Add new lines here. -->
- **BREAKING** feat: Set all dates to UTC instead of local time
- fix: Set summer and winter solstice date timestamp to midnight
- feat: Add `key` prop to the day info objects to aid translations
- feat: Export string union types `HolidayKey` and `SpecialDayKey`
- `workdaysFromDate` improvements:
  - feat: Handle negative day offsets, for "n-th workday _before_ {Date}"
  - feat: Add third `includeHalfDays` boolean parameter
  - fix: Always return new `Date` object
  - fix: Correctly cross year boundries
- feat: Add convenience methods `isHoliday` and `isSpecialDay`
- feat: Shorten name/description of `jun17` to "Þjóðhátíðardagurinn"
- fix: Handle `0` value year and month arguments correctly
- perf: Speedup of all operations by a factor between 2 and 40 (especially for multiple quickly repeated lookups)
- docs: Add a proper README with code examples for all methods and types.
- docs: Improve inline JSDoc comments
- docs/build: Add unit tests for correctness and stability of the library
- build: Add pkg.exports field exposing both ESM and CommonJS versions.

## 3.2.0

_2021-07-14_

- Add TypeScript type definitions

## 3.1.1

_2018-05-11_

- Fix documentation

## 3.1.0

_2018-04-28_

- Add "Hrekkjavaka"
- Demote "Þorláksmessa" to notable day status
- Add flagging of "half-day" holidays
- Use current day/year as default for all methods
- Improve performance
- Minor bugfixes

## 3.0.0

_2016-06-18_

- Calculate holidays instead of scraping them.
- Removed promises (breaking changes).

## 2.0.0

_2016-03-28_

- Use promises instead of callbacks.

## 1.0.0

_2016-03-27_

- Initial release.
