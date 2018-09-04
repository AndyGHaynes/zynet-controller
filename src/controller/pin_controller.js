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
      _.map(this.pins, this.disposePin);
    },
    disposePin(pin) {
      try {
        pin.close();
        this.pins = _.without(this.pins, pin);
      } catch (e) {
        this.logError(e);
      }
    },
    registerPin(pinNumber) {
      try {
        const pin = Pin.props({ debug: this.debug })({ pin: pinNumber });
        pin.open();
        this.pins.push(pin);
        return pin;
      } catch (e) {
        this.logError(e);
        return null;
      }
    },
  }
});

module.exports = PinController;
