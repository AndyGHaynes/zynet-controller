const stampit = require('@stamp/it');
const _ = require('lodash');

const { PIDState } = require('../constants/index');
const EventLogger = require('../composables/event_logger');
const PID = require('./pid');
const Thermometer = require('./thermometer');

const TemperatureController = stampit.compose(EventLogger, {
  props: {
    PID,
    Thermometer,
  },
  init(pidParams, relays, targetTemperature) {
    this.lastRead = null;
    this.pid = new this.PID(pidParams);
    this.relays = relays;
    this.targetTemperature = targetTemperature;
    this.thermometer = this.Thermometer.props({ debug: this.debug })();
  },
  methods: {
    getTemperature() {
      return this.lastRead;
    },
    initialize() {
      this.pid.setTarget(this.targetTemperature);
      return this.thermometer.initialize()
        .then((sensorId) => this.logDebug(`thermometer ${sensorId} online`))
        .catch(this.logError);
    },
    readTemperature() {
      return this.thermometer.readTemperature()
        .tap((temperature) => this.setLastRead(temperature))
        .return()
        .catch(this.logError);
    },
    setLastRead(temperature) {
      return { temperature, readAt: new Date() };
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
