# Frídagar

Small, fast JavaScript/TypeScript library for looking up Icelandic public
holidays, and resolving business days before/after a given day. It also
provides info about other commonly observed "special" days such as
"Bolludagur", etc.

"Half day" holidays (such as Christmas and New Year's Eve) are marked as
such, and can be optionally treated as either "work days" or "non-work days",
depending on need.

All day names/descriptions are in Icelandic, but each day has a stable `key`
prop that can be used when translating its name into other languages.

All returned dates are in the UTC timezone and set to midnight.

```
npm install fridagar
```

<!-- prettier-ignore-start -->

- [Methods](#methods)
  - [`getHolidays`](#getholidays)
  - [`getAllDays`](#getalldays)
  - [`getAllDaysKeyed`](#getalldayskeyed)
  - [`getOtherDays`](#getotherdays)
  - [`isHoliday`](#isholiday)
  - [`isSpecialDay`](#isspecialday)
  - [`workdaysFromDate`](#workdaysfromdate)
- [Supported Days](#supported-days)
  - [Open Questions](#open-questions)
    - [Which Days to Include?](#which-days-to-include)
    - [Historical Accuracy](#historical-accuracy)
- [Exported types](#exported-types)
  - [type `Holiday`](#type-holiday)
  - [type `SpecialDay`](#type-specialday)
  - [type `DayKey`, `HolidayKey`, `SpecialDayKey`](#type-daykey-holidaykey-specialdaykey)
- [Contributing](#contributing)
- [Change Log](#change-log)

<!-- prettier-ignore-end -->

---

## Methods

---

### `getHolidays`

**Syntax:** `getHolidays(year?: number, month?: number): Array<Holiday>`

Returns all Icelandic public holidays and commonly celebrated "special" days
for a given year — optionally narrowed down to a single month.

```ts
import { getHolidays } from "fridagar";

const holidays2018 = getHolidays(2018);
const holidaysInDecember2018 = getHolidays(2018, 12);

// If year is omitted the current year is used
const holidaysThisYear = getHolidays();
const holidaysInDecemberThisYear = getHolidays(undefined, 12);
```

---

### `getAllDays`

**Syntax:**
`getAlldays(year?: number, month?: number): Array<Holiday | SpecialDay>`

Returns all official Icelandic public holidays (non-working days) for a
given year — optionally narrowed down to a single month.

```ts
import { getAllDays } from "fridagar";

const allDays2018 = getAllDays(2018);
const allDaysInDecember2018 = getAllDays(2018, 12);

// If year is omitted the current year is used
const allDaysThisYear = getAllDays();
const allDaysInDecemberThisYear = getAllDays(undefined, 12);
```

---

### `getAllDaysKeyed`

**Syntax:**
`getAllDaysKeyed(year?: number): Record<DayKey, Holiday | SpecialDay>`

Returns a keyed object with Icelandic public holidays and commonly celebrated
"special" days for a given year. (Defaults to the current year.)

```ts
import type { Holiday, SpecialDay } from "fridagar";
import { getAllDaysKeyed } from "fridagar";

const allDays1995 = getAllDaysKeyed(1995);

// Note that the days are correctly typed
const easter95: Holiday = allDays1995.paska;
const ashWed95: SpecialDay = allDays1995.osku;

console.log(easter95.date);
// Logs new Date('1995-04-23')
console.log(easter95.description);
// Logs "Páskadagur"
```

---

### `getOtherDays`

**Syntax:** `getOtherDays(year?: number, month?: number): Array<SpecialDay>`

Returns only unofficial, commonly celebrated "special days" (that are still
workdays) for a given year — optionally narrowed down to a single month.

```ts
import { getOtherDays } from "fridagar";

const otherdays2018 = getOtherDays(2018);
const otherdaysInDecember2018 = getOtherDays(2018, 12);

// If year is omitted the current year is used
const otherdaysThisYear = getOtherDays();
const otherdaysInDecemberThisYear = getOtherDays(undefined, 12);
```

---

### `isHoliday`

**Syntax:** `isHoliday(date: Date): Holiday | undefined`

Checks if a given date is an Icelandic public holiday, and if so, returns
its info object.

```ts
import { isHoliday } from "fridagar";

const res1 = isHoliday(new Date("2018-12-24"));
console.log(res1);
// Logs the `Holiday` object for Aðfangadagur

const res2 = isHoliday(new Date("2018-12-23"));
console.log(res2);
// Logs `undefined` (as Þorláksmessa is not a holiday.)
```

---

### `isSpecialDay`

**Syntax:** `isSpecialDay(date: Date): Holiday | SpecialDay | undefined`

Checks if a given date is either an Icelandic public holiday or a commonly
celebrated "special" day, and if so, returns its info object.

```ts
import { isSpecialDay } from "fridagar";

const res1 = isSpecialDay(new Date("2018-12-24"));
console.log(res1);
// Logs the `Holiday` object for Aðfangadagur

const res2 = isSpecialDay(new Date("2018-12-23"));
console.log(res2);
// Logs the `SpecialDay` object for Þorláksmessa

const res3 = isSpecialDay(new Date("2018-12-19"));
console.log(res3);
// Logs `undefined`  (Because Dec. 19th is just a normal day.)
```

---

### `workdaysFromDate`

**Syntax:**
`workdaysFromDate(days: number, refDate?: Date, includeHalfDays?: boolean): Date`

Returns the `days`-th business-day before/after the reference date.

Defaults to counting half-day holidays as "non-work" days.

```ts
import { workdaysFromDate } from "fridagar";

const dec23th2018 = new Date("2018-12-23"); // Thursday
const jan1st2025 = new Date("2024-01-01"); // Tuesday

// Treats Aðfangadagur as a non-work day by default
const secondWorkDay = workdaysFromDate(2, dec23th2018);
// new Date('2021-12-28') // Tuesday

// Optionally treats Aðfangadagur as a work day
const secondWorkDayInclHalfDay = workdaysFromDate(2, dec23th2018, true);
// new Date('2021-12-27') // Monday

// One business days before New Year's day of 2024
const prevDay = workdaysFromDate(-1, jan1st2024);
// new Date('2023-12-29') // Friday
```

If the `refDate` is omitted, the current (today) date is used.

```ts
const thirdWorkDayFromToday = workdaysFromDate(3);
```

NOTE: The returned date is always set to 00:00:00 UTC.

---

## Supported Days

These are the supported days and their identification 
[keys](#type-daykey-holidaykey-specialdaykey):

- **Nýársdagur** (`nyars`)
- Þrettándinn (`threttand`)
- Bóndadagur (`bonda`)
- Bolludagur (`bollu`)
- Sprengidagur (`sprengi`)
- Öskudagur (`osku`)
- Valentínusardagur (`valent`)
- Konudagur (`konu`)
- **Skírdagur** (`skir`)
- **Föstudagurinn langi** (`foslangi`)
- **Páskadagur** (`paska`)
- **Annar í páskum** (`paska2`)
- **Sumardagurinn fyrsti** (`sumar1`)
- **Verkalýðsdagurinn** (`mai1`)
- **Uppstigningardagur** (`uppst`)
- **Hvítasunnudagur** (`hvitas`)
- **Annar í Hvítasunnu** (`hvitas2`)
- Sjómannadagurinn (`sjomanna`)
- **Þjóðhátíðardagurinn** (`jun17`)
- Sumarsólstöður (`sumsolst`)
- Jónsmessa (`jonsm`)
- **Frídagur verslunarmanna** (`verslm`)
- Fyrsti vetrardagur (`vetur1`)
- Hrekkjavaka (`hrekkja`)
- Dagur íslenskrar tungu (`isltungu`)
- Fullveldisdagurinn (`fullv`)
- Vetrarsólstöður (`vetsolst`)
- Þorláksmessa (`thorl`)
- **Aðfangadagur** (`adfanga`)
- **Jóladagur** (`jola`)
- **Annar í Jólum** (`jola2`)
- **Gamlársdagur** (`gamlars`)

### Open Questions

#### Which Days to Include?

What to include is always subjective.

Currently the list focuses on:

- Official public holidays  (defined in law)
- Official days of flag-raising ("fánadagar") often to do with national 
  independence history, etc.
- Traditional Icelandic cultural "special days", which are a mixture of 
  centuries old folk-traditions and (Christian) religious culture.
- Days that are actively celebrated despite not fulfilling any of the above 
  criteria. (Like "Hrekkjavaka")

This means "Valentínusardagur" is a bit of an oddball in this list.
It's inclusion begs the question why we don't include other similar days such 
as "Mæðradagurinn", "Feðradagurinn", or even "Singles Day".
Or should it be removed?

The "on the fence" category includes:

- Mæðradagurinn & Feðradagurinn
- Kvennafrídagurinn
- Bjórdagurinn
- Beginning/end of Ramadan
- St. Patrick's Day

#### Historical Accuracy

Example: "Dagur íslenskrar tungu" was first celebrated in 1996. Should 
`getAllDays(1980)` include it or not?

Problem is that many days don't have a definite starting date, they just faded
into existence over time. Other days (such as "Mæðradagurinn") have had 
different dates at different times.

Currently the library does NOT aim for historical accuracy, and will return all
"modern day" special days for any year — and completely ignore the fact that
"Frídagur verslunarmanna in the year 345 BC" makes absolutely no sense.

---

## Exported types

---

### type `Holiday`

An object describing an Icelandic public holiday.

```ts
import type { Holiday } from "fridagar";

// Example
const xmasEve2017: Holiday = {
  date: new Date("2017-12-24T00:00:00.000Z"),
  description: "Aðfangadagur",
  key: "adfanga", // stable identifier for this holiday
  holiday: true,
  halfDay: true,
};
```

NOTE: All dates are set to 00:00:00 UTC

---

### type `SpecialDay`

An object describing an Icelandic commonly celebrated "special" day, such as
"Bolludagur", etc.

```ts
import type { SpecialDay } from "fridagar";

// Example
const sovereignDay2017: SpecialDay = {
  date: new Date("2017-12-01T00:00:00.000Z"),
  description: "Fullveldisdagurinn",
  key: "fullv", // stable identifier for this special day
  holiday: false, // not a public holiday
};
```

NOTE: All dates are set to 00:00:00 UTC

---

### type `DayKey`, `HolidayKey`, `SpecialDayKey`

String union types of all possible `key` values for `Holiday` and
`SpecialDay` objects. These are mainly useful when translating the day
names/descriptions into other languages.

```ts
import type { DayKey, HolidayKey, SpecialDayKey } from "fridagar";

const holidayNamesPolish: Record<HolidayKey, string> = {
  nyars: "Nowy Rok",
  adfanga: "Wigilia",
  jola: "Boże Narodzenie",
  // etc...
};
const specialDayNamesPolish: Record<SpecialDayKey, string> = {
  bollu: "Dzień Pączka",
  sjomanna: "Dzień Marynarza",
  // etc...
};

// DayKey is a shorthand union of HolidayKey and SpecialDayKey
const allDayNamesPolish: Record<DayKey, string> = {
  ...holidayNamesPolish,
  ...specialDayNamesPolish,
};
```

---

## Contributing

This project uses the [Bun runtime](https://bun.sh) for development (tests,
build, etc.)

PRs are welcoms!

---

## Change Log

See [CHANGELOG.md](https://github.com/gaui/fridagar-node/blob/dev/CHANGELOG.md)
