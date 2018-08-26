const pin = require('./pin');

const led = pin.compose({
  init({ color }) {
    this.color = color;
  },
  methods: {
    toggle() {
      this.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = led;
