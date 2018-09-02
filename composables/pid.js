const stampit = require('@stamp/it');
const PIDController = require('node-pid-controller');

const { PIDState } = require('../constants');
const EventLogger = require('./event_logger');

const PID = stampit.compose(EventLogger, {
  props: {
    pidController: PIDController,
  },
  init({ k_p, k_i, k_d, i_max }) {
    this.lastCorrection = null;
    this.pid = new this.pidController({ k_p, k_i, k_d, i_max });
    this.setpoint = null;
    this.value = null;
  },
  methods: {
    getState() {
      if (this.setpoint === null) {
        return PIDState.UNINITIALIZED;
      } else if (this.value === null) {
        return PIDState.READY;
      }
      return this.lastCorrection > 0 ? PIDState.ON : PIDState.OFF;
    },
    setTarget(value) {
      this.logDebug(`PID setpoint ${this.setpoint || 'null'} -> ${value}`);
      this.pid.setTarget(value);
      this.setpoint = value;
    },
    setValue(value) {
      this.logDebug(`PID value ${this.value || 'null'} -> ${value}`);
      this.lastCorrection = this.pid.update(value);
      this.value = value;
    },
  }
});

module.exports = PID;
