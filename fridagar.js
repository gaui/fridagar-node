var CalculateHolidays = require('./CalculateHolidays');

/**
 * Module exports
 * @type {Object}
 */
module.exports = {
  /**
   * Get holidays (non-working days)
   * @param  {Number}   year     Year to get results for
   * @param  {Number}   month    Month to get results for
   * @return {Promise}           Promise that resolves to an object with year, month and days array
   */
  getHolidays: function(year, month) {
    var holidays = CalculateHolidays.holidays(year).filter(function(day){
      return day.holiday == true;
    });
    if (month !== undefined) {
      holidays = holidays.filter(function(day){
        return day.date.getMonth() == month-1;
      });
    }
    return holidays;
  },
  /**
   * Get other days (important but working days)
   * @param  {Number}   year     Year to get results for
   * @param  {Number}   month    Month to get results for
   * @return {Promise}           Promise that resolves to an object with year, month and days array
   */
  getOtherDays: function(year, month) {
    var otherDays = CalculateHolidays.holidays(year).filter(function(day){
      return day.holiday == false;
    });
    if (month !== undefined) {
      otherDays = otherDays.filter(function(day){
        return day.date.getMonth() == month-1;
      });
    }
    return otherDays;
  },
  /**
   * Get both holidays and other days
   * @param  {Number}   year     Year to get results for
   * @param  {Number}   month    Month to get results for
   * @return {Promise}           Promise that resolves to an object with year, month and days array
   */
  getAllDays: function(year, month) {
    var days = CalculateHolidays.holidays(year);

    if (month !== undefined) {
      days = days.filter(function(day){
        return day.date.getMonth() == month-1;
      });
    }
    return days;
  }
};
