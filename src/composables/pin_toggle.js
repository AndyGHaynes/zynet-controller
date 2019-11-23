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

    on() {
      const { errorEvent, onEvent, pin, reversed } = this.config;
      return (reversed ? pin.low() : pin.high())
        .then(() => this.logPinEvent(onEvent))
        .tapCatch((e) => this.logPinEvent(errorEvent, e));
    },

    off() {
      const { errorEvent, offEvent, pin, reversed } = this.config;
      return (reversed ? pin.high() : pin.low())
        .then(() => this.logPinEvent(offEvent))
        .tapCatch((e) => this.logPinEvent(errorEvent, e));
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
