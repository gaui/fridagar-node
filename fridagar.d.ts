export type Holiday = {
  date: Date;
  description: string;
  holiday: true;
  halfDay?: true;
};

export type SpecialDay = {
  date: Date;
  description: string;
  holiday: false;
};

/** Returns all official holidays */
export function getHolidays(
  /** Defaults to the current year */
  year?: number,
  /** 1-based month number, where January is 1 and December is 12 */
  month?: number
): Array<Holiday>;

/** Returns only unofficial "holidays" even if they're workdays. */
export function getOtherDays(
  /** Defaults to the current year */
  year?: number,
  /** 1-based month number, where January is 1 and December is 12 */
  month?: number
): Array<SpecialDay>;

/** Returns all "holidays" — official and unofficial. */
export function getAllDays(
  /** Defaults to the current year */
  year?: number,
  /** 1-based month number, where January is 1 and December is 12 */
  month?: number
): Array<Holiday | SpecialDay>;

/**
 * Checks if a given date is an officia holiday and if so, returns its
 * holiday info.
 */
export function isHoliday(
  /** Defaults to the current day */
  day?: Date
): Holiday | undefined;

/**
 * Checks if a given date is either an official or unofficial holiday and if so,
 * returns it's info object.
 */
export function isSpecialDay(
  /** Defaults to the current day */
  day?: Date
): Holiday | SpecialDay | undefined;



/**
 * Returns the `days`-th working day before/after the reference date.
 *
 * Defaults to counting half-day holidays as "non-work" days.
 */
export function workdaysFromDate(
  /** Number of working days to count (either positive or negative) */
  days: number,
  /** The reference date. Defaults to current day */
  date?: Date,
  /** Defaults to counting half-day holidays as "non-work" days */
  includeHalfDays?: boolean
): Date;

