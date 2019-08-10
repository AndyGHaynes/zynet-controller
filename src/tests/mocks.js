const sinon = require('sinon');

const { LogLevel } = require('../constants');
const PinController = require('../controller/pin_controller');
const GPIO = require('../gpio/gpio');
const Pin = require('../gpio/pin');

const mockGPIOMethod = (rejects) =>
  rejects
    ? sinon.stub().rejects()
    : sinon.stub().resolves();

const mockGPIO = (rejects) => GPIO.methods({
  open: mockGPIOMethod(rejects),
  close: mockGPIOMethod(rejects),
  write: mockGPIOMethod(rejects),
  high: mockGPIOMethod(rejects),
  low: mockGPIOMethod(rejects),
});

const mockPin = (rejects) => Pin.props({
  GPIO: mockGPIO(rejects),
  logLevel: LogLevel.SILENT,
});

const mockPinController = (rejects) => PinController
  .conf({
    GPIO: mockGPIO(rejects),
  })
  .props({
    logLevel: LogLevel.SILENT,
  });

module.exports = {
  mockPin,
  mockPinController,
};
