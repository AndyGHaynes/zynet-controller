const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');
const TemperatureController = require('../thermostat/temperature_controller');

const Controller = stampit.compose(EventLogger, PinController, {
  props: {
    LED,
    LEDArray,
    Pin: null,
    Relay,
    TemperatureController,
  },
  init({ leds, relays, schedule, thermometer }) {
    this.config = {
      leds,
      relays,
      schedule,
      thermometer,
    };

    this.leds = this.LEDArray.props({
      leds: _.map(
        this.config.leds,
        ({ color, pIndex }) =>
          this.composePinToggle(this.LED, pIndex)({ color })
      ),
    })();

    this.relays = _.map(
      this.config.relays,
      ({ pIndex }) => this.composePinToggle(this.Relay, pIndex)()
    );

    this.temperatureController = this.TemperatureController
      .props({ logLevel: this.logLevel })({
        pidParams: this.config.pid,
        relays: this.relays,
        targetTemperature: this.config.schedule.targetTemperature,
      });

    // Timeout object for recurring thermometer reads
    this.temperatureReadInterval = null;

    this.stateManager = this.StateManager();
  },
  methods: {
    composePinToggle(composable, pIndex) {
      return composable.props({
        logLevel: this.logLevel,
        pin: this.registerPin(
          this.Pin.props({ logLevel: this.logLevel })({ pIndex })
        ),
      });
    },
    setTargetTemperature(temperature) {
      return this.temperatureController.initialize()
        .then(() => this.temperatureController.setTemperature(temperature));
    },
    shutdown() {
      return this.disposeAll();
    },
  }
});

module.exports = Controller;
