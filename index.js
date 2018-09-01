const Controller = require('./composables/controller');
const { LEDColor } = require('./constants');

const pi = Controller.props({
  debug: true,
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
