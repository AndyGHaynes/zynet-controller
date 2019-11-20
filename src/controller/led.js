const PinToggle = require('../composables/pin_toggle');
const { EventType } = require('../constants');

const LED = PinToggle.conf({
  errorEvent: EventType.LED_ERROR,
  offEvent: EventType.LED_OFF,
  onEvent: EventType.LED_ON,
}).init(({ color }) => {
  this.color = color;
});

module.exports = LED;
