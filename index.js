const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const { resolveGPIO } = require('./src/gpio/configure');

const { hardwareProfile, leds, logLevel, pid, relays, schedule, thermometer } = ControllerConfig;

const pi = Controller
  .conf({
    gpio: resolveGPIO(hardwareProfile),
  })
  .props({
    logLevel,
  })({ leds, pid, relays, schedule, thermometer });

pi.leds.success();
pi.start();
