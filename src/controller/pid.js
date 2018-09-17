const stampit = require('@stamp/it');
const PIDController = require('node-pid-controller');

const { PIDParams, PIDState } = require('../constants');
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
    this.state = PIDState.UNINITIALIZED;
    this.value = null;
  },
  methods: {
    setTarget(value) {
      this.logDebug(`PID setpoint ${this.setpoint || 'null'} -> ${value}`);
      try {
        this.pid.setTarget(value);
        if (this.setpoint === null) {
          this.setState(PIDState.READY);
        }
        this.setpoint = value;
      } catch (e) {
        this.logError(e);
        this.setState(PIDState.ERROR);
      }
    },
    setState(pidState) {
      this.logDebug(`PID state ${this.state} -> pidState`);
      this.state = pidState;
    },
    setValue(value) {
      this.logDebug(`PID value ${this.value || 'null'} -> ${value}`);
      try {
        if (this.setpoint === null) {
          throw new Error('Cannot update PID value without a setpoint');
        }
        this.lastCorrection = this.pid.update(value);
        this.value = value;
        this.setState(this.lastCorrection > 0 ? PIDState.ON : PIDState.OFF);
      } catch (e) {
        this.logError(e);
        this.setState(PIDState.ERROR);
      }
      return this.state;
    },
  }
});

module.exports = PID;
