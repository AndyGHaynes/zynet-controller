const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');
const rpio = Promise.promisifyAll(require('rpio'));

const { PinState } = require('../constants');
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
      return Promise.resolve(this.gpio.openAsync(this.pin, this.output, this.lowValue))
        .disposer(() => this.close());
    },
    close() {
      return this.gpio.closeAsync(this.pin, this.pinPreserve);
    },
    write(gpioValue) {
      return Promise.using(this.open(), () => {
        if (gpioValue !== this.highValue && gpioValue !== this.lowValue) {
          throw new Error(
            `Cannot set pin to ${gpioValue}, valid values are { HIGH: ${this.highValue}, LOW: ${this.lowValue} }`
          );
        }
        return this.gpio.writeAsync(this.pin, gpioValue);
      });
    },
    high() {
      return this.write(this.highValue)
        .then(() => this.setState(PinState.HIGH));
    },
    low() {
      return this.write(this.lowValue)
        .then(() => this.setState(PinState.LOW));
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
