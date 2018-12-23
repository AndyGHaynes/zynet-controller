const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');

const { PIDState } = require('../constants');
const EventLogger = require('../composables/event_logger');
const PID = require('./pid');
const Thermometer = require('./thermometer');

const Thermostat = stampit.compose(EventLogger, {
  props: {
    PID,
    Thermometer,
  },
  init({ pidParams, relays, targetTemperature }) {
    this.lastRead = null;
    this.pid = this.PID.props({ logLevel: this.logLevel })(pidParams);
    this.relays = relays;
    this.sensorId = null;
    this.thermometer = this.Thermometer.props({ logLevel: this.logLevel })();
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
    setLastRead(temperature) {
      this.lastRead = { temperature, readAt: new Date() };
    },
    setRelays(pidState) {
      _.map(this.relays, (relay, i) => {
        switch (pidState) {
          case PIDState.OVER:
            relay.off();
            break;
          case PIDState.UNDER:
            relay.on();
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
  }
});

module.exports = Thermostat;
