const _ = require('lodash');

const Controller = require('./composables/controller');
const { LEDColor, PIDParams } = require('./constants');

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

const pidConfig = {
  [PIDParams.PROPORTIONAL_GAIN]: 1.5,
  [PIDParams.INTEGRAL_GAIN]: 1,
  [PIDParams.DERIVATIVE_GAIN]: 0.5,
  [PIDParams.MAX_INTEGRAL]: 3,
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
pi.initializeTemperatureController(pidConfig, schedule.mashTemperature);
pi.shutdown();
