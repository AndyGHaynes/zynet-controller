const stampit = require('@stamp/it');
const _ = require('lodash');
const rpio = require('rpio');

const { PinState } = require('../constants/index');
const EventLogger = require('./event_logger');

const Pin = stampit.compose(EventLogger, {
  props: {
    gpio: rpio,
    highValue: rpio.HIGH,
    lowValue: rpio.LOW,
    input: rpio.INPUT,
    output: rpio.OUTPUT,
  },
  init({ pin }) {
    this.logDebug(`creating pin ${pin}`);
    if (_.isNil(pin)) {
      throw new Error('Cannot initialize pin without pin index');
    }
    this.pin = pin;
    this.state = null;
    this.setState(PinState.INITIALIZED);
  },
  methods: {
    open() {
      this.gpio.open(this.pin, this.output, this.lowValue);
      this.setState(PinState.LOW);
    },
    close() {
      if (this.state === PinState.INITIALIZED) {
        throw new Error('Cannot close pin before opening');
      }
      this.gpio.close(this.pin);
      this.setState(PinState.CLOSED);
    },
    write(gpioValue) {
      if (gpioValue !== this.highValue && gpioValue !== this.lowValue) {
        throw new Error(`Cannot set pin to ${gpioValue}`);
      } else if (!this.isOpen()) {
        throw new Error(`Cannot write to pin ${this.pin} in state ${this.state}`);
      }
      this.gpio.write(this.pin, gpioValue);
    },
    high() {
      this.write(this.highValue);
      this.setState(PinState.HIGH);
    },
    low() {
      this.write(this.lowValue);
      this.setState(PinState.LOW);
    },
    isClosed() {
      return this.state === PinState.CLOSED;
    },
    isOff() {
      return this.state === PinState.LOW;
    },
    isOn() {
      return this.state === PinState.HIGH;
    },
    isOpen() {
      return this.isOn() || this.isOff();
    },
    setState(state) {
      this.logDebug(`[pin ${this.pin}] ${this.state || 'null'} -> ${state}`);
      this.state = state;
    },
  }
});

module.exports = Pin;
