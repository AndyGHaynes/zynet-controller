const { assert } = require('chai');
const sinon = require('sinon');

const { GPIOType, PinState } = require('../../constants/index');
const Pin = require('../pin');

const PIN_NUMBER = 10;
const SilentPin = Pin.props({ test: true });
const MockPin = SilentPin.props({
  gpio: {
    open: sinon.spy(),
    close: sinon.spy(),
    read: sinon.spy(),
    write: sinon.spy(),
  },
  highValue: PinState.HIGH,
  lowValue: PinState.LOW,
  input: GPIOType.INPUT,
  output: GPIOType.OUTPUT,
});
const BrokePin = SilentPin.props({
  gpio: {
    open: sinon.stub().throws(),
    close: sinon.stub().throws(),
    read: sinon.stub().throws(),
    write: sinon.stub().throws(),
  },
  highValue: PinState.HIGH,
  lowValue: PinState.LOW,
  input: GPIOType.INPUT,
  output: GPIOType.OUTPUT,
});

describe('Pin', () => {
  describe('initialization', () => {
    it(`is created in state ${PinState.INITIALIZED}`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      assert.equal(pin.state, PinState.INITIALIZED);
    });

    it('is created with its pin number set', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      assert.equal(pin.pin, PIN_NUMBER);
    });

    it('throws when created without a pin number', () => {
      assert.throws(() => Pin());
    });
  });

  describe('open', () => {
    it('opens the GPIO address', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      assert(pin.gpio.open.calledOnce);
    });

    it(`is opened in state ${PinState.LOW}`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      assert.equal(pin.state, PinState.LOW);
    });

    it('throws when a GPIO exception is thrown', () => {
      const pin = BrokePin({ pin: PIN_NUMBER });
      assert.throws(() => pin.open());
    });
  });

  describe('close', () => {
    it('closes the GPIO address', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.close();
      assert(pin.gpio.close.calledOnce);
    });

    it(`is in state ${PinState.CLOSED} after closing`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.close();
      assert.equal(pin.state, PinState.CLOSED);
    });

    it('throws when a GPIO exception is thrown', () => {
      const pin = BrokePin({ pin: PIN_NUMBER });
      assert.throws(() => pin.close());
    });
  });

  describe('write', () => {
    it('throws when an invalid value is provided', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      assert.throws(() => pin.write('NONCE'));
    });

    it('opens the pin before writing and closes it after returning', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      sinon.spy(pin, 'open');
      sinon.spy(pin, 'close');
      pin.write(pin.highValue);
      assert(pin.open.calledBefore(pin.gpio.write), 'calls GPIO open before writing');
      assert(pin.close.calledAfter(pin.gpio.write), 'calls GPIO close after writing');
    });

    it('throws when a GPIO exception is thrown', () => {
      const pin = BrokePin.props({
        gpio: { open: sinon.stub() }
      })({ pin: PIN_NUMBER });
      pin.open();
      assert.throws(() => pin.high());
    });
  });

  describe('high', () => {
    it('writes to GPIO with its high value', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.high();
      assert(pin.gpio.write.calledWith(PIN_NUMBER, pin.highValue));
    });
  });

  describe('low', () => {
    it('writes to GPIO with its low value', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.low();
      assert(pin.gpio.write.calledWith(PIN_NUMBER, pin.lowValue));
    });
  });
});
