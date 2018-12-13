const stampit = require('@stamp/it');
const Promise = require('bluebird');
const { Gpio } = require('chip-gpio');

const ChipGPIO = stampit({
  props: {
    gpio: Gpio,
  },
  init({ pIndex }) {
    this.pIndex = pIndex;
    this.pin = null;
  },
  methods: {
    open() {
      return Promise.resolve(new this.gpio(this.pIndex, 'out', 1))
        .then((pin) => this.pin = pin);
    },
    close() {
      return Promise.resolve(this.pin && this.pin.unexport());
    },
    write(gpioValue) {
      return this.open()
        .then(() => this.pin.write(gpioValue));
    },
    high() {
      return this.write(1)
        .finally(() => this.close());
    },
    low() {
      return this.write(0)
        .finally(() => this.close());
    },
  }
});

module.exports = ChipGPIO;
