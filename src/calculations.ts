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

export type SpecialDayKey =
  | "bonda"
  | "bollu"
  | "sprengi"
  | "osku"
  | "valent"
  | "konu"
  | "sumsolst"
  | "jonsm"
  | "hrekkja"
  | "fullv"
  | "vetsolst"
  | "thorl";

export type Holiday = {
  date: Date;
  description: string;
  key: HolidayKey;
  holiday: true;
  halfDay?: true;
};

export type SpecialDay = {
  date: Date;
  description: string;
  key: SpecialDayKey;
  holiday: false;
  halfDay?: never;
};

export const dayMs = 24 * 3600 * 1000;

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

  return new Date(year, easterMonth - 1, easterDay);
};

const findNextWeekDay = (
  year: number,
  month: number,
  day: number,
  targetWDay: number
) => {
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + ((targetWDay - date.getDay() + 7) % 7));
  return date;
};

let solsticeInterval = (56.5 + 47 * 60 + 5 * 3600 + 365 * 86400) * 1000;
let solsticeBaseSummer: number;
let solsticeBaseWinter: number;
const solstice = (year: number, season?: "winter" | "summer") => {
  if (!solsticeBaseSummer) {
    solsticeBaseSummer = new Date(2016, 11, 21, 10, 44).getTime();
    solsticeBaseWinter = new Date(2016, 5, 20, 22, 34).getTime();
  }
  let time = season === "winter" ? solsticeBaseWinter : solsticeBaseSummer;
  time = time + solsticeInterval * (year - 2016);
  return new Date(time - (time % dayMs));
};

const yearCache: Record<number, Array<Holiday | SpecialDay>> = {};

export const calcSpecialDays = (year: number) => {
  let holidays = yearCache[year];
  if (!holidays) {
    const bondadagur = findNextWeekDay(year, 0, 19, 5);
    const easterSunday = easter(year);
    const easterSundayMs = easterSunday.getTime();
    const _holidays = [
      {
        date: new Date(year, 0, 1),
        description: "Nýársdagur",
        key: "nyars",
        holiday: true,
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
        date: new Date(year, 1, 14),
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
        date: new Date(easterSundayMs + dayMs),
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
        date: new Date(easterSundayMs + 39 * dayMs),
        description: "Uppstigningardagur",
        key: "uppst",
        holiday: true,
      },
      {
        date: new Date(easterSundayMs + 49 * dayMs),
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
        date: new Date(year, 4, 1),
        description: "Verkalýðsdagurinn",
        key: "mai1",
        holiday: true,
      },
      {
        date: new Date(year, 5, 17),
        description: "Þjóðhátíðardagur Íslendinga",
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
        date: new Date(year, 5, 24),
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
        date: new Date(year, 9, 31),
        description: "Hrekkjavaka",
        key: "hrekkja",
        holiday: false,
      },
      {
        date: new Date(year, 11, 1),
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
        date: new Date(year, 11, 23),
        description: "Þorláksmessa",
        key: "thorl",
        holiday: false,
      },
      {
        date: new Date(year, 11, 24),
        description: "Aðfangadagur",
        key: "adfanga",
        holiday: true,
        halfDay: true,
      },
      {
        date: new Date(year, 11, 25),
        description: "Jóladagur",
        key: "jola",
        holiday: true,
      },
      {
        date: new Date(year, 11, 26),
        description: "Annar í Jólum",
        key: "jola2",
        holiday: true,
      },
      {
        date: new Date(year, 11, 31),
        description: "Gamlársdagur",
        key: "gamlars",
        holiday: true,
        halfDay: true,
      },
    ] as const satisfies Array<Holiday | SpecialDay>;

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
