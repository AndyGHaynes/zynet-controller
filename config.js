const { LEDColor, PIDParams } = require('./src/constants');

module.exports = {
  leds: [
    { color: LEDColor.RED, pIndex: 31 },
    { color: LEDColor.YELLOW, pIndex: 33 },
    { color: LEDColor.GREEN, pIndex: 35 },
    { color: LEDColor.BLUE, pIndex: 37 },
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
