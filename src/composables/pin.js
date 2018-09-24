const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');
const rpio = Promise.promisifyAll(require('rpio'));

const { EventType, PinState } = require('../constants');
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
  init({ pIndex }) {
    this.logDebug(`creating pin at ${pIndex}`);
    if (_.isNil(pIndex)) {
      throw new Error('Cannot initialize pin without pin index');
    }
    this.pIndex = pIndex;
    this.state = null;
    this.setState(PinState.INITIALIZED);
  },
  methods: {
    logPinEvent(event, error) {
      this.logEvent(event, {
        error,
        pIndex: this.pIndex,
        state: this.state,
      });
    },
    open() {
      return this.gpio.openAsync(this.pIndex, this.output, this.lowValue)
        .tapCatch((e) => this.logPinEvent(EventType.PIN_ERROR, e))
        .then(this.logPinEvent(EventType.PIN_OPEN))
        .disposer(() => this.close());
    },
    close() {
      return this.gpio.closeAsync(this.pIndex, this.pinPreserve)
        .then(() => this.logPinEvent(EventType.PIN_CLOSE))
        .tapCatch((e) => this.logPinEvent(EventType.PIN_ERROR, e));
    },
    write(gpioValue) {
      return Promise.using(this.open(), () => {
        if (gpioValue !== this.highValue && gpioValue !== this.lowValue) {
          throw new Error(
            `Cannot set pin to ${gpioValue}, valid values are { HIGH: ${this.highValue}, LOW: ${this.lowValue} }`
          );
        }
        return this.gpio.writeAsync(this.pIndex, gpioValue)
          .tapCatch((e) => this.logPinEvent(EventType.PIN_ERROR, e));
      });
    },
    high() {
      return this.write(this.highValue)
        .then(() => {
          this.logPinEvent(EventType.PIN_HIGH);
          this.setState(PinState.HIGH);
        });
    },
    low() {
      return this.write(this.lowValue)
        .then(() => {
          this.logPinEvent(EventType.PIN_LOW);
          this.setState(PinState.LOW);
        });
    },
    isOn() {
      return this.state === PinState.HIGH;
    },
    setState(state) {
      this.logDebug(`[pin ${this.pIndex}] ${this.state || 'null'} -> ${state}`);
      this.state = state;
    },
  }
});

module.exports = Pin;
