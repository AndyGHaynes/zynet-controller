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
      for (let i = 0; i < this.pins.length; i++) {
        this.disposePin(this.pins[i]);
      }
    },
    disposePin(pin) {
      try {
        _.pull(this.pins, pin);
        pin.close();
      } catch (e) {
        this.logError(e);
      }
    },
    registerPin(pinNumber) {
      const pin = this.Pin.props({ debug: this.debug })({ pin: pinNumber });
      pin.open();
      this.pins.push(pin);
      return pin;
    },
  }
});

module.exports = PinController;
