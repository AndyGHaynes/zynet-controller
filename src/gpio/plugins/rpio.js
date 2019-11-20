const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const Promise = require('bluebird');
const rpio = require('rpio');

const GPIO = require('../gpio');

const RPIO = stampit(
  Configure.noPrivatize(),
  GPIO.conf({
    lowValue: rpio.LOW,
    highValue: rpio.HIGH
  }), {
    configuration: {
      rpio,
    },
    methods: {
      open() {
        return Promise.try(() =>
          this.config.rpio.open(this.pIndex, this.config.rpio.OUTPUT, this.config.lowValue)
        );
      },

      close() {
        return Promise.try(() =>
          this.config.rpio.close(this.pIndex, this.config.rpio.PIN_PRESERVE)
        );
      },

      write(gpioValue) {
        return Promise.resolve(this.open())
          .then(() => this.config.rpio.write(this.pIndex, gpioValue));
      },
    },
  }
);

module.exports = RPIO;
