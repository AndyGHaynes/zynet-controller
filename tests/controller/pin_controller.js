const { mockPinController } = require('../mocks');
const { assert } = require('../utils');

const P_INDEX = 10;

describe('PinController', () => {
  describe('disposeAll', () => {
    it('closes and removes all pins after executing', () => {
      const pinController = mockPinController(false)();
      pinController.registerPin(P_INDEX);
      return pinController.disposeAll()
        .then(() => assert.isEmpty(pinController.pins, 'set of pins is empty'));
    });

    it('logs and swallows any errors', () => {
      const pinController = mockPinController(false)();
      pinController.registerPin(P_INDEX);
      assert.isFulfilled(pinController.disposeAll(), 'does not throw when close fails');
    });
  });

  describe('registerPin', () => {
    it('adds pin to the registry', () => {
      const pinController = mockPinController(false)();
      const pin = pinController.registerPin(P_INDEX);
      assert.include(pinController.pins, pin, 'pin is included in the set of pins');
    });
  });
});
