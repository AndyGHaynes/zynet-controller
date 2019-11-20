const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');

const GPIO = stampit(Configure.noPrivatize(), {
  configuration: {
    gpio: null,
    highValue: 1,
    lowValue: 0,
  },
  init({ pIndex }) {
    this.pIndex = pIndex;
  },
  methods: {
    high() {
      return this.write(this.config.highValue);
    },

    low() {
      return this.write(this.config.lowValue);
    },
  },
});

module.exports = GPIO;
