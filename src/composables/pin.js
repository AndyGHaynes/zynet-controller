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
    pinPreserve: rpio.PIN_PRESERVE,
    pinReset: rpio.PIN_RESET,
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
      this.gpio.close(this.pin, this.pinPreserve);
      this.setState(PinState.CLOSED);
    },
    write(gpioValue) {
      try {
        this.open();
        if (gpioValue !== this.highValue && gpioValue !== this.lowValue) {
          throw new Error(
            `Cannot set pin to ${gpioValue}, valid values are { HIGH: ${this.highValue}, LOW: ${this.lowValue} }`
          );
        }
        this.gpio.write(this.pin, gpioValue);
      } finally {
        this.close();
      }
    },
    high() {
      this.write(this.highValue);
      this.setState(PinState.HIGH);
    },
    low() {
      this.write(this.lowValue);
      this.setState(PinState.LOW);
    },
    isOn() {
      return this.state === PinState.HIGH;
    },
    setState(state) {
      this.logDebug(`[pin ${this.pin}] ${this.state || 'null'} -> ${state}`);
      this.state = state;
    },
  }
});

module.exports = Pin;
