const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('./event_logger');

const PinToggle = stampit(Configure.noPrivatize(), EventLogger, {
  configuration: {
    errorEvent: null,
    offEvent: null,
    onEvent: null,
    pin: null,
    reversed: false,
  },
  methods: {
    isOn() {
      const { pin, reversed } = this.config;
      if (reversed) {
        return pin.isLow();
      }
      return pin.isHigh();
    },

    logPinEvent(event, error) {
      this.logEvent(event, {
        error,
        pin: _.pick(this.config.pin, 'gpio', 'state'),
      });
    },

    high() {
      return this.config.pin.high()
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },

    low() {
      return this.config.pin.low()
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },

    on() {
      return (this.config.reversed ? this.low() : this.high())
        .then(() => this.logPinEvent(this.onEvent));
    },

    off() {
      return (this.config.reversed ? this.high() : this.low())
        .then(() => this.logPinEvent(this.offEvent));
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
