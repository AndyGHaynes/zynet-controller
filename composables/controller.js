const stampit = require('@stamp/it');
const _ = require('lodash');

const LED = require('./led');
const Pin = require('./pin');

const Controller = stampit({
  init() {
    this.leds = {};
    this.pins = [];
    this.relays = [];
  },
  props: {
    debug: false,
  },
  methods: {
    createPin(pin) {
      const newPin = Pin.props({
        debug: this.debug,
      })({ pin });
      this.pins.push(newPin);
      return newPin;
    },
    registerLED({ pin, color }) {
      this.leds[color] = LED.props({
        pin: this.createPin(pin),
      })({ color });
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
