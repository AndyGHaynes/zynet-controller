const { mockPinController } = require('../mocks');
const { expect } = require('../utils');

const P_INDEX = 10;

describe('PinController', () => {
  describe('disposeAll', () => {
    it('closes and removes all pins after executing', () => {
      const pinController = mockPinController(false)();
      pinController.registerPin(P_INDEX);
      return pinController.disposeAll()
        .then(() => expect(pinController.pins).empty);
    });

    it('logs and swallows any errors', () => {
      const pinController = mockPinController(false)();
      pinController.registerPin(P_INDEX);
      return expect(pinController.disposeAll()).fulfilled;
    });
  });

  describe('registerPin', () => {
    it('adds pin to the registry', () => {
      const pinController = mockPinController(false)();
      const pin = pinController.registerPin(P_INDEX);
      expect(pinController.pins).include(pin);
    });
  });
});
