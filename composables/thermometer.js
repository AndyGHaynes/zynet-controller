const stampit = require('@stamp/it');
const Promise = require('bluebird');
const ds18b20 = Promise.promisifyAll(require('ds18b20'));
const _ = require('lodash');

const EventLogger = require('./event_logger');

const Thermometer = stampit.compose(EventLogger, {
  props: {
    ds18b20,
  },
  init() {
    this.sensorId = null;
  },
  methods: {
    initialize() {
      this.logDebug('initializing thermometer');
      return this.ds18b20.sensorsAsync()
        .then((ids) => _.isArray(ids) && (this.sensorId = ids[0]))
        .catch(this.logError);
    },
    readTemperature() {
      this.logDebug(`reading thermometer ${this.sensorId}`);
      return this.ds18b20.temperatureAsync(this.sensorId)
        .then((temperature) => this.sensorId && ((temperature * (9 / 5)) + 32))
        .catch(this.logError);
    }
  }
});

module.exports = Thermometer;
