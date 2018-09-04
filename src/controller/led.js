const PinToggle = require('../composables/pin_toggle');

const LED = PinToggle.compose({
  init({ color }) {
    this.color = color;
  }
});

module.exports = LED;