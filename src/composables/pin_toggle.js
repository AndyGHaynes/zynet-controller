const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('./event_logger');

const PinToggle = stampit.compose(EventLogger, {
  props: {
    errorEvent: null,
    offEvent: null,
    onEvent: null,
    pin: null,
    reversed: false,
  },
  methods: {
    isOn() {
      return this.pin.isHigh();
    },

    logPinEvent(event, error) {
      this.logEvent(event, {
        error,
        pin: _.pick(this.pin, 'gpio', 'state'),
      });
    },

    on() {
      return (this.reversed ? this.pin.low() : this.pin.high())
        .then(() => this.logPinEvent(this.onEvent))
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },

    off() {
      return (this.reversed ? this.pin.high() : this.pin.low())
        .then(() => this.logPinEvent(this.offEvent))
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },

    toggle() {
      if (this.isOn()) {
        return this.off();
      }
      return this.on();
    },
  }
});

module.exports = PinToggle;
