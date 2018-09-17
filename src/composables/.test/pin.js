const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { GPIOType, LogLevel, PinState } = require('../../constants');
const Pin = require('../pin');

chai.use(chaiAsPromised);
const { assert } = chai;

const mockGPIOMethod = (rejects) =>
  rejects
    ? sinon.stub().rejects()
    : sinon.stub().resolves();

const P_INDEX = 10;
const SilentPin = Pin.props({ logLevel: LogLevel.SILENT });
const mockPin = (rejects) => SilentPin.props({
  gpio: {
    openAsync: mockGPIOMethod(rejects),
    closeAsync: mockGPIOMethod(rejects),
    readAsync: mockGPIOMethod(rejects),
    writeAsync: mockGPIOMethod(rejects),
  },
  highValue: PinState.HIGH,
  lowValue: PinState.LOW,
  input: GPIOType.INPUT,
  output: GPIOType.OUTPUT,
});
const getMockPin = (props) => mockPin(false)(props); 
const getBrokePin = (props) => mockPin(true)(props); 

describe('Pin', () => {
  describe('initialization', () => {
    it(`is created in state ${PinState.INITIALIZED}`, () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      assert.equal(pin.state, PinState.INITIALIZED, `pin state is ${PinState.INITIALIZED}`);
    });

    it('is created with its pin number set', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      assert.equal(pin.pIndex, P_INDEX, 'pin set to passed in value');
    });

    it('throws when created without a pin number', () => {
      assert.throws(() => Pin());
    });
  });

  describe('open', () => {
    it('opens the GPIO address', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return Promise.using(pin.open(), () =>
        assert(pin.gpio.openAsync.calledOnce, 'calls GPIO open once')
      );
    });

    it(`is in the state ${PinState.INITIALIZED} after opening`, () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return Promise.using(pin.open(), () => {
        assert.equal(pin.state, PinState.INITIALIZED, `pin state set to ${PinState.INITIALIZED}`);
      });
    });

    it('rejects when a GPIO exception is thrown', () => {
      const pin = getBrokePin({ pIndex: P_INDEX });
      assert.isRejected(Promise.using(pin.open(), () => {}));
    });
  });

  describe('close', () => {
    it('closes the GPIO address', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return pin.close()
        .then(() => assert(pin.gpio.closeAsync.calledOnce, 'calls GPIO close once'));
    });

    it('rejects when a GPIO exception is thrown', () => {
      const pin = getBrokePin({ pIndex: P_INDEX });
      assert.isRejected(pin.close());
    });
  });

  describe('write', () => {
    it('rejects when an invalid value is provided', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      assert.isRejected(pin.write('NONCE'));
    });

    it('opens the pin before writing and closes it after returning', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      sinon.spy(pin, 'open');
      sinon.spy(pin, 'close');
      return pin.write(pin.highValue)
        .then(() => {
          assert(pin.open.calledBefore(pin.gpio.writeAsync), 'calls GPIO open before writing');
          assert(pin.close.calledAfter(pin.gpio.writeAsync), 'calls GPIO close after writing');
        });
    });

    it('rejects when a GPIO exception is thrown', () => {
      const pin = getBrokePin({ pIndex: P_INDEX });
      assert.isRejected(pin.write(pin.highValue));
    });
  });

  describe('high', () => {
    it('writes to GPIO with its high value', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return pin.high()
        .then(() => {
          assert(pin.gpio.writeAsync.calledWith(P_INDEX, pin.highValue), 'calls GPIO write with high value');
        });
    });
  });

  describe('low', () => {
    it('writes to GPIO with its low value', () => {
      const pin = getMockPin({ pIndex: P_INDEX });
      return pin.low()
        .then(() => {
          assert(pin.gpio.writeAsync.calledWith(P_INDEX, pin.lowValue), 'calls GPIO write with low value');
        });
    });
  });
});
