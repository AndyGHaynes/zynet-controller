const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const Pin = require('../gpio/pin');
const Thermostat = require('../thermostat/thermostat');
const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');

const Controller = stampit.compose(
    EventLogger,
    PinController,
  )
  .props({
    LED,
    LEDArray,
    Pin,
    Relay,
    Thermostat,
  })
  .init(function (controllerConfig) {
    const {
      leds,
      pid,
      relays,
      schedule,
      thermometer,
    } = controllerConfig;

    this.leds = this.LEDArray.props({
      leds: _.map(
        leds,
        ({ color, pIndex }) =>
          this.composePinToggle(this.LED, pIndex)({ color })
      ),
    })();

    this.relays = _.map(
      relays,
      ({ pIndex }) => this.composePinToggle(this.Relay, pIndex)()
    );

    this.thermometerConfig = thermometer;
    this.thermostat = this.Thermostat
      .props({ logLevel: this.logLevel })({
        pidParams: pid,
        relays: this.relays,
        targetTemperature: schedule.targetTemperature,
      });

    // Timeout object for recurring thermometer reads
    this.temperatureReadInterval = null;
  })
  .methods({
    composePinToggle(composable, pIndex) {
      return composable.props({
        logLevel: this.logLevel,
        pin: this.registerPin(
          this.Pin.props({ logLevel: this.logLevel })({ pIndex })
        ),
      });
    },
    setTargetTemperature(temperature) {
      return this.thermostat.initialize()
        .then(() => this.thermostat.setTemperature(temperature));
    },
    shutdown() {
      this.stop();
      return this.disposeAll();
    },
    start() {
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
  });

module.exports = Controller;
