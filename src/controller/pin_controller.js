const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');

const PinController = stampit({
  init() {
    this.pins = [];
  },
  methods: {
    disposeAll() {
      return Promise.all(_.invokeMap(this.pins, 'low'))
        .then(() => this.pins = []);
    },
    registerPin(pin) {
      this.pins.push(pin);
      return pin;
    },
  }
});

module.exports = PinController;
