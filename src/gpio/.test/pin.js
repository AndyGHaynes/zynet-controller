const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { LogLevel, PinState } = require('../../constants/index');
const Pin = require('../pin');
const RPIO = require('../rpio');

sinon.usingPromise(Promise);

chai.use(chaiAsPromised);
const { assert } = chai;

const mockGPIOMethod = (rejects) =>
  rejects
    ? sinon.stub().rejects()
    : sinon.stub().resolves();

const P_INDEX = 10;
const SilentPin = Pin.props({ logLevel: LogLevel.SILENT });
const mockPin = (rejects) => SilentPin.props({
  GPIO: RPIO.methods({
    open: mockGPIOMethod(rejects),
    close: mockGPIOMethod(rejects),
    write: mockGPIOMethod(rejects),
    high: mockGPIOMethod(rejects),
    low: mockGPIOMethod(rejects),
  }),
});
const getMockPin = (props) => mockPin(false)(props); 
// const getBrokePin = (props) => mockPin(true)(props);

describe('Pin', () => {
  describe('initialization', () => {
    it(`is created in state ${PinState.INITIALIZED}`, () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      assert.equal(pin.state, PinState.INITIALIZED, `pin state is ${PinState.INITIALIZED}`);
    });

    it('is created with its pin index set', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      assert.equal(pin.gpio.pIndex, P_INDEX, 'pin set to passed in value');
    });

    it('throws when created without a pin number', () => {
      assert.throws(() => Pin());
    });
  });

  describe('high', () => {
    it('writes to GPIO with its high value', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return pin.high()
        .then(() => {
          assert(pin.gpio.high.calledOnce, 'calls GPIO write with high value');
        });
    });
  });

  describe('low', () => {
    it('writes to GPIO with its low value', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return pin.low()
        .then(() =>
          assert(pin.gpio.low.calledOnce, 'calls GPIO write with low value')
        );
    });
  });
});
