# Frídagar

Node module that scrapes Icelandic holidays from [dagatal.is](http://dagatal.is)

## Usage

```javascript
var fridagar = require('./fridagar');

// Get holidays and other important days for June 2016
fridagar.getAllDays(2016, 6).then(function(data) {
  // Use data
}, function(err) {
  throw new Error(err);
});

// Get only holidays for June 2016
fridagar.getHolidays(2016, 6).then(function(data) {
  // Use data
}, function(err) {
    throw new Error(err);
});

// Get only other important days for June 2016
fridagar.getOtherDays(2016, 6).then(function(data) {
  // Use data
}, function(err) {
    throw new Error(err);
});
```

## Sample output

```javascript
{
  "year": 2016,
  "month": 6,
  "days": [
    {
      "day": 5,
      "description": "Sjómannadagurinn",
      "holiday": true
    },
    {
      "day": 17,
      "description": "Lýðveldisdagurinn",
      "holiday": true
    },
    {
      "day": 20,
      "description": "Sumarsólstöður",
      "holiday": false
    },
    {
      "day": 24,
      "description": "Jónsmessa",
      "holiday": false
    }
  ]
}
```
