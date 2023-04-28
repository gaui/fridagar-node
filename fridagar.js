var CalculateHolidays = require('./CalculateHolidays');



/**
 * Get holidays (non-working days)
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   [month]    Month to get results for (1-12)
 * @return Date array
 */
exports.getHolidays = function getHolidays(year, month) {
  if(!year) {
    year = (new Date()).getFullYear();
  }

  var holidays = CalculateHolidays.holidays(year).filter(function(day) {
    return day.holiday === true;
  });

  if(month) {
    holidays = holidays.filter(function(day) {
      return day.date.getMonth() === month-1;
    });
  }

  return holidays;
}

/**
 * Get other days (important but working days)
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   [month]    Month to get results for (1-12)
 * @return Date array
 */
exports.getOtherDays =  function(year, month) {
    if(!year) {
    year = (new Date()).getFullYear();
  }

  var otherDays = CalculateHolidays.holidays(year).filter(function(day) {
    return day.holiday === false;
  });

  if(month) {
    otherDays = otherDays.filter(function(day) {
      return day.date.getMonth() === month-1;
    });
  }

  return otherDays;
}

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

  return days;
}

/**
 * Get the date afer a certain amount of work days from a Date Object
 * Non holidays and non weekends.
 * @param  {Number}   days    Number of days to count, either positive or negative.
 * @param  {Date}     [date]    Date to start counting from
 * @param  {Boolean}  [includeHalfDays]    Whether to include half-day holidays as workdays
 * @return Date
 */
exports.workdaysFromDate = function(days, date, includeHalfDays) {
  var date = refDate ? new Date(refDate) : new Date();
  date = new Date(date.toISOString().slice(0,10));

  if (days === 0) {
    return date
  }
  var delta = days > 0 ? 1 : -1;
  var count = Math.abs(days);

  var holidays = getHolidays(date.getFullYear());

  while(count > 0) {
    date.setDate(date.getDate() + delta);
    var wDay = date.getDay();
    var dateTime = date.getTime();

    var notWorkDay = wDay === 0 || wDay === 6 || holidays.some(function(day) {
      return day.date.getTime() === dateTime && (!includeHalfDays || !day.halfDay);
    });
    if (notWorkDay) {
      continue;
    }
    count -= 1;
  }

  return date;
}
