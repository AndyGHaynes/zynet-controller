const stampit = require('@stamp/it');

const { GPIOValue } = require('../constants');

const GPIO = stampit({
  props: {
    gpio: null,
    high: null,
    low: null
  },
  methods: {
    gpioValue(value) {
      return {
        [GPIOValue.HIGH]: this.high,
        [GPIOValue.LOW]: this.low,
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

module.exports = GPIO;
