const GPIOValue = {
  HIGH: Symbol('HIGH'),
  LOW: Symbol('LOW'),
};

const PinState = {
  INITIALIZED: Symbol('INITIALIZED'),
  CLOSED: Symbol('CLOSED'),
  HIGH: Symbol('HIGH'),
  LOW: Symbol('LOW'),
};

module.exports = {
  GPIOValue,
  PinState,
};
