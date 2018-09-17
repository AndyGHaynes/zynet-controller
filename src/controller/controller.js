const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');
const TemperatureController = require('./temperature_controller');

const Controller = stampit.compose(EventLogger, {
  props: {
    config: {
      leds: [],
      pidParams: {},
      relays: [],
    },
    PinController,
    TemperatureController,
  },
  init() {
    const { leds, pidParams, relays } = this.config;
    const pinProps = (pin) => ({ pin: this.registerPin(pin) });

    this.pinController = this.PinController.props({ logLevel: this.logLevel })();
    this.leds = LEDArray.props({
      leds: _.map(leds, ({ color, pin }) => LED.props(pinProps(pin))({ color }))
    })();
    this.relays = _.map(relays, ({ pin }) => Relay.props(pinProps(pin))());
    this.temperatureController = null;
  },
  methods: {
    registerPin(pin) {
      return this.pinController.registerPin(pin);
    },
    initializeTemperatureController(pidParams, targetTemperature) {
      this.temperatureController = this.TemperatureController(
        pidParams,
        this.relays,
        targetTemperature
      );
      return this.temperatureController.initialize();
    },
    shutdown() {
      this.pinController.disposeAll();
    },
  }
});

module.exports = Controller;
