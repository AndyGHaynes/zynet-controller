const PinToggle = require('../../src/composables/pin_toggle');
const { assert, sinon } = require('../utils');

const MockPinToggle = PinToggle.props({
  pin: {
    high: sinon.stub().resolves(),
    low: sinon.stub().resolves(),
  },
});

describe('PinToggle', () => {
  describe('on', () => {
    it('writes high to the pin', () => {
      const pinToggle = MockPinToggle();
      pinToggle.on();
      assert(pinToggle.pin.high.called, 'calls pin.high()');
    });
  });

  describe('off', () => {
    it('writes low to the pin', () => {
      const pinToggle = MockPinToggle();
      pinToggle.off();
      assert(pinToggle.pin.low.called, 'calls pin.low()');
    });
  });
});
