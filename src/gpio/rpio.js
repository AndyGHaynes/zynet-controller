const stampit = require('@stamp/it');
const Promise = require('bluebird');
const rpio = require('rpio');

const RPIO = stampit({
  props: {
    rpio,
  },
  init({ pIndex }) {
    this.pIndex = pIndex;
  },
  methods: {
    open() {
      return Promise.resolve(this.rpio.open(this.pIndex, this.rpio.OUTPUT, this.rpio.LOW));
    },
    close() {
      return Promise.resolve(this.rpio.close(this.pIndex, this.rpio.PIN_PRESERVE));
    },
    write(gpioValue) {
      return this.open()
        .then(() => this.rpio.write(this.pIndex, gpioValue));
    },
    high() {
      return this.write(this.rpio.HIGH)
        .finally(() => this.close());
    },
    low() {
      return this.write(this.rpio.LOW)
        .finally(() => this.close());
    },
  }
});

module.exports = RPIO;
