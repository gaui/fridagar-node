import type {
  Holiday,
  SpecialDay,
  HolidayKey,
  SpecialDayKey,
  DayKey
} from "./calculations.js";
import { calcSpecialDays, dayMs } from "./calculations.js";

const cloneInfo = <T extends Holiday | SpecialDay>(dayInfo: T): T => ({
  ...dayInfo,
  date: new Date(dayInfo.date),
});

export type { Holiday, SpecialDay, HolidayKey, SpecialDayKey, DayKey };

/**
 * Returns all Icelandic public holidays and commonly celebrated "special" days
 * for a given year — optionally narrowed down to a single month.
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<Holiday | SpecialDay>} Array of day info objects
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#getalldays
 */
export const getAllDays = function (year?: number, month?: number) {
  if (year == null) {
    year = new Date().getFullYear();
  }
  var days = calcSpecialDays(year);

  if (month != null) {
    days = days.filter((day) => day.date.getMonth() === month - 1);
  }

  return days.map(cloneInfo);
};

/**
 * Returns a keyed object with Icelandic public holidays and commonly celebrated
 * "special" days for a given year
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
- * @return {Record<HolidayKey| SpecialDayKey, Holiday | SpecialDay>} Array of day info objects
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#getalldays
 */
export const getAllDaysKeyed = (year?: number) => {
  const days: Record<string, unknown> = {};
  for (const day of getAllDays(year)) {
    days[day.key] = day;
  }
  return days as Record<HolidayKey, Holiday> &
    Record<SpecialDayKey, SpecialDay>;
};

/**
 * Returns all official Icelandic public holidays (non-working days)
 * for a given year — optionally narrowed down to a single month.
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<Holiday>} Array of day info objects
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#getholidays
 */
export const getHolidays = (year?: number, month?: number) =>
  getAllDays(year, month).filter((day): day is Holiday => day.holiday);

/**
 * Returns only unofficial, commonly celebrated "special days" (that are still
 * workdays) for a given year — optionally narrowed down to a single month.
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<SpecialDay>} Array of day info objects
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#getotherdays
 */
export const getOtherDays = (year?: number, month?: number) =>
  getAllDays(year, month).filter((day): day is SpecialDay => !day.holiday);

/**
 * Checks if a given date is either an Icelandic public holiday
 * or a commonly celebrated "special" day,
 * and if so, returns its info object.
 *
 * @param  {Date}  date  Date to check
 * @return {Holiday | SpecialDay | undefined} Date info or undefined
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#isspecialday
 */
export const isSpecialDay = (date: Date) => {
  let dateMs = date.getTime();
  dateMs -= dateMs % dayMs;
  const holidays = calcSpecialDays(date.getFullYear());
  const dayInfo = holidays.find((day) => day.date.getTime() === dateMs);
  return dayInfo ? cloneInfo(dayInfo) : undefined;
};

/**
 * Checks if a given date is an Icelandic public holiday,
 * and if so, returns its info object.
 *
 * @param  {Date}  date  Date to check
 * @return {Holiday | undefined} Date info or undefined
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#isholiday
 */
export const isHoliday = (date: Date) => {
  const dayInfo = isSpecialDay(date);
  return dayInfo && dayInfo.holiday ? dayInfo : undefined;
};

/**
 * Returns the `days`-th business-day before/after the reference date.
 *
 * Defaults to counting half-day holidays as "non-work" days.
 *
 * @param  {number}  days  Number of working days to count (either positive or negative).
 * @param  {Date}  [refDate]  The reference date to start couting from. (Defaults to current day.)
 * @param  {boolean}  [includeHalfDays]  Whether to include half-day holidays as workdays. (Default `false`.)
 * @return {Date} The resolved workday
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#workdaysfromdate
 */
export const workdaysFromDate = (
  days: number,
  refDate?: Date,
  includeHalfDays?: boolean
) => {
  let date = refDate ? new Date(refDate) : new Date();
  date = new Date(date.toISOString().slice(0, 10));

  if (days === 0) {
    return date;
  }
  const delta = days > 0 ? 1 : -1;
  let count = Math.abs(days);

  let holidays: Array<Holiday | SpecialDay> = [];
  let holidayYear: number | undefined;

  while (count > 0) {
    date.setDate(date.getDate() + delta);
    const wDay = date.getDay();
    const dateTime = date.getTime();
    const dateYear = date.getFullYear();

    if (dateYear !== holidayYear) {
      holidayYear = dateYear;
      holidays = calcSpecialDays(holidayYear).filter((info) => info.holiday);
    }

    var notWorkDay =
      wDay === 0 ||
      wDay === 6 ||
      holidays.some(function (day) {
        return (
          day.date.getTime() === dateTime && !(includeHalfDays && day.halfDay)
        );
      });
    if (notWorkDay) {
      continue;
    }
    count -= 1;
  }

  return date;
};
