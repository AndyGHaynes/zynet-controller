const { assert } = require('chai');
const sinon = require('sinon');

const { LogLevel } = require('../../constants');
const Pin = require('../../composables/pin');
const PinController = require('../pin_controller');

sinon.usingPromise(Promise);

const P_INDEX = 10;

describe('PinController', () => {
  const SilentPinController = PinController.props({
    logLevel: LogLevel.SILENT
  });
  let MockPinController;
  let BrokePinController;
  beforeEach(() => {
    MockPinController = SilentPinController.props({
      Pin: Pin.methods({
        open: sinon.stub().resolves(),
        close: sinon.stub().resolves(),
        write: sinon.stub().resolves(),
      }),
    });
    BrokePinController = SilentPinController.props({
      Pin: Pin.methods({
        open: sinon.stub().rejects(),
        close: sinon.stub().rejects(),
        write: sinon.stub().rejects(),
      }),
    });
  });

  describe('disposeAll', () => {
    it('closes and removes all pins after executing', () => {
      const pinController = MockPinController();
      pinController.registerPin(P_INDEX);
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
      pinController.registerPin(P_INDEX);
      assert.doesNotThrow(() => pinController.disposeAll(), 'does not throw when close fails');
    });
  });

  describe('disposePin', () => {
    it('removes pin from registry', () => {
      const pinController = MockPinController();
      const pin = pinController.registerPin(P_INDEX);
      pinController.disposePin(pin);
      assert.notInclude(pinController.pins, pin, 'pin is no longer included in the set of pins');
    });
  });

  describe('registerPin', () => {
    it('adds pin to the registry', () => {
      const pinController = MockPinController();
      const pin = pinController.registerPin(P_INDEX);
      assert.include(pinController.pins, pin, 'pin is included in the set of pins');
    });
  });
});
