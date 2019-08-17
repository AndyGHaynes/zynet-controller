const { PinState } = require('../../src/constants/index');
const Pin = require('../../src/gpio/pin');
const { mockPin } = require('../mocks');
const { expect } = require('../utils');

const P_INDEX = 10;

describe('Pin', () => {
  describe('initialization', () => {
    it(`is created in state ${PinState.INITIALIZED}`, () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      expect(pin.state).equal(PinState.INITIALIZED);
    });

    it('is created with its pin index set', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      expect(pin.gpio.pIndex).equal(P_INDEX);
    });

    it('throws when created without a pin number', () => {
      expect(() => Pin()).throw();
    });
  });

  describe('high', () => {
    it('writes to GPIO with its high value', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      return pin.high()
        .then(() => expect(pin.gpio.high.calledOnce));
    });
  });

  describe('low', () => {
    it('writes to GPIO with its low value', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      return pin.low()
        .then(() => expect(pin.gpio.low.calledOnce));
    });
  });
});
