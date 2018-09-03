const stampit = require('@stamp/it');
const PIDController = require('node-pid-controller');

const { PIDParams, PIDState } = require('../constants/index');
const EventLogger = require('../composables/event_logger');

const PID = stampit.compose(EventLogger, {
  props: {
    PIDController,
  },
  init(pidParams) {
    this.lastCorrection = null;
    this.pid = new this.PIDController({
      k_p: pidParams[PIDParams.PROPORTIONAL_GAIN],
      k_i: pidParams[PIDParams.INTEGRAL_GAIN],
      k_d: pidParams[PIDParams.DERIVATIVE_GAIN],
      i_max: pidParams[PIDParams.INTEGRAL_GAIN],
    });
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
