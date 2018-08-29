const Pin = require('./pin');

const LED = Pin.compose({
  methods: {
    toggle() {
      this.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = LED;
