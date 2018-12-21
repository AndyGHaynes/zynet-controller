const stampit = require('@stamp/it');
const _ = require('lodash');

const EventLogger = require('./event_logger');

const PinToggle = stampit.compose(EventLogger, {
  props: {
    errorEvent: null,
    offEvent: null,
    onEvent: null,
    pin: null,
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
      return this.pin.high()
        .then(() => this.logPinEvent(this.onEvent))
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },
    off() {
      return this.pin.low()
        .then(() => this.logPinEvent(this.offEvent))
        .tapCatch((e) => this.logPinEvent(this.errorEvent, e));
    },
    toggle() {
      return this.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = PinToggle;
