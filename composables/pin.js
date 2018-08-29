const stampit = require('@stamp/it');

const {
  GPIOValue,
  PinState,
} = require('../constants');

const Pin = stampit({
  props: {
    gpio: null,
  },
  init({ pin }) {
    this.pin = pin;
    this.setState(PinState.INITIALIZED);
    this.open();
  },
  methods: {
    open() {
      this.gpio.open(this.pin, GPIOValue.LOW);
      this.setState(PinState.LOW);
    },
    close() {
      this.gpio.close(this.pin);
      this.setState(PinState.CLOSED);
    },
    on() {
      this.gpio.write(this.pin, GPIOValue.HIGH);
      this.setState(PinState.HIGH);
    },
    off() {
      this.gpio.write(this.pin, GPIOValue.LOW);
      this.setState(PinState.LOW);
    },
    isOn() {
      return this.state === PinState.HIGH;
    },
    setState(state) {
      this.state = state;
    },
  }
});

module.exports = Pin;
