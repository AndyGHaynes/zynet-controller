const Configure = require('@stamp/configure');
const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');

const { PIDParams, PIDState } = require('../constants');
const EventLogger = require('../composables/event_logger');
const PID = require('./pid');
const Thermometer = require('./thermometer');

const Thermostat = stampit(Configure.noPrivatize(), EventLogger, {
  configuration: {
    PID,
    Thermometer,
  },
  init({ pidParams, relays, targetTemperature }) {
    this.lastRead = null;
    this.pid = this.config.PID.props({
      logLevel: this.logLevel,
      kP: pidParams[PIDParams.PROPORTIONAL_GAIN],
      kI: pidParams[PIDParams.INTEGRAL_GAIN],
      kD: pidParams[PIDParams.DERIVATIVE_GAIN],
    })();
    this.relays = relays;
    this.sensorId = null;
    this.thermometer = this.config.Thermometer.props({ logLevel: this.logLevel })();
    if (targetTemperature) {
      this.setTemperature(targetTemperature);
    }
  },
  methods: {
    initialize() {
      if (this.isInitialized()) {
        return Promise.resolve();
      }
      return this.thermometer.initialize()
        .then((sensorId) => this.sensorId = sensorId);
    },

    isInitialized() {
      return this.sensorId !== null;
    },

    readTemperature() {
      return this.thermometer.readTemperature()
        .tap((temperature) => this.setLastRead(temperature))
        .catch(this.logError);
    },

    getLastUpdate() {
      return this.last_read || null;
    },

    setLastRead(temperature) {
      this.last_read = {
        read_at: moment().utc().format(),
        temperature,
      };
    },

    setRelays(pidState) {
      _.each(this.relays, (relay, i) => {
        switch (pidState) {
          case PIDState.OVER:
            if (relay.isOn()) {
              relay.off();
            }
            break;
          case PIDState.UNDER:
            if (!relay.isOn()) {
              relay.on();
            }
            break;
          default:
            this.logError(`could not update relay ${i}`, {
              state: relay.getState(),
              temperature,
            });
        }
      });
    },

    setTemperature(temperature) {
      this.targetTemperature = temperature;
      this.pid.setTarget(temperature);
    },

    update() {
      return this.readTemperature()
        .tap((temperature) => {
          this.pid.setValue(temperature);
          this.setRelays(this.pid.getState());
        })
        .catch(this.logError);
    },
  },
});

module.exports = Thermostat;
