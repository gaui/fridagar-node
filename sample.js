var fridagar = require('./fridagar');

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth()+1;

// Get holidays and other important days for current month
fridagar.getAllDays(year, month).then(function(data) {
  console.log(data);
}, function(err) {
  throw new Error(err);
});

// Get only holidays for current month
fridagar.getHolidays(year, month).then(function(data) {
  console.log(data);
}, function(err) {
    throw new Error(err);
});

// Get only other important days for current month
fridagar.getOtherDays(year, month).then(function(data) {
  console.log(data);
}, function(err) {
    throw new Error(err);
});
