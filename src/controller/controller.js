const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');
const TemperatureController = require('./temperature_controller');

const Controller = stampit.compose(EventLogger, PinController, {
  props: {
    LED,
    LEDArray,
    Relay,
    TemperatureController,
  },
  init({ leds, pid, relays }) {
    const composePinToggle = (composable, pIndex) =>
      composable.props({
        logLevel: this.logLevel,
        pin: this.registerPin(pIndex),
      });
    this.leds = this.LEDArray.props({
      leds: _.map(
        leds,
        ({ color, pIndex }) =>
          composePinToggle(this.LED, pIndex)({ color })
      ),
      logLevel: this.logLevel,
    })();
    this.temperatureController = this.TemperatureController({
      pidParams: pid,
      relays: _.map(
        relays,
        ({ pIndex }) => composePinToggle(this.Relay, pIndex)()
      ),
    });
  },
  methods: {
    setTargetTemperature(temperature) {
      return this.temperatureController.initialize()
        .then(() => this.temperatureController.setTemperature(temperature));
    },
    shutdown() {
      this.disposeAll();
    },
  }
});

module.exports = Controller;
