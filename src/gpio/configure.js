const { HardwareProfile } = require('../constants');
const GPIO = require('./gpio');

const resolveGPIO = (hardwareProfile) => ({
  [HardwareProfile.CHIP]: () => require('./plugins/chip_gpio'),
  [HardwareProfile.DEBUG]: () => GPIO,
  [HardwareProfile.PI]: () => require('./plugins/rpio'),
})[hardwareProfile]();

module.exports = {
  resolveGPIO,
};
