import type { Holiday, SpecialDay } from "./calculations.js";
import { calcSpecialDays, dayMs } from "./calculations.js";

const cloneInfo = <T extends Holiday | SpecialDay>(dayInfo: T): T => ({
  ...dayInfo,
  date: new Date(dayInfo.date),
});

export type { Holiday, SpecialDay };

/**
 * Returns all "holidays" — official and unofficial.
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<Holiday | SpecialDay>} Array of day info objects
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
 * Returns all official Icelandic holidays (non-working days).
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<Holiday>} Array of day info objects
 */
export const getHolidays = (year?: number, month?: number) =>
  getAllDays(year, month).filter((day): day is Holiday => day.holiday);

/**
 * Returns only unofficial "holidays"/"special days" that are still workdays.
 *
 * @param  {number}  [year]  Year to get results for. Defaults to the current year
 * @param  {number}  [month]  Month to get results for (1-based, where January is 1 and December is 12)
 * @return {Array<SpecialDay>} Array of day info objects
 */
export const getOtherDays = (year?: number, month?: number) =>
  getAllDays(year, month).filter((day): day is SpecialDay => !day.holiday);

/**
 * Checks if a given date is either an official or unofficial holiday
 * and if so, returns its info object.
 *
 * @param  {Date}  date  Date to check
 * @return {Holiday | SpecialDay | undefined} Date info or undefined
 */
export const isSpecialDay = (date: Date) => {
  let dateMs = date.getTime();
  dateMs -= dateMs % dayMs;
  const holidays = calcSpecialDays(date.getFullYear());
  const dayInfo = holidays.find((day) => day.date.getTime() === dateMs);
  return dayInfo ? cloneInfo(dayInfo) : undefined;
};

/**
 * Checks if a given date is an official holiday
 * and if so, returns its info object.
 *
 * @param  {Date}  date  Date to check
 * @return {Holiday | undefined} Date info or undefined
 */
export const isHoliday = (date: Date) => {
  const dayInfo = isSpecialDay(date);
  return dayInfo && dayInfo.holiday ? dayInfo : undefined;
};

/**
 * Returns the `days`-th working day before/after the reference date.
 *
 * Defaults to counting half-day holidays as "non-work" days.
 *
 * @param  {number}  days  Number of working days to count (either positive or negative).
 * @param  {Date}  [refDate]  The reference date to start couting from. (Defaults to current day.)
 * @param  {boolean}  [includeHalfDays]  Whether to include half-day holidays as workdays. (Default `false`.)
 * @return {Date} The resolved workday
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
