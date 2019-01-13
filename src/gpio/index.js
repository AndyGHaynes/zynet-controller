const ChipGPIO = require('./chip_gpio');
const Pin = require('./pin');
const RPIO = require('./rpio');

module.exports = {
  ChipPin: Pin.props({ GPIO: ChipGPIO }),
  RPIOPin: Pin.props({ GPIO: RPIO }),
};
