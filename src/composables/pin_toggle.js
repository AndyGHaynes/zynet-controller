const stampit = require('@stamp/it');

const EventLogger = require('./event_logger');

const PinToggle = stampit.compose(EventLogger, {
  props: {
    errorEvent: null,
    offEvent: null,
    onEvent: null,
    pin: null,
  },
  methods: {
    logPinEvent(event, error) {
      this.logEvent(event, { error, pin: this.pin });
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
      return this.pin.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = PinToggle;
