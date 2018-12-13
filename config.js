const { LEDColor, PIDParams } = require('./src/constants');

module.exports = {
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
  schedule: {
    targetTemperature: 30,
  },
  pid: {
    [PIDParams.PROPORTIONAL_GAIN]: 1.5,
    [PIDParams.INTEGRAL_GAIN]: 1,
    [PIDParams.DERIVATIVE_GAIN]: 0.5,
    [PIDParams.MAX_INTEGRAL]: 3,
  },
  thermometer: {
    readIntervalMS: 850,
  },
};
