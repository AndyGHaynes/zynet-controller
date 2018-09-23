const stampit = require('@stamp/it');
const Promise = require('bluebird');
const _ = require('lodash');

const { PIDState } = require('../constants');
const EventLogger = require('../composables/event_logger');
const PID = require('./pid');
const Thermometer = require('./thermometer');

const TemperatureController = stampit.compose(EventLogger, {
  props: {
    PID,
    Thermometer,
  },
  init({ pidParams, relays, targetTemperature }) {
    this.lastRead = null;
    this.pid = new this.PID(pidParams);
    this.relays = relays;
    this.sensorId = null;
    this.targetTemperature = targetTemperature;
    this.thermometer = this.Thermometer.props({ logLevel: this.logLevel })();
  },
  methods: {
    getTemperature() {
      return this.lastRead;
    },
    initialize() {
      if (this.sensorId !== null) {
        return Promise.resolve();
      }
      return this.thermometer.initialize()
        .tap((sensorId) => this.logDebug(`thermometer ${sensorId} online`))
        .then((sensorId) => this.sensorId = sensorId)
        .catch(this.logError);
    },
    readTemperature() {
      return this.thermometer.readTemperature()
        .tap((temperature) => this.setLastRead(temperature))
        .return()
        .catch(this.logError);
    },
    setLastRead(temperature) {
      this.lastRead = { temperature, readAt: new Date() };
    },
    setRelays(pidState) {
      _.map(this.relays, (relay, i) => {
        switch (pidState) {
          case PIDState.ON:
            relay.on();
            break;
          case PIDState.OFF:
            relay.off();
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
      this.pid.setTarget(temperature);
    },
    update() {
      this.readTemperature()
        .then((temperature) => {
          this.pid.setValue(temperature);
          this.setRelays(this.pid.getState());
        })
        .catch(this.logError);
    },
  }
});

module.exports = TemperatureController;
