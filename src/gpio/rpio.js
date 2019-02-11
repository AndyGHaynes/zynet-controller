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
      return Promise.try(() =>
        this.rpio.open(this.pIndex, this.rpio.OUTPUT, this.rpio.LOW)
      );
    },
    close() {
      return Promise.try(() =>
        this.rpio.close(this.pIndex, this.rpio.PIN_PRESERVE)
      );
    },
    write(gpioValue) {
      return this.rpio.read()
        .catch(() => this.open())
        .then(() => this.rpio.write(this.pIndex, gpioValue));
    },
    high() {
      return this.write(this.rpio.HIGH);
    },
    low() {
      return this.write(this.rpio.LOW);
    },
  }
});

module.exports = RPIO;
