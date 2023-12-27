# Change Log for `fridagar`

## Upcoming...

- ... <!-- Add new lines here. -->
- `workdaysFromDate` improvements:
  - Fix: Always return new `Date` object
  - fix: Correctly cross year boundries
  - Handle negative day offsets, for "n-th workday _before_ {Date}"
  - Add third `includeHalfDays` boolean parameter
- Fix: Set summer and winter solstice date timestamp to 00:00
- Add convenience methods `isHoliday` and `isSpecialDay`
- perf: Speedup of all operations by a factor between 2 and 40 (especially for multiple quickly repeated lookups)
- Better support for named `import`s from esm projects (`pkg.type === 'module'`)

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