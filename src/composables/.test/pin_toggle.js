const chai = require('chai');
const sinon = require('sinon');

const PinToggle = require('../pin_toggle');

const { expect } = chai;

const MockPinToggle = PinToggle.props({
  pin: {
    high: sinon.spy(),
    low: sinon.spy(),
  },
});

describe('PinToggle', () => {
  describe('on', () => {
    it(`should write high to the pin`, () => {
      const pinToggle = MockPinToggle();
      pinToggle.on();
      expect(pinToggle.pin.high.called).to.be.true;
    });
  });

  describe('off', () => {
    it(`should write low to the pin`, () => {
      const pinToggle = MockPinToggle();
      pinToggle.off();
      expect(pinToggle.pin.low.called).to.be.true;
    });
  });
});
