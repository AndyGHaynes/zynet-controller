const ControllerConfig = require('./config');
const Controller = require('./src/controller/controller');
const { resolveGPIO } = require('./src/gpio/configure');
const { initializeServer } = require('./src/server');

const {
  hardwareProfile,
  leds,
  logLevel,
  pid,
  relays,
  schedule,
  server,
  thermometer,
} = ControllerConfig;

const controller = Controller
  .conf({
    GPIO: resolveGPIO(hardwareProfile),
  })
  .props({
    logLevel,
  })({ leds, pid, relays, schedule, thermometer });

initializeServer(server, controller);

process.on('SIGINT', () =>
  controller.shutdown()
    .finally(() => process.exit())
);
