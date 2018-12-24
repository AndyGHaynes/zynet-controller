const _ = require('lodash');

const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const { LogLevel } = require('./src/constants');
const Pin = require('./src/gpio/pin');
const RPIO = require('./src/gpio/rpio');

const { leds, pid, relays, schedule, thermometer } = ControllerConfig;

const pi = Controller.props({
  logLevel: LogLevel.DEBUG,
  Pin: Pin.props({ GPIO: RPIO }),
})({ leds, pid, relays, schedule, thermometer });
pi.leds.success();
pi.start();
