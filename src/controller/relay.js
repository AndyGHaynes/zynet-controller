const PinToggle = require('../composables/pin_toggle');
const { EventType } = require('../constants');

const Relay = PinToggle.conf({
  errorEvent: EventType.RELAY_ERROR,
  offEvent: EventType.RELAY_OFF,
  onEvent: EventType.RELAY_ON,
});

module.exports = Relay;
