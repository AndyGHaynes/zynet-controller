const stampit = require('@stamp/it');
const _ = require('lodash');

const { LEDColor, LEDType } = require('../constants');

const LEDArray = stampit({
  props: {
    colorMapping: {
      [LEDColor.BLUE]: LEDType.DATA,
      [LEDColor.GREEN]: LEDType.SUCCESS,
      [LEDColor.RED]: LEDType.ERROR,
      [LEDColor.YELLOW]: LEDType.WARNING,
    },
    leds: [],
  },
  init() {
    this.indicators = _.keyBy(this.leds, ({ color }) => this.colorMapping[color]);
  },
  methods: {
    toggleLED(ledType) {
      this.indicators[ledType] && this.indicators[ledType].toggle();
    },
    data() {
      this.toggleLED(LEDType.DATA);
    },
    error() {
      this.toggleLED(LEDType.ERROR);
    },
    success() {
      this.toggleLED(LEDType.SUCCESS);
    },
    warn() {
      this.toggleLED(LEDType.WARNING);
    },
  }
});

module.exports = LEDArray;
