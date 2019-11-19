const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const Promise = require('bluebird');
const rpio = require('rpio');

const GPIO = require('../gpio');

const RPIO = stampit
  .compose(
    Configure.noPrivatize(),
    GPIO.conf({
      lowValue: rpio.LOW,
      highValue: rpio.HIGH
    }),
  )
  .props({ rpio })
  .methods({
    open() {
      return Promise.try(() =>
        this.rpio.open(this.pIndex, this.rpio.OUTPUT, this.config.lowValue)
      );
    },

    close() {
      return Promise.try(() =>
        this.rpio.close(this.pIndex, this.rpio.PIN_PRESERVE)
      );
    },

    write(gpioValue) {
      return Promise.resolve(this.open())
        .then(() => this.rpio.write(this.pIndex, gpioValue));
    },
  });

module.exports = RPIO;
