const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const _ = require('lodash');
const PIDController = require('node-pid-controller');

const { EventType, PIDState } = require('../constants');
const EventLogger = require('../composables/event_logger');

const PID = stampit(Configure.noPrivatize(), EventLogger, {
  configuration: {
    PIDController,
  },
  props: {
    kP: null,
    kI: null,
    kD: null,
  },
  init() {
    this.lastCorrection = null;
    this.pid = new this.config.PIDController({
      k_p: this.kP,
      k_i: this.kI,
      k_d: this.kD,
      i_max: this.kI,
    });
    this.logPIDEvent(EventType.PID_PARAMETERS_SET);
    this.setpoint = null;
    this.state = PIDState.UNINITIALIZED;
    this.value = null;
  },
  methods: {
    getState() {
      return this.state;
    },

    logPIDEvent(event, error) {
      this.logEvent(event, {
        error,
        ..._.assign(
          _.pick(this, 'setpoint', 'state', 'value'), {
            lastCorrection: _.round(this.lastCorrection, 3),
          }
        ),
      });
    },

    setTarget(value) {
      try {
        if (this.setpoint === null) {
          this.setState(PIDState.READY);
        }
        this.setpoint = value;
        this.pid.setTarget(value);
        this.logPIDEvent(EventType.PID_TARGET_SET);
      } catch (e) {
        this.logPIDEvent(EventType.PID_ERROR, e);
        this.setState(PIDState.ERROR);
      }
    },

    setState(pidState) {
      this.state = pidState;
    },

    setValue(value) {
      try {
        if (this.setpoint === null) {
          throw new Error('Cannot update PID value without a setpoint');
        }
        this.lastCorrection = this.pid.update(value);
        this.value = value;
        this.setState(this.lastCorrection > 0 ? PIDState.UNDER : PIDState.OVER);
        this.logPIDEvent(EventType.PID_VALUE_CHANGED);
      } catch (e) {
        this.logPIDEvent(EventType.PID_ERROR, e);
        this.setState(PIDState.ERROR);
      }
      return this.state;
    },
  }
});

module.exports = PID;
