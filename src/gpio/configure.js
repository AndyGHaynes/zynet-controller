const GPIO = require('./gpio');

const resolveGPIO = (hardwareProfile) => ({
  [HardwareProfile.CHIP]: () => require('./chip_gpio'),
  [HardwareProfile.DEBUG]: () => GPIO,
  [HardwareProfile.PI]: () => require('./rpio'),
})[hardwareProfile]();

module.exports = {
  resolveGPIO,
};
