const { DateTime } = require('luxon');
const { zones } = require('tzdata');

(() => {
  const luxonValidTimezones = Object.entries(zones)
    .filter(([zoneName, v]) => Array.isArray(v))
    .map(([zoneName, v]) => zoneName)
    .filter(tz => DateTime.local().setZone(tz).isValid);

  luxonValidTimezones.sort();
  console.log('luxonValidTimezones', luxonValidTimezones);

  const tzs = luxonValidTimezones.map(tz => ({
    value: tz,
    label: tz,
  }));
  console.log('tzs', JSON.stringify(tzs));
})();
