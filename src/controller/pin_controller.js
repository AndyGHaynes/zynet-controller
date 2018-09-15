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
      try {
        _.pull(this.pins, pin);
      } catch (e) {
        this.logError(e);
      }
    },
    registerPin(pinNumber) {
      const pin = this.Pin.props({ debug: this.debug })({ pin: pinNumber });
      this.pins.push(pin);
      return pin;
    },
  }
});

module.exports = PinController;
