const stampit = require('@stamp/it');
const _ = require('lodash');

const GPIO = require('./gpio');
const LED = require('./led');

const Controller = stampit({
  props: {
    gpio: null,
    gpioHigh: null,
    gpioLow: null,
  },
  init() {
    this.leds = null;
  },
  methods: {
    createGPIO() {
      return GPIO.props({
        gpio: this.gpio,
        high: this.gpioHigh,
        low: this.gpioLow,
      })();
    },
    createLED(pin) {
      return LED.props({
        gpio: this.createGPIO(),
      })({ pin });
    },
    registerLEDs(leds) {
      this.leds = _.reduce(
        leds,
        (ledArray, { pin, color }) => {
          ledArray[color] = this.createLED(pin);
          return ledArray;
        },
        {}
      );
    },
    shutdown() {
      _.map(this.leds, (led) => led.close());
    },
    toggleLEDs() {
      _.map(this.leds, (led) => led.toggle());
    },
  }
});

module.exports = Controller;
