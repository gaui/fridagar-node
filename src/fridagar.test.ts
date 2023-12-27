import { expect, test, describe, setSystemTime } from "bun:test";
import {
  workdaysFromDate,
  isSpecialDay,
  isHoliday,
  getHolidays,
  getOtherDays,
  getAllDays,
} from "./fridagar.js";
import * as fridagar from "./fridagar.js";
import type {
  Holiday,
  SpecialDay,
  HolidayKey,
  SpecialDayKey,
} from "./fridagar.js";

if (false as boolean) {
  // Type tests/assertsions
  // to make sure the package exposes all the intended method and type exports
  const exports: Record<keyof typeof fridagar, true> = {
    getAllDays: true,
    getHolidays: true,
    getOtherDays: true,
    workdaysFromDate: true,
    isHoliday: true,
    isSpecialDay: true,
  };
  const foo1: Array<Holiday | SpecialDay> = getAllDays();
  const foo2: Array<Holiday> = getHolidays();
  const foo3: Array<SpecialDay> = getOtherDays();
  const foo4: HolidayKey | SpecialDayKey = "jun17";
}

const MIDNIGHT = "T00:00:00.000Z";

/** Shorthand for new Date() */
const D = (t: string | number) => new Date(t);

// ---------------------------------------------------------------------------

[
  { method: getAllDays },
  { method: getHolidays, isHoliday: true },
  { method: getOtherDays, isHoliday: false },
].forEach(({ method, isHoliday }) => {
  describe(method.name, () => {
    test("defaults to the current year", () => {
      setSystemTime(D(`2000-02-23T12:34:56`));
      const days = method();
      expect(days).toBeArray();
      expect(
        days.every((day) => day.date.toISOString().startsWith("2000-"))
      ).toBe(true);
      expect(days[0]!.date.getMonth()).toBe(0);
      expect(days[days.length - 1]!.date.getMonth()).toBe(11);
      setSystemTime();
    });
    test("all dates are at midnight", () => {
      expect(
        method().every((info) => info.date.toISOString().endsWith(MIDNIGHT))
      ).toBe(true);
    });
    test("allows passing specific year", () => {
      const days = method(2021);
      expect(days).toBeArray();
      expect(
        days.every((day) => day.date.toISOString().startsWith("2021-"))
      ).toBe(true);
      expect(days[0]!.date.getMonth()).toBe(0);
      expect(days[days.length - 1]!.date.getMonth()).toBe(11);
    });
    test("allows passing specific 1-based month", () => {
      const days = method(2021, 12);
      expect(days).toBeArray();
      expect(
        days.every((day) => day.date.toISOString().startsWith("2021-12-"))
      ).toBe(true);
    });
    test("out of bound months return empty array", () => {
      expect(method(2012, -1)).toBeArrayOfSize(0);
      expect(method(2012, 0)).toBeArrayOfSize(0);
      expect(method(2012, 13)).toBeArrayOfSize(0);
    });
    test("month arguments with an undefined year uses current year", () => {
      setSystemTime(D(`2000-02-23T12:34:56`));
      expect(
        method(undefined, 12).every((day) =>
          day.date.toISOString().startsWith("2000-12-")
        )
      ).toBe(true);
      setSystemTime();
    });
    if (isHoliday != null) {
      test(`only returns days with holiday === ${isHoliday}`, () => {
        [[], [2021], [2021, 12]].forEach((args) =>
          expect(
            method(...args).every((day) => day.holiday === isHoliday)
          ).toBe(true)
        );
      });
    }
  });
});

// ---------------------------------------------------------------------------

describe("isSpecialDay", () => {
  test("special days in 2023-12", () => {
    expect(!!isSpecialDay(D("2023-12-25"))).toBe(true);
    expect(!!isSpecialDay(D("2023-12-22"))).toBe(true);
    expect(!!isSpecialDay(D("2023-12-22T13:00"))).toBe(true);
    expect(!!isSpecialDay(D("2023-12-31"))).toBe(true);
  });
  test("Always returns new date info object", () => {
    const date = D("2023-12-25");
    expect(isSpecialDay(date) !== isSpecialDay(date)).toBe(true);
  });
  test("date param is required", () => {
    // @ts-expect-error  (Testing bad input)
    const emptyInput: Date = undefined;
    expect(() => isSpecialDay(emptyInput)).toThrow();
  });
});

// ---------------------------------------------------------------------------

describe("isHoliday", () => {
  test("holidays in 2023-12", () => {
    expect(!!isHoliday(D("2023-12-22"))).toBe(false);
    expect(!!isHoliday(D("2023-12-25"))).toBe(true);
    expect(!!isHoliday(D("2023-12-31"))).toBe(true);
  });
  test("Always returns new date info object", () => {
    const date = D("2023-12-25");
    expect(isHoliday(date) !== isHoliday(date)).toBe(true);
  });
  test("date param is required", () => {
    // @ts-expect-error  (Testing bad input)
    const emptyInput: Date = undefined;
    expect(() => isHoliday(emptyInput)).toThrow();
  });
});

// ---------------------------------------------------------------------------

describe("workdaysFromDate", () => {
  /** Wrapper around workdaysFromDate for easier testing of the result date */
  const workDaysISO = (
    offset: number,
    refDate?: Date,
    halfDays?: boolean
  ): string => {
    const date = workdaysFromDate(offset, refDate, halfDays);
    const isoDate = date.toISOString();
    // return full ISO datetime if it's not exactly at MIDNIGHT
    return isoDate.endsWith(MIDNIGHT) ? isoDate.slice(0, 10) : isoDate;
  };
  
  const today = new Date();
  test("finds future days", () => {
    expect(workDaysISO(2, D("2023-12-06" /* Wed */))).toBe("2023-12-08");
    expect(workDaysISO(2, D("2023-12-08" /* Fri */))).toBe("2023-12-12");
    expect(workDaysISO(2, D("2023-12-25" /* Mon */))).toBe("2023-12-28");
    expect(workDaysISO(60, D("2023-06-01" /* Wed */))).toBe("2023-08-25");
  });
  test("treats halfDays as non-workdays by default", () => {
    expect(workDaysISO(1, D("2021-12-22" /* Wed */))).toBe("2021-12-23");
    expect(workDaysISO(1, D("2021-12-23" /* Thu */))).toBe("2021-12-27");
    expect(workDaysISO(1, D("2021-12-23" /* Thu */), true)).toBe("2021-12-24");
  });
  test("returns the refDate if offset is 0", () => {
    expect(workDaysISO(0, D("2023-12-06" /* Wed */))).toBe("2023-12-06");
    expect(workDaysISO(0, D("2023-12-08" /* Fri */))).toBe("2023-12-08");
  });
  test("always returns a new date", () => {
    expect(workdaysFromDate(1) === workdaysFromDate(1)).toBe(false);
  });
  test("finds previous workdays", () => {
    expect(workDaysISO(-1, D("2020-12-21" /* Mon */))).toBe("2020-12-18");
    expect(workDaysISO(-1, D("2020-12-25" /* Fri */))).toBe("2020-12-23");
    expect(workDaysISO(-1, D("2020-12-25" /* Fri */), true)).toBe("2020-12-24");
  });
  test("Searches into adjacent year", () => {
    expect(workDaysISO(1, D("2023-12-29" /* Fri */))).toBe("2024-01-02");
    expect(workDaysISO(-1, D("2025-01-02" /* Tue */))).toBe("2024-12-30");
  });
});
