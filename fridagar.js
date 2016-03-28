var fetch = require('node-fetch');
var Promise = require('promise');
var cheerio = require('cheerio');
var $;

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
    return getData([1], year, month);
  },
  /**
   * Get other days (important but working days)
   * @param  {Number}   year     Year to get results for
   * @param  {Number}   month    Month to get results for
   * @return {Promise}           Promise that resolves to an object with year, month and days array
   */
  getOtherDays: function(year, month) {
    return getData([2], year, month);
  },
  /**
   * Get both holidays and other days
   * @param  {Number}   year     Year to get results for
   * @param  {Number}   month    Month to get results for
   * @return {Promise}           Promise that resolves to an object with year, month and days array
   */
  getAllDays: function(year, month) {
    return getData([1,2], year, month);
  }
};

/**
 * Gets HTTP response from URL, parses the results
 * and returns a promise.
 * @param  {Array}    type     Array with filter types
 * @param  {Number}   year     Year to get results for
 * @param  {Number}   month    Month to get results for
 */
function getData(type, year, month) {
  year = year.toString();
  month = month < 10 && month.toString().substr(0,1) !== '0' ? '0'+month : month.toString();

  var url = ['http://dagatal.is/wp-admin/admin-ajax.php?action=spiderbigcalendar_month',
            '&theme_id=6&calendar=1&select&date=', year, '-', month,
            '&many_sp_calendar=1&cur_page_url=http://dagatal.is/&cat_id&widget=0'].join('');

  // Call async HTTP fetch method and return a promise
  var promise = new Promise(function(resolve, reject) {
    fetch(url).then(function(res) {
      return res.text();
    }).then(function(body) {
      $ = cheerio.load(body.toString());
      var resultArray = [];

      if(!Array.isArray(type)) {
        reject('Invalid type');
      } else {
        // Get all DOM nodes that contain some kind of an event
        var eventNodes = $('td.cala_day');

        // Go through each filter type and call the filterType function
        // with the result array to append the results to
        for(var i = 0; i < type.length; i++) {
          if(typeof filterType[type[i]] !== 'function') {
            reject('Invalid type');
          }

          filterType[type[i]](eventNodes, resultArray);
        }
      }

      var results = {
        year: parseInt(year),
        month: parseInt(month),
        days: resultArray
      };

      resolve(results);
    });
  });

  return promise;
}

/**
 * Handles filtering logic based on filter type.
 * Each filter type is mapped to a filter function.
 * 1: Holidays
 * 2: Other days
 * @type {Object}
 */
var filterType = {
  1: function filterHolidays(nodes, resultArray) {
    var holidayNodesFn = function(i, el) {
      return $(el).find('#cal_event').css('border-left').trim() === '2px solid #FF0000';
    };

    // Call a helper function that traverses DOM nodes and gets info
    // based on a filter function for holidays
    traverseNodesInfo(nodes, holidayNodesFn, resultArray, true);
  },
  2: function filterOtherDays(nodes, resultArray) {
    var otherDayNodesFn = function(i, el) {
      return $(el).find('#cal_event').css('border-left').trim() === '2px solid #363636';
    };

    // Call a helper function that traverses DOM nodes and gets info
    // based on a filter function for other days
    traverseNodesInfo(nodes, otherDayNodesFn, resultArray, false);
  }
};

/**
 * Helper function to traverse DOM nodes and get info
 * (day number and description) from each of them.
 * @param  {Array}    nodes       DOM node array
 * @param  {Function} filterFn    Function to use for filtering nodes
 * @param  {Array}    resultArray Result array, with new nodes info
 * @param  {Boolean}  isHoliday   Whether the days are holidays or not
 */
function traverseNodesInfo(nodes, filterFn, resultArray, isHoliday) {
  nodes.filter(filterFn).each(function() {
    var node = $(this);
    var day = node.children('p').text();
    var description = node.find('#cal_event').children('p').next().text();

    resultArray.push({
      day: parseInt(day),
      description: description.trim(),
      holiday: isHoliday
    });
  });
}
