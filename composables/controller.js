const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('./event_logger');
const LED = require('./led');
const PID = require('./pid');
const Pin = require('./pin');
const Relay = require('./relay');
const Thermometer = require('./thermometer');

const Controller = stampit.compose(EventLogger, {
  init() {
    this.leds = {};
    this.pid = null;
    this.pins = [];
    this.relays = [];
    this.thermometer = null;
  },
  methods: {
    createPin(pin) {
      const newPin = Pin.props({ debug: this.debug })({ pin });
      this.pins.push(newPin);
      return newPin;
    },
    initializePID({ k_p, k_i, k_d, i_max }) {
      this.pid = PID.props({ debug: this.debug })({ k_p, k_i, k_d, i_max });
    },
    initializeThermometer() {
      this.thermometer = Thermometer.props({ debug: this.debug })();
      return this.thermometer.initialize()
        .then((sensorId) => this.logDebug(`thermometer ${sensorId} online`))
        .catch(this.logError);
    },
    readTemperature() {
      return this.thermometer.readTemperature()
        .return()
        .catch(this.logError);
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
    setPIDTarget(value) {
      this.pid.setTarget(value);
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
    updateTemperature() {
      return this.readTemperature()
        .then((temperature) => this.pid.setValue(temperature));
    },
  }
});

module.exports = Controller;
