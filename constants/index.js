const GPIOValue = {
  HIGH: Symbol('HIGH'),
  LOW: Symbol('LOW'),
};

const LEDColor = {
  BLUE: Symbol('BLUE'),
  GREEN: Symbol('GREEN'),
  RED: Symbol('RED'),
  YELLOW: Symbol('YELLOW'),
};

const PinState = {
  INITIALIZED: Symbol('INITIALIZED'),
  CLOSED: Symbol('CLOSED'),
  HIGH: Symbol('HIGH'),
  LOW: Symbol('LOW'),
};

module.exports = {
  GPIOValue,
  LEDColor,
  PinState,
};
