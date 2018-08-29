const rpio = require('rpio');

const Controller = require('./composables/controller');
const { LEDColor } = require('./constants');

const pi = Controller.props({
  gpio: rpio,
  gpioHigh: rpio.HIGH,
  gpioLow: rpio.LOW,
})();
pi.registerLEDs([
  { color: LEDColor.RED, pin: 10 },
  { color: LEDColor.YELLOW, pin: 11 },
  { color: LEDColor.GREEN, pin: 12 },
  { color: LEDColor.BLUE, pin: 13 },
]);
pi.toggleLEDs();
pi.toggleLEDs();
pi.shutdown();
