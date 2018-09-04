const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const LED = require('./led');
const PinController = require('./pin_controller');
const Relay = require('./relay');
const TemperatureController = require('./temperature_controller');

const Controller = stampit.compose(EventLogger, {
  props: {
    PinController,
    TemperatureController,
  },
  init() {
    this.leds = {};
    this.relays = [];
    this.pinController = PinController.props({ debug: this.debug })();
    this.temperatureController = null;
  },
  methods: {
    registerPin(pin) {
      const newPin = this.pinController.registerPin(pin);
      if (newPin === null) {
        throw new Error(`Controller could not register pin ${pin}`);
      }
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
        pin: this.registerPin(pin),
      })({ color });
    },
    registerRelay({ pin }) {
      this.relays.push(Relay.props({
        pin: this.registerPin(pin),
      })());
    },
    shutdown() {
      this.leds = {};
      this.pinController.disposeAll();
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
