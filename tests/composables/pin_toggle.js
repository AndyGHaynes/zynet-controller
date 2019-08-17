const PinToggle = require('../../src/composables/pin_toggle');
const { expect, sinon } = require('../utils');

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
      expect(pinToggle.pin.high.called);
    });
  });

  describe('off', () => {
    it('writes low to the pin', () => {
      const pinToggle = MockPinToggle();
      pinToggle.off();
      expect(pinToggle.pin.low.called);
    });
  });
});
