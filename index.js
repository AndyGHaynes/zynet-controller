const _ = require('lodash');

const Controller = require('./composables/controller');
const { LEDColor } = require('./constants');

const controller = {
  leds: [
    { color: LEDColor.RED, pin: 10 },
    { color: LEDColor.YELLOW, pin: 11 },
    { color: LEDColor.GREEN, pin: 12 },
    { color: LEDColor.BLUE, pin: 13 },
  ],
  relays: [
    { pin: 7 },
    { pin: 8 },
  ],
};

const pidSettings = {
  k_p: 1.5,
  k_i: 1,
  k_d: 0.5,
  i_max: 3,
};

const schedule = {
  mashTemperature: 152,
};

const pi = Controller.props({
  debug: true,
})();
_.each(controller.leds, (led) => pi.registerLED(led));
_.each(controller.relays, (relay) => pi.registerRelay(relay));
pi.toggleLEDs();
pi.toggleLEDs();
pi.initializeThermometer();
pi.initializePID(pidSettings);
pi.setPIDTarget(schedule.mashTemperature);
pi.updateTemperature();
pi.shutdown();
