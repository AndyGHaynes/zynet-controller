const stampit = require('@stamp/it');

const LED = stampit({
  props: {
    pin: null,
  },
  methods: {
    on() {
      this.pin.high();
    },
    off() {
      this.pin.low();
    },
    toggle() {
      this.pin.isOn() ? this.off() : this.on();
    }
  }
});

module.exports = LED;
