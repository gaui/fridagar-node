# Change Log for `fridagar`

## Upcoming...

- ... <!-- Add new lines here. -->
- feat: Add "Þrettándinn" (non-holiday)

## 4.0.0

_2024-01-13_

**New Features:**

- feat: Add convenience methods `isHoliday` and `isSpecialDay`
- feat: Add `key` prop to the day info objects to aid translations
- feat: Add method `getAllDaysKeyed` to return all days keyed by `key`
- feat: Export string types `HolidayKey`, `SpecialDayKey` and `DayKey`
- feat: Add "Sjómannadagurinn" (non-holiday)
- feat: Add "Fyrsti vetrardagur" (non-holiday)

**Changes:**

- **BREAKING** feat: Set all dates to UTC instead of local time. (You may
  need to update your code to handle this change, possibly by manually
  applying the local timezone offset to the returned dates.)
- feat: Handle negative `workdaysFromDate` offsets (for "n-th workday
  _before_ {Date}")
- feat: Add third `includeHalfDays` boolean parameter to
  `workdaysFromDate` method
- feat: Arrays of days are now sorted in correct date order
- feat: Shorten the description (name) of `jun17` to "Þjóðhátíðardagurinn"

**Bugfixes:**

- fix: Correctly handle rímspilliár (affect days `bonda`, `konu` and
  `vetur1`)
- fix: Set summer and winter solstice date timestamp to midnight
- fix: Always return new `Date` object from `workdaysFromDate`
- fix: Correctly cross year boundries in `workdaysFromDate`
- fix: Handle `0` value year and month arguments correctly

**Other Improvements:**

- perf: Speed-up of all operations by a factor between 2 and 40
  (especially for multiple quickly repeated lookups)
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
