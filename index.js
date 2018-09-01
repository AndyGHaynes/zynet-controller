const _ = require('lodash');

const Controller = require('./composables/controller');
const { LEDColor } = require('./constants');

const leds = [
  { color: LEDColor.RED, pin: 10 },
  { color: LEDColor.YELLOW, pin: 11 },
  { color: LEDColor.GREEN, pin: 12 },
  { color: LEDColor.BLUE, pin: 13 },
];
const relays = [
  { pin: 7 },
  { pin: 8 },
];

const pi = Controller.props({
  debug: true,
})();
_.each(leds, (led) => pi.registerLED(led));
_.each(relays, (relay) => pi.registerRelay(relay));
pi.toggleLEDs();
pi.toggleLEDs();
pi.shutdown();
