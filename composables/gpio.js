const stampit = require('@stamp/it');

const { GPIOValue } = require('../constants');

const gpio = stampit({
  props: {
    gpio: null,
  },
  methods: {
    gpioValue(value) {
      return {
        [GPIOValue.HIGH]: this.gpio.HIGH,
        [GPIOValue.LOW]: this.gpio.LOW,
      }[value];
    },
    open(pin, value) {
      this.gpio.open(pin, this.gpio.OUTPUT, this.gpioValue(value));
    },
    close(pin) {
      this.gpio.close(pin);
    },
    write(pin, value) {
      this.gpio.write(pin, this.gpioValue(value));
    },
  }
});

module.exports = gpio;
