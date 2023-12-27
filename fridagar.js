var CalculateHolidays = require('./CalculateHolidays.js');
var { dayMs } = CalculateHolidays


const cloneInfo = (dayInfo) => ({
  ...dayInfo,
  date: new Date(dayInfo.date)
})


/**
 * Get both holidays and other days
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   [month]    Month to get results for (1-12)
 * @return Date array
 */
exports.getAllDays = function(year, month) {
  if(!year) {
    year = (new Date()).getFullYear();
  }

  var days = CalculateHolidays.holidays(year);

  if(month) {
    days = days.filter(function(day) {
      return day.date.getMonth() === month-1;
    });
  }

  return days.map(cloneInfo);
}

/**
 * Get holidays (non-working days)
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   [month]    Month to get results for (1-12)
 * @return Date array
 */
exports.getHolidays =  (year, month) => exports.getAllDays(year, month).filter((day) => day.holiday);

/**
 * Get other days (important but working days)
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   [month]    Month to get results for (1-12)
 * @return Date array
 */
exports.getOtherDays = (year, month) => exports.getAllDays(year, month).filter((day) => !day.holiday);

var isSpecialDay = function(date) {
  let dateMs = date.getTime();
  dateMs -= dateMs % 86400000;
  var holidays = CalculateHolidays.holidays(date.getFullYear());
  const dayInfo = holidays.find(function(day) {
    return day.date.getTime() === dateMs;
  })
  return dayInfo ? cloneInfo(dayInfo) : undefined
}

/**
 * Checks if a given date is an official holiday
 * and if so, returns its info object.
 * @param  {Date}  date  Date to check
 * @return Date info or undefined
 */
exports.isHoliday = function(date) {
  const dayInfo = isSpecialDay(date);
  return dayInfo && dayInfo.holiday ? dayInfo : undefined
}

/**
 * Checks if a given date is either an official or unofficial holiday
 * and if so, returns its info object.
 * @param  {Date}  date  Date to check
 * @return Date info or undefined
 */
exports.isSpecialDay = isSpecialDay;

/**
 * Get the date afer a certain amount of work days from a Date Object
 * Non holidays and non weekends.
 * @param  {Number}   days    Number of days to count, either positive or negative.
 * @param  {Date}     [refDate]    Date to start counting from
 * @param  {Boolean}  [includeHalfDays]    Whether to include half-day holidays as workdays
 * @return Date
 */
exports.workdaysFromDate = function(days, refDate, includeHalfDays) {
  var date = refDate ? new Date(refDate) : new Date();
  date = new Date(date.toISOString().slice(0,10));

  if (days === 0) {
    return date
  }
  var delta = days > 0 ? 1 : -1;
  var count = Math.abs(days);

  let holidays;
  let holidayYear;

  while(count > 0) {
    date.setDate(date.getDate() + delta);
    var wDay = date.getDay();
    var dateTime = date.getTime();
    var dateYear = date.getFullYear()

    if (dateYear !== holidayYear) {
      holidayYear = dateYear
      holidays = CalculateHolidays
        .holidays(holidayYear)
        .filter((info) => info.holiday);
    }

    var notWorkDay = wDay === 0 || wDay === 6 || holidays.some(function(day) {
      return day.date.getTime() === dateTime && !(includeHalfDays && day.halfDay);
    });
    if (notWorkDay) {
      continue;
    }
    count -= 1;
  }

  return date;
}
