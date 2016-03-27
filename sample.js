var fridagar = require('./fridagar');

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth()+1;

// Get holidays and other important days for current month
fridagar.getAllDays(year, month, function(data) {
  console.log(data);
});

// Get only holidays for current month
fridagar.getHolidays(year, month, function(data) {
  console.log(data);
});

// Get only other important days for current month
fridagar.getOtherDays(year, month, function(data) {
  console.log(data);
});
