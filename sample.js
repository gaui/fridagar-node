// Use 'fridagar' if you installed via NPM
var fridagar = require('./fridagar');

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth()+1;

// Get holidays and other important days for current month
var allDays = fridagar.getAllDays(year, month);
console.log('All days:', allDays);

// Get only holidays for current month
var holidays = fridagar.getHolidays(year, month);
console.log('Holidays:', holidays);

// Get only other important days for current month
var otherDays = fridagar.getOtherDays(year, month);
console.log('Other days:', otherDays);
