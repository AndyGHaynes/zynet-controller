const stampit = require('@stamp/it');

const PinToggle = stampit({
  props: {
    pin: null,
  },
  methods: {
    on() {
      return this.pin.high();
    },
    off() {
      return this.pin.low();
    },
    toggle() {
      return this.pin.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = PinToggle;
