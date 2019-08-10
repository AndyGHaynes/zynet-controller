const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');

const GPIO = stampit.compose(Configure.noPrivatize())
  .conf({
    highValue: 1,
    lowValue: 0,
  })
  .props({
    gpio: null,
  })
  .init(function ({ pIndex }) {
    this.pIndex = pIndex;
  })
  .methods({
    high() {
      return this.write(this.config.highValue);
    },
    low() {
      return this.write(this.config.lowValue);
    },
  });

module.exports = GPIO;
