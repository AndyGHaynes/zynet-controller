const _ = require('lodash');

const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const Pin = require('./src/gpio/pin');
const RPIO = require('./src/gpio/rpio');

const { leds, logLevel, pid, relays, schedule, thermometer } = ControllerConfig;

const pi = Controller.props({
  Pin: Pin.props({ GPIO: RPIO }),
  logLevel,
})({ leds, pid, relays, schedule, thermometer });
pi.leds.success();
pi.start();
