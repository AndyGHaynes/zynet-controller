const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const Promise = require('bluebird');

const GPIO = require('../gpio/gpio');
const Pin = require('../gpio/pin');

const PinController = stampit(Configure.noPrivatize(), {
  configuration: {
    GPIO,
  },
  init() {
    this.pins = [];
  },
  methods: {
    createPin(pIndex) {
      return Pin.conf({
        GPIO: this.config.GPIO,
      })({ pIndex });
    },

    disposeAll() {
      return Promise.map(this.pins, (pin) => pin.close())
        .then(() => this.pins = []);
    },

    registerPin(pIndex) {
      const pin = this.createPin(pIndex);
      this.pins.push(pin);
      return pin;
    },
  },
});

module.exports = PinController;
