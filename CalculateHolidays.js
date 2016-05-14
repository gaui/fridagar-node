exports.easter = easter;
function easter(year) {
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  var easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, easterMonth-1, easterDay);
}

function bondadagur(year) {
  var date = new Date(year, 0, 19);
  while (date.getDay() !== 5) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function sumardagurinnFyrsti(year) {
  var date = new Date(year, 3, 19);
  while (date.getDay() !== 4) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function fridagurVerslunarmanna(year) {
  var date = new Date(year, 7, 1);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function solstice(year, season) {
  var interval = 1000 * (56.5 + 47 * 60 + 5 * 3600 + 365 * 86400);

  if (season == 'summer'){
    var date = new Date(2016, 5, 20, 22, 34);
  } else if (season == 'winter'){
    var date = new Date(2016, 11, 21, 10, 44);
  }

  while (date.getFullYear() < year) {
    date.setTime(date.getTime() + interval);
  }
  while (date.getFullYear() > year) {
    date.setTime(date.getTime() - interval);
  }
  return date;
}

exports.holidays = holidays;
function holidays(year) {
  var easterSunday = easter(year);
  var day = 86400000;
  var holidays = [
    {
      date: new Date(year, 0, 1),
      description: 'Nýjársdagur',
      holiday: true
    },
    {
      date: bondadagur(year),
      description: 'Bóndadagur',
      holiday: false
    },
    {
      date: new Date(easterSunday.getTime() - (48 * day)),
      description: 'Bolludagur',
      holiday: false
    },
    {
      date: new Date(easterSunday.getTime() - (47 * day)),
      description: 'Sprengidagur',
      holiday: false
    },
    {
      date: new Date(easterSunday.getTime() - (46 * day)),
      description: 'Öskudagur',
      holiday: false
    },
    {
      date: new Date(year, 1, 14),
      description: 'Valentínusardagur',
      holiday: false
    },
    {
      date: new Date(bondadagur(year).getTime() + (30 * day)),
      description: 'Konudagur',
      holiday: false
    },
    {
      date: new Date(easterSunday.getTime() - (3 * day)),
      description: 'Skírdagur',
      holiday: true
    },
    {
      date: new Date(easterSunday.getTime() - (2 * day)),
      description: 'Föstudagurinn langi',
      holiday: true
    },
    {
      date: easterSunday,
      description: 'Páskadagur',
      holiday: true
    },
    {
      date: new Date(easterSunday.getTime() + day),
      description: 'Annar í páskum',
      holiday: true
    },
    {
      date: sumardagurinnFyrsti(year),
      description: 'Sumardagurinn fyrsti',
      holiday: true
    },
    {
      date: new Date(easterSunday.getTime() + (39 * day)),
      description: 'Uppstigningardagur',
      holiday: true
    },
    {
      date: new Date(easterSunday.getTime() + (49 * day)),
      description: 'Hvítasunnudagur',
      holiday: true
    },
    {
      date: new Date(easterSunday.getTime() + (50 * day)),
      description: 'Annar í hvítasunnu',
      holiday: true
    },
    {
      date: new Date(year, 4, 1),
      description: 'Verkalíðsdagurinn',
      holiday: true
    },
    {
      date: new Date(year, 5, 17),
      description: 'Þjóðhátíðardagur Íslendinga',
      holiday: true
    },
    {
      date: solstice(year, 'summer'),
      description: 'Sumar sólstöður',
      holiday: false
    },
    {
      date: new Date(year, 5, 24),
      description: 'Jónsmessa',
      holiday: false
    },
    {
      date: fridagurVerslunarmanna(year),
      description: 'Frídagur verslunarmanna',
      holiday: true
    },
    {
      date: new Date(year, 11, 1),
      description: 'Fullveldisdagurinn',
      holiday: false
    },
    {
      date: solstice(year, 'winter'),
      description: 'Vetrar sólstöður',
      holiday: false
    },
    {
      date: new Date(year, 11, 23),
      description: 'Þorláksmessa',
      holiday: true
    },
    {
      date: new Date(year, 11, 24),
      description: 'Aðfangadagur',
      holiday: true
    },
    {
      date: new Date(year, 11, 25),
      description: 'Jóladagur',
      holiday: true
    },
    {
      date: new Date(year, 11, 26),
      description: 'Annar í jólum',
      holiday: true
    },
    {
      date: new Date(year, 11, 31),
      description: 'Gamlársdagur',
      holiday: true
    },
  ];

  return holidays;
}
