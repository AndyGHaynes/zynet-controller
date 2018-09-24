const Promise = require('bluebird');
const { assert } = require('chai');
const sinon = require('sinon');

const PinToggle = require('../pin_toggle');

sinon.usingPromise(Promise);

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
