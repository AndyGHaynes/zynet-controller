const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');

const Pin = require('../composables/pin');

const PinController = stampit({
  props: {
    Pin,
  },
  init() {
    this.pins = [];
  },
  methods: {
    disposeAll() {
      return Promise.all(_.invokeMap(this.pins, 'low'))
        .then(() => this.pins = []);
    },
    registerPin(pIndex) {
      const pin = this.Pin.props({ logLevel: this.logLevel })({ pIndex });
      this.pins.push(pin);
      return pin;
    },
  }
});

module.exports = PinController;
