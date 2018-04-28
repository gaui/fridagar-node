# Frídagar

Node module that returns Icelandic holidays and other special days

## Installation

```
npm install fridagar
```

## Usage

```javascript
// Use 'fridagar' if you installed via NPM
var fridagar = require('./fridagar');

// Get holidays and other important days for June 2016
var allDays = fridagar.getAllDays(2016, 6);

// Get only holidays for June 2016
var holidays = fridagar.getHolidays(2016, 6);

// Get only other important days for June 2016
var otherDays = fridagar.getOtherDays(2016, 6);
```

## Sample output

```javascript
[
  {
    "date": "2016-06-17T00:00:00.000Z",
    "description": "Þjóðhátíðardagur Íslendinga",
    "holiday": true
  },
  {
    "date": "2016-06-20T22:34:00.000Z",
    "description": "Sumarsólstöður",
    "holiday": false
  },
  {
    "date": "2016-06-24T00:00:00.000Z",
    "description": "Jónsmessa",
    "holiday": false
  }
]
```

## Changelog

### 3.1.0 (upcoming)

- Add "Hrekkjavaka"
- Demote "Þorláksmessa" to notable day status
- Add flagging of "half-day" holidays
- Use current day/year as default for all methods
- Improve performance
- Minor bugfixes

### 3.0.0

- Calculate holidays instead of scraping them.
- Removed promises (breaking changes).

### 2.0.0

- Use promises instead of callbacks.

### 1.0.0

- Initial release.
