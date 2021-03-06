const { HardwareProfile, LEDColor, LogLevel, PIDParams, RelayType } = require('./src/constants');

module.exports = {
  hardwareProfile: HardwareProfile.PI,
  leds: [
    { color: LEDColor.RED, pIndex: 31 },
    { color: LEDColor.YELLOW, pIndex: 33 },
    { color: LEDColor.GREEN, pIndex: 35 },
    { color: LEDColor.BLUE, pIndex: 37 },
  ],
  logLevel: LogLevel.DEBUG,
  pid: {
    [PIDParams.PROPORTIONAL_GAIN]: 1.5,
    [PIDParams.INTEGRAL_GAIN]: 1,
    [PIDParams.DERIVATIVE_GAIN]: 0.5,
    [PIDParams.MAX_INTEGRAL]: 3,
  },
  relays: [
    { pIndex: 7, type: RelayType.NORMALLY_CLOSED },
    { pIndex: 8, type: RelayType.NORMALLY_CLOSED },
  ],
  schedule: {
    targetTemperature: 30,
  },
  server: {
    port: 3000,
  },
  thermometer: {
    readIntervalMS: 850,
  },
};
