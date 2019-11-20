const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');

const { RelayType } = require('../constants');
const EventLogger = require('../composables/event_logger');
const GPIO = require('../gpio/gpio');
const Thermostat = require('../thermostat/thermostat');
const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');

const Controller = stampit(Configure.noPrivatize(), EventLogger, {
  configuration: {
    GPIO,
    LED,
    LEDArray,
    PinController,
    Relay,
    Thermostat,
  },
  init(controllerConfig) {
    const {
      leds,
      pid,
      relays,
      schedule,
      thermometer,
    } = controllerConfig;

    this.pinController = this.config.PinController
      .conf({ GPIO: this.config.GPIO })();

    this.leds = this.config.LEDArray.props({
      leds: _.map(
        leds,
        ({ color, pIndex }) =>
          this.composePinToggle({ composable: this.config.LED, pIndex })({ color })
      ),
    })();

    this.relays = _.map(
      relays,
      ({ pIndex, type }) => this.composePinToggle({
        composable: this.config.Relay,
        pIndex,
        reversed: type === RelayType.NORMALLY_CLOSED
      })()
    );

    this.thermometerConfig = thermometer;
    this.thermostat = this.config.Thermostat
      .props({ logLevel: this.logLevel })({
        pidParams: pid,
        relays: this.relays,
        targetTemperature: schedule.targetTemperature,
      });

    // Timeout object for recurring thermometer reads
    this.temperatureReadInterval = null;
  },
  methods: {
    composePinToggle({ composable, pIndex, reversed }) {
      return composable.conf({
        pin: this.pinController.registerPin(pIndex),
        reversed,
      }).props({ logLevel: this.logLevel });
    },

    getUpdate() {
      const relays = _.map(this.relays, (relay) => ({
        pin: relay.config.pin.gpio.pIndex,
        is_on: relay.isOn(),
      }));
      return {
        relays,
        thermostat: this.thermostat.getLastUpdate(),
      };
    },

    setTargetTemperature(temperature) {
      return this.thermostat.initialize()
        .then(() => this.thermostat.setTemperature(temperature));
    },

    shutdown() {
      console.warn('Shutting down, better luck next time.');
      this.stop();
      return Promise.all([
        _.map(this.relays, (relay) => relay.off()),
        this.pinController.disposeAll(),
      ]);
    },

    start() {
      // already initialized, no-op
      if (this.temperatureReadInterval) {
        return Promise.resolve();
      }
      return this.thermostat.initialize()
        .then(() => {
          this.temperatureReadInterval = setInterval(
            () => this.thermostat.update(),
            this.thermometerConfig.readIntervalMS
          );
        });
    },

    stop() {
      if (this.temperatureReadInterval) {
        clearInterval(this.temperatureReadInterval);
      }
      this.temperatureReadInterval = null;
    },
  },
});

module.exports = Controller;
