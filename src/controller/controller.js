const stampit = require('@stamp/it');
const _ = require('lodash');

const LED = require('./led');
const LEDArray = require('./led_array');
const PinController = require('./pin_controller');
const Relay = require('./relay');
const TemperatureController = require('./temperature_controller');

const Controller = stampit.compose(PinController, {
  props: {
    LED,
    LEDArray,
    Relay,
    TemperatureController,
  },
  init({ leds, pid, relays }) {
    this.leds = this.LEDArray.props({
      leds: _.map(
        leds,
        ({ color, pIndex }) => this.LED.props({
          pin: this.registerPin(pIndex)
        })({ color })
      ),
    })();
    this.temperatureController = this.TemperatureController({
      pidParams: pid,
      relays: _.map(
        relays,
        ({ pIndex }) => this.Relay.props({
          pin: this.registerPin(pIndex)
        })()
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
