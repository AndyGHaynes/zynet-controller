const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const { LogLevel } = require('./src/constants');

const { leds, pid, relays } = ControllerConfig;

const pi = Controller.props({
  logLevel: LogLevel.DEBUG,
})({ leds, pid, relays });
pi.leds.success();
pi.setTargetTemperature(152);
pi.shutdown();
