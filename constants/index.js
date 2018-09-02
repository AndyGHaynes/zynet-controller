const LEDColor = {
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  RED: 'RED',
  YELLOW: 'YELLOW',
};

const PIDState = {
  UNINITIALIZED: 'UNINITIALIZED',
  READY: 'READY',
  ON: 'ON',
  OFF: 'OFF',
};

const PinState = {
  INITIALIZED: 'INITIALIZED',
  CLOSED: 'CLOSED',
  HIGH: 'HIGH',
  LOW: 'LOW',
};

module.exports = {
  LEDColor,
  PIDState,
  PinState,
};
