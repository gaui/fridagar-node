/**
 * Identifiers for Icelandic public holidays.
 * Useful for building translations.
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#type-daykey-holidaykey-specialdaykey
 */
export type HolidayKey =
  | "nyars"
  | "skir"
  | "foslangi"
  | "paska"
  | "paska2"
  | "sumar1"
  | "uppst"
  | "mai1"
  | "hvitas"
  | "hvitas2"
  | "jun17"
  | "verslm"
  | "adfanga"
  | "jola"
  | "jola2"
  | "gamlars";

/**
 * Identifiers for Icelandic commonly celebrated "special" days.
 * Useful for building translations.
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#type-daykey-holidaykey-specialdaykey
 */
export type SpecialDayKey =
  | "þrettand"
  | "bonda"
  | "bollu"
  | "sprengi"
  | "osku"
  | "valent"
  | "konu"
  | "sjomanna"
  | "sumsolst"
  | "jonsm"
  | "vetur1"
  | "hrekkja"
  | "fullv"
  | "vetsolst"
  | "thorl";


/**
 * Indentifier for Icelandic public holidays and commonly celebrated "special"
 * days.
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#type-daykey-holidaykey-specialdaykey
 */
export type DayKey = HolidayKey | SpecialDayKey;

/**
 * An object describing an Icelandic public holiday.
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#type-holiday
 */
export type Holiday = {
  date: Date;
  /** The Icelandic name of the holiday */
  description: string;
  /** Stable identifier for each holiday. Useful for translation */
  key: HolidayKey;
  /** Indicates that the day IS a public holiday */
  holiday: true;
  /** Indicates if it's only a half-day holiday */
  halfDay?: true;
};

/**
 * An object describing an Icelandic commonly celebrated "special" day,
 * such as "Bolludagur", etc.
 *
 * @see https://github.com/gaui/fridagar-node/tree/v4#type-specialday
 */
export type SpecialDay = {
  date: Date;
  /** The Icelandic name of the "special" day */
  description: string;
  /** Stable identifier for each special day. Useful for building translation. */
  key: SpecialDayKey;
  /** Indicates that the day IS NOT a public holiday */
  holiday: false;
  halfDay?: never;
};

export const dayMs = 24 * 3600 * 1000;

/**
 * Performs the magic calculations required to resovle the date of
 * Easter Sunday for a given year.
 */
const easter = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, easterMonth - 1, easterDay));
};

const _rimspillirCache: Record<number, 1 | 0> = {
  // precalculated values for the period 1900-2100
  1911: 1,
  1939: 1,
  1967: 1,
  1995: 1,
  2023: 1,
  2051: 1,
  2079: 1,
};
/**
 * Returns 1 if the given year is a "Rímspilliár" year, 0 otherwise.
 * This return value is then used shift the base/reference date for
 * certain special days.
 */
export const rimspillir = (year: number): 1 | 0 => {
  if ((year < 1900 || year > 2199) && _rimspillirCache[year] === undefined) {
    const nextYear = year + 1;
    const nextIsLeapYear =
      nextYear % 4 === 0 && (nextYear % 100 !== 0 || nextYear % 400 === 0);
    const isRimspilliar =
      nextIsLeapYear && new Date(year - 1, 11, 31).getDay() === 6;
    _rimspillirCache[year] = isRimspilliar ? 1 : 0;
  }
  return _rimspillirCache[year] || 0;
};

/**
 * Finds the next weekday after a given date, possibly on the date.
 *
 * Weekdays are indexed 0-6, where 0 is Sunday, 1 is Monday, etc.
 */
const findNextWeekDay = (
  year: number,
  /** 0-based month index */
  month: number,
  day: number,
  targetWDay: number
) => {
  const date = new Date(Date.UTC(year, month, day));
  date.setDate(date.getDate() + ((targetWDay - date.getDay() + 7) % 7));
  return date;
};

let solsticeInterval = (56.5 + 47 * 60 + 5 * 3600 + 365 * 86400) * 1000;
let solsticeBaseSummer: number;
let solsticeBaseWinter: number;
const solstice = (year: number, season?: "winter" | "summer") => {
  if (!solsticeBaseSummer) {
    solsticeBaseSummer = new Date(Date.UTC(2016, 5, 20, 22, 34)).getTime();
    solsticeBaseWinter = new Date(Date.UTC(2016, 11, 21, 10, 44)).getTime();
  }
  let time = season === "winter" ? solsticeBaseWinter : solsticeBaseSummer;
  time = time + solsticeInterval * (year - 2016);
  return new Date(time - (time % dayMs));
};

// ===========================================================================

const yearCache: Record<number, Array<Holiday | SpecialDay>> = {};

export const calcSpecialDays = (year: number) => {
  let holidays = yearCache[year];
  if (!holidays) {
    const bondadagur = findNextWeekDay(year, 0, 19 + rimspillir(year - 1), 5);
    const easterSunday = easter(year);
    const easterSundayMs = easterSunday.getTime();
    const whitsunday = new Date(easterSundayMs + 49 * dayMs);
    const withsun1stJuneSun =
      whitsunday.getUTCMonth() === 5 && whitsunday.getUTCDate() < 8;

    const _holidays = [
      {
        date: new Date(Date.UTC(year, 0, 1)),
        description: "Nýársdagur",
        key: "nyars",
        holiday: true,
      },
      {
        date: new Date(Date.UTC(year, 0, 6)),
        description: "Þrettándinn",
        key: "þrettand",
        holiday: false,
      },
      {
        date: bondadagur,
        description: "Bóndadagur",
        key: "bonda",
        holiday: false,
      },
      {
        date: new Date(easterSundayMs - 48 * dayMs),
        description: "Bolludagur",
        key: "bollu",
        holiday: false,
      },
      {
        date: new Date(easterSundayMs - 47 * dayMs),
        description: "Sprengidagur",
        key: "sprengi",
        holiday: false,
      },
      {
        date: new Date(easterSundayMs - 46 * dayMs),
        description: "Öskudagur",
        key: "osku",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 1, 14)),
        description: "Valentínusardagur",
        key: "valent",
        holiday: false,
      },
      {
        date: new Date(bondadagur.getTime() + 30 * dayMs),
        description: "Konudagur",
        key: "konu",
        holiday: false,
      },
      {
        date: new Date(easterSundayMs - 3 * dayMs),
        description: "Skírdagur",
        key: "skir",
        holiday: true,
      },
      {
        date: new Date(easterSundayMs - 2 * dayMs),
        description: "Föstudagurinn langi",
        key: "foslangi",
        holiday: true,
      },
      {
        date: easterSunday,
        description: "Páskadagur",
        key: "paska",
        holiday: true,
      },
      {
        date: new Date(easterSundayMs + 1 * dayMs),
        description: "Annar í páskum",
        key: "paska2",
        holiday: true,
      },
      {
        date: findNextWeekDay(year, 3, 19, 4),
        description: "Sumardagurinn fyrsti",
        key: "sumar1",
        holiday: true,
      },
      {
        date: new Date(Date.UTC(year, 4, 1)),
        description: "Verkalýðsdagurinn",
        key: "mai1",
        holiday: true,
      },
      {
        date: new Date(easterSundayMs + 39 * dayMs),
        description: "Uppstigningardagur",
        key: "uppst",
        holiday: true,
      },
      {
        date: whitsunday,
        description: "Hvítasunnudagur",
        key: "hvitas",
        holiday: true,
      },
      {
        date: new Date(easterSundayMs + 50 * dayMs),
        description: "Annar í Hvítasunnu",
        key: "hvitas2",
        holiday: true,
      },
      {
        date: findNextWeekDay(year, 5, withsun1stJuneSun ? 8 : 1, 0),
        description: "Sjómannadagurinn",
        key: "sjomanna",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 5, 17)),
        description: "Þjóðhátíðardagurinn",
        key: "jun17",
        holiday: true,
      },
      {
        date: solstice(year, "summer"),
        description: "Sumarsólstöður",
        key: "sumsolst",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 5, 24)),
        description: "Jónsmessa",
        key: "jonsm",
        holiday: false,
      },
      {
        date: findNextWeekDay(year, 7, 1, 1),
        description: "Frídagur verslunarmanna",
        key: "verslm",
        holiday: true,
      },
      {
        date: findNextWeekDay(year, 9, 21 + rimspillir(year), 6),
        description: "Fyrsti vetrardagur",
        key: "vetur1",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 9, 31)),
        description: "Hrekkjavaka",
        key: "hrekkja",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 11, 1)),
        description: "Fullveldisdagurinn",
        key: "fullv",
        holiday: false,
      },
      {
        date: solstice(year, "winter"),
        description: "Vetrarsólstöður",
        key: "vetsolst",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 11, 23)),
        description: "Þorláksmessa",
        key: "thorl",
        holiday: false,
      },
      {
        date: new Date(Date.UTC(year, 11, 24)),
        description: "Aðfangadagur",
        key: "adfanga",
        holiday: true,
        halfDay: true,
      },
      {
        date: new Date(Date.UTC(year, 11, 25)),
        description: "Jóladagur",
        key: "jola",
        holiday: true,
      },
      {
        date: new Date(Date.UTC(year, 11, 26)),
        description: "Annar í Jólum",
        key: "jola2",
        holiday: true,
      },
      {
        date: new Date(Date.UTC(year, 11, 31)),
        description: "Gamlársdagur",
        key: "gamlars",
        holiday: true,
        halfDay: true,
      },
    ] as const satisfies Array<Holiday | SpecialDay>;

    _holidays.sort((a, b) => (
        a.date.getTime() - b.date.getTime() ||
        // Sort holidays ahead of special days (this never happens in practice)
        // but just to be sure, as we want `isHoliday()` (and other dumb/simple
        // seek/find functions) to return the holiday info object as the first
        // result.
        (a.holiday === b.holiday ? 0 : a.holiday ? 1 : -1)
      )
    );

    // Tree-shakable no-op variable that asserts that the manually crafted
    // `_holidays` array uses every `HolidayKey` and `SpecialDayKey` value.
    const _NoKeyLeftBehind_: (typeof _holidays)[number]["key"] = "" as
      | HolidayKey
      | SpecialDayKey;

    holidays = yearCache[year] = _holidays;

    setTimeout(() => delete yearCache[year], 500);
  }
  return holidays;
};
