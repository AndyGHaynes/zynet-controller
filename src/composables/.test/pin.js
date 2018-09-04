const chai = require('chai');
const sinon = require('sinon');

const { GPIOType, PinState } = require('../../constants/index');
const Pin = require('../pin');

const { expect } = chai;

const PIN_NUMBER = 10;

const SilentPin = Pin.props({ error: false });
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
    it(`should be created with state ${PinState.INITIALIZED}`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      expect(pin.state).to.equal(PinState.INITIALIZED);
    });

    it(`should be created with its pin number set`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      expect(pin.pin).to.equal(PIN_NUMBER);
    });

    it(`should throw when created without a pin number`, () => {
      expect(() => Pin()).to.throw();
    });
  });

  describe('open', () => {
    it('should open the GPIO address', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      expect(pin.gpio.open.called).to.be.true;
    });

    it(`should be opened in state ${PinState.LOW}`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      expect(pin.state).to.equal(PinState.LOW);
    });

    it('should throw when a GPIO exception is thrown', () => {
      const pin = BrokePin({ pin: PIN_NUMBER });
      expect(() => pin.open()).to.throw();
    });
  });

  describe('close', () => {
    it('should close the GPIO address', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.close();
      expect(pin.gpio.close.called).to.be.true;
    });

    it(`should be in state ${PinState.CLOSED} after closing`, () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.close();
      expect(pin.state).to.equal(PinState.CLOSED);
    });

    it('should throw if closed before opening', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      expect(() => pin.close()).to.throw();
    });

    it('should throw when a GPIO exception is thrown', () => {
      const pin = BrokePin({ pin: PIN_NUMBER });
      expect(() => pin.close()).to.throw();
    });
  });

  describe('write', () => {
    it('should throw when an invalid is provided', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      expect(() => pin.write('NONCE')).to.throw();
    });

    it('should throw when pin has not been opened', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      expect(() => pin.high()).to.throw();
    });

    it('should throw when a GPIO exception is thrown', () => {
      const pin = BrokePin.props({
        gpio: { open: sinon.stub() }
      })({ pin: PIN_NUMBER });
      pin.open();
      expect(() => pin.high()).to.throw();
    });
  });

  describe('high', () => {
    it('should write to GPIO with its high value', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.high();
      expect(pin.gpio.write.calledWith(PIN_NUMBER, pin.highValue)).to.be.true;
    });
  });

  describe('low', () => {
    it('should write to GPIO with its low value', () => {
      const pin = MockPin({ pin: PIN_NUMBER });
      pin.open();
      pin.low();
      expect(pin.gpio.write.calledWith(PIN_NUMBER, pin.lowValue)).to.be.true;
    });
  });
});
