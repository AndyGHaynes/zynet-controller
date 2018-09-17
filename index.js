const _ = require('lodash');

const Controller = require('./src/controller/controller');
const { LEDColor, LogLevel, PIDParams } = require('./src/constants');

const controllerConfig = {
  leds: [
    { color: LEDColor.RED, pIndex: 10 },
    { color: LEDColor.YELLOW, pIndex: 11 },
    { color: LEDColor.GREEN, pIndex: 12 },
    { color: LEDColor.BLUE, pIndex: 13 },
  ],
  relays: [
    { pIndex: 7 },
    { pIndex: 8 },
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
  config: controllerConfig,
  logLevel: LogLevel.DEBUG,
})();
pi.leds.success();
pi.initializeTemperatureController(pidConfig, schedule.mashTemperature);
pi.shutdown();
