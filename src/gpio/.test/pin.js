const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { PinState } = require('../../constants');
const { mockPin } = require('../../tests/mocks');
const Pin = require('../pin');

sinon.usingPromise(Promise);

chai.use(chaiAsPromised);
const { assert } = chai;

const P_INDEX = 10;

describe('Pin', () => {
  describe('initialization', () => {
    it(`is created in state ${PinState.INITIALIZED}`, () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      assert.equal(pin.state, PinState.INITIALIZED, `pin state is ${PinState.INITIALIZED}`);
    });

    it('is created with its pin index set', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      assert.equal(pin.gpio.pIndex, P_INDEX, 'pin set to passed in value');
    });

    it('throws when created without a pin number', () => {
      assert.throws(() => Pin());
    });
  });

  describe('high', () => {
    it('writes to GPIO with its high value', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      return pin.high()
        .then(() => {
          assert(pin.gpio.high.calledOnce, 'calls GPIO write with high value');
        });
    });
  });

  describe('low', () => {
    it('writes to GPIO with its low value', () => {
      const pin = mockPin(false)({ pIndex: P_INDEX });
      return pin.low()
        .then(() =>
          assert(pin.gpio.low.calledOnce, 'calls GPIO write with low value')
        );
    });
  });
});
