const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const Pin = require('../composables/pin');

const PinController = stampit.compose(EventLogger, {
  props: {
    Pin,
  },
  init() {
    this.pins = [];
  },
  methods: {
    disposeAll() {
      _.forEach(this.pins, (pin) => this.disposePin(pin));
    },
    disposePin(pin) {
      _.pull(this.pins, pin);
    },
    registerPin(pIndex) {
      const pin = this.Pin.props({ logLevel: this.logLevel })({ pIndex });
      this.pins.push(pin);
      return pin;
    },
  }
});

module.exports = PinController;
