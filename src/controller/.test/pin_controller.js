const { assert } = require('chai');
const sinon = require('sinon');

const Pin = require('../../composables/pin');
const PinController = require('../pin_controller');

const PIN_NUMBER = 10;

const SilentPinController = PinController.props({ test: true });

describe('PinController', () => {
  let MockPinController;
  let BrokePinController;
  beforeEach(() => {
    MockPinController = SilentPinController.props({
      Pin: Pin.methods({
        open: sinon.stub(),
        close: sinon.stub(),
      }),
    });
    BrokePinController = SilentPinController.props({
      Pin: Pin.methods({
        open: sinon.stub().throws(),
        close: sinon.stub().throws(),
      }),
    });
  });

  describe('disposeAll', () => {
    it('closes and removes all pins after executing', () => {
      const pinController = MockPinController();
      pinController.registerPin(PIN_NUMBER);
      pinController.disposeAll();
      assert.isEmpty(pinController.pins, 'set of pins is empty');
    });

    it('logs and swallows any errors', () => {
      const pinController = MockPinController.props({
        Pin: Pin.methods({
          open: sinon.stub(),
          close: sinon.stub().throws(),
        }),
      })();
      sinon.spy(pinController, 'logError');
      pinController.registerPin(PIN_NUMBER);
      assert.doesNotThrow(() => pinController.disposeAll(), 'does not throw when close fails');
      assert(pinController.logError.calledOnce, 'logs error when close fails');
    });
  });

  describe('disposePin', () => {
    it('closes and removes pin', () => {
      const pinController = MockPinController();
      const pin = pinController.registerPin(PIN_NUMBER);
      pinController.disposePin(pin);
      assert(pin.close.calledOnce, 'pin.close() is called once');
      assert.notInclude(pinController.pins, pin, 'pin is no longer included in the set of pins');
    });
  });

  describe('registerPin', () => {
    it('opens the pin and adds it to the set of pins', () => {
      const pinController = MockPinController();
      const pin = pinController.registerPin(PIN_NUMBER);
      assert(pin.open.calledOnce, 'pin.open() is called once');
      assert.include(pinController.pins, pin, 'pin is included in the set of pins');
    });
  });
});
