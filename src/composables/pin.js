const stampit = require('@stamp/it');
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
    this.pin = pin;
    this.state = null;
    this.setState(PinState.INITIALIZED);
    this.open();
  },
  methods: {
    open() {
      this.gpio.open(this.pin, this.output, this.lowValue);
      this.setState(PinState.LOW);
    },
    close() {
      this.gpio.close(this.pin);
      this.setState(PinState.CLOSED);
    },
    high() {
      this.gpio.write(this.pin, this.highValue);
      this.setState(PinState.HIGH);
    },
    low() {
      this.gpio.write(this.pin, this.lowValue);
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
