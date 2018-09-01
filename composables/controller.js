const stampit = require('@stamp/it');
const _ = require('lodash');

const LED = require('./led');
const Pin = require('./pin');

const Controller = stampit({
  init() {
    this.leds = {};
    this.pins = [];
  },
  props: {
    debug: false,
  },
  methods: {
    createLED(pin, color) {
      return LED.props({
        pin: this.createPin(pin),
      })({ color });
    },
    createPin(pin) {
      const newPin = Pin.props({
        debug: this.debug
      })({ pin });
      this.pins.push(newPin);
      return newPin;
    },
    registerLEDs(leds) {
      this.leds = _.reduce(
        leds,
        (ledArray, { pin, color }) => {
          ledArray[color] = this.createLED(pin, color);
          return ledArray;
        },
        {}
      );
    },
    shutdown() {
      this.leds = {};
      _.map(this.pins, (pin) => pin.close());
    },
    toggleLEDs() {
      _.map(
        _.keys(this.leds),
        (color) => this.leds[color].toggle()
      );
    },
  }
});

module.exports = Controller;
