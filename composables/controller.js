const stampit = require('@stamp/it');
const _ = require('lodash');

const gpio = require('./gpio');
const led = require('./led');

const controller = stampit({
  props: {
    gpio: null,
  },
  init() {
    this.leds = [];
    this.led = led.props({
      gpio: gpio.props({ gpio: this.gpio })()
    });
  },
  methods: {
    createLED({ pin, color }) {
      this.leds.push(
        this.led({ pin, color })
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

module.exports = controller;
