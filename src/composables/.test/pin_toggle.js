const { assert } = require('chai');
const sinon = require('sinon');

const PinToggle = require('../pin_toggle');

const MockPinToggle = PinToggle.props({
  pin: {
    high: sinon.spy(),
    low: sinon.spy(),
  },
});

describe('PinToggle', () => {
  describe('on', () => {
    it('writes high to the pin', () => {
      const pinToggle = MockPinToggle();
      pinToggle.on();
      assert(pinToggle.pin.high.called);
    });
  });

  describe('off', () => {
    it('writes low to the pin', () => {
      const pinToggle = MockPinToggle();
      pinToggle.off();
      assert(pinToggle.pin.low.called);
    });
  });
});
