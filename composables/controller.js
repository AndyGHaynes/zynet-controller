const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('./event_logger');
const LED = require('./led');
const Pin = require('./pin');
const Relay = require('./relay');
const TemperatureController = require('./temperature_controller');

const Controller = stampit.compose(EventLogger, {
  props: {
    TemperatureController,
  },
  init() {
    this.leds = {};
    this.pins = [];
    this.relays = [];
    this.temperatureController = null;
  },
  methods: {
    createPin(pin) {
      const newPin = Pin.props({ debug: this.debug })({ pin });
      this.pins.push(newPin);
      return newPin;
    },
    initializeTemperatureController(pidParams, targetTemperature) {
      this.temperatureController = this.TemperatureController(
        pidParams,
        this.relays,
        targetTemperature
      );
      return this.temperatureController.initialize();
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
