const _ = require('lodash');

const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const { RPIOPin } = require('./src/gpio');

const { leds, logLevel, pid, relays, schedule, thermometer } = ControllerConfig;

const pi = Controller.props({
  Pin: RPIOPin,
  logLevel,
})({ leds, pid, relays, schedule, thermometer });
pi.leds.success();
pi.start();
