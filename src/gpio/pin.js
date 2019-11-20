const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');

const { EventType, PinState } = require('../constants');
const EventLogger = require('../composables/event_logger');

const Pin = stampit(Configure.noPrivatize(), EventLogger, {
  configuration: {
    GPIO: null,
  },
  init({ pIndex }) {
    this.gpio = this.config.GPIO({ pIndex });
    this.state = null;
    this.setState(PinState.INITIALIZED);
  },
  methods: {
    close() {
      return this.gpio.close()
        .then(() => this.setState(PinState.CLOSED));
    },

    isHigh() {
      return this.state === PinState.HIGH;
    },

    logPinEvent(event, error) {
      this.logEvent(event, {
        error,
        pIndex: this.pIndex,
        state: this.state,
      });
    },

    high() {
      return this.gpio.high()
        .then(() => {
          this.logPinEvent(EventType.PIN_HIGH);
          this.setState(PinState.HIGH);
        });
    },

    low() {
      return this.gpio.low()
        .then(() => {
          this.logPinEvent(EventType.PIN_LOW);
          this.setState(PinState.LOW);
        });
    },

    setState(state) {
      this.state = state;
    },
  }
});

module.exports = Pin;
