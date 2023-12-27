import { expect, test, describe } from "bun:test";
import { workdaysFromDate, isSpecialDay, isHoliday, getHolidays, getOtherDays, getAllDays} from "./fridagar.js";
import * as fridagar from './fridagar.js';
import type { Holiday, SpecialDay } from './fridagar.js';


if (false as boolean) {
  const exports: Record<keyof typeof fridagar, true> = {
    getAllDays: true,
    getHolidays: true,
    getOtherDays: true,
    workdaysFromDate: true,
    isHoliday: true,
    isSpecialDay: true,
  };
  const foo1: Array<Holiday|SpecialDay> = getAllDays();
  const foo2: Array<Holiday> = getHolidays();
  const foo3: Array<SpecialDay> = getOtherDays();
}

const T00 = 'T00:00:00.000Z';

const iso = (date: Date) => {
  const isoDate = date.toISOString();
  return isoDate.endsWith(T00) ? isoDate.slice(0,10) : isoDate;
}

describe('getAllDays', () => {
  const allDays = getAllDays(2020);
  test('all dates are at T00:00', ()=> {
    expect(allDays.every((info) => info.date.toISOString().endsWith(T00)))
      .toBe(true)
  })
})

describe('isSpecialDay', () => {
  test('special days in 2023-12', () => {
    expect(!!isSpecialDay(new Date('2023-12-25'))).toBe(true);
    expect(!!isSpecialDay(new Date('2023-12-22'))).toBe(true);
    expect(!!isSpecialDay(new Date('2023-12-22T13:00'))).toBe(true);
    expect(!!isSpecialDay(new Date('2023-12-31'))).toBe(true);
  })
  test('date param is required', () => {
    expect(() => isSpecialDay()).toThrow();
  })
})

describe('isHoliday', () => {
  test('holidays in 2023-12', () => {
    expect(!!isHoliday(new Date('2023-12-22'))).toBe(false);
    expect(!!isHoliday(new Date('2023-12-25'))).toBe(true);
    expect(!!isHoliday(new Date('2023-12-31'))).toBe(true);
  })
  test('date param is required', () => {
    expect(() => isHoliday()).toThrow();
  })
})

describe('workdaysFromDate', () => {
  const today = new Date()
  test('finds future days', () => {
    expect(iso(workdaysFromDate(2, new Date('2023-12-06'/* Wed */))))
      .toBe('2023-12-08');
    expect(iso(workdaysFromDate(2, new Date('2023-12-08'/* Fri */))))
      .toBe('2023-12-12');
    expect(iso(workdaysFromDate(2, new Date('2023-12-25')/* Mon */)))
      .toBe('2023-12-28');
    expect(iso(workdaysFromDate(60, new Date('2023-06-01'/* Wed */))))
      .toBe('2023-08-25');
  })
  test('treats halfDays as non-workdays by default', () => {
    expect(iso(workdaysFromDate(1, new Date('2021-12-22'/* Wed */))))
      .toBe('2021-12-23');
    expect(iso(workdaysFromDate(1, new Date('2021-12-23'/* Thu */))))
      .toBe('2021-12-27');
    expect(iso(workdaysFromDate(1, new Date('2021-12-23'/* Thu */), true)))
      .toBe('2021-12-24');
  })
  test('returns the refDate if offset is 0', () => {
    expect(iso(workdaysFromDate(0, new Date('2023-12-06')/* Wed */)))
      .toBe('2023-12-06');
    expect(iso(workdaysFromDate(0, new Date('2023-12-08')/* Fri */)))
      .toBe('2023-12-08');
  })
  test('always returns new date', () => {
    expect(workdaysFromDate(1) === workdaysFromDate(1))
      .toBe(false)
  })
  test('finds previous workdays', () => {
    expect(iso(workdaysFromDate(-1, new Date('2020-12-21'/* Mon */))))
      .toBe('2020-12-18');
    expect(iso(workdaysFromDate(-1, new Date('2020-12-25'/* Fri */))))
      .toBe('2020-12-23');
    expect(iso(workdaysFromDate(-1, new Date('2020-12-25'/* Fri */), true)))
      .toBe('2020-12-24');
  })
  test('Searches into adjacent year', () => {
    expect(iso(workdaysFromDate(1, new Date('2023-12-29'/* Fri */))))
      .toBe('2024-01-02');
    expect(iso(workdaysFromDate(-1, new Date('2025-01-02'/* Tue */))))
      .toBe('2024-12-30');
  })
})