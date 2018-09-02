const stampit = require('@stamp/it');
const _ = require('lodash');

const LED = require('./led');
const Pin = require('./pin');
const Relay = require('./relay');
const Thermometer = require('./thermometer');

const Controller = stampit({
  init() {
    this.leds = {};
    this.pins = [];
    this.relays = [];
    this.thermometer = Thermometer.props({ debug: this.debug })();
  },
  props: {
    debug: false,
  },
  methods: {
    createPin(pin) {
      const newPin = Pin.props({ debug: this.debug })({ pin });
      this.pins.push(newPin);
      return newPin;
    },
    initializeThermometer() {
      return this.thermometer.initialize()
        .then((sensorId) => this.debug && console.log(`thermometer ${sensorId} online`))
        .catch((e) => console.log(e));
    },
    readTemperature() {
      return this.thermometer.readTemperature()
        .return()
        .catch((e) => console.log(e));
    },
    registerLED({ pin, color }) {
      this.leds[color] = LED.props({
        pin: this.createPin(pin),
      })({ color });
    },
    registerRelay({ pin }) {
      this.relays.push(Relay.props({
        pin: this.createPin(pin),
      })());
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
