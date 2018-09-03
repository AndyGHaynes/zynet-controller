const stampit = require('@stamp/it');
const Promise = require('bluebird');
const ds18b20 = Promise.promisifyAll(require('ds18b20'));
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');

const Thermometer = stampit.compose(EventLogger, {
  props: {
    ds18b20,
    sensorId: null,
  },
  methods: {
    initialize() {
      this.logDebug('initializing thermometer');
      return this.ds18b20.sensorsAsync()
        .then((ids) => _.isArray(ids) && (this.sensorId = ids[0]));
    },
    readTemperature() {
      this.logDebug(`reading thermometer ${this.sensorId}`);
      return this.ds18b20.temperatureAsync(this.sensorId)
        .then((temperature) => this.sensorId && temperature)
        .catch((e) => {
          this.logError(e);
          return null;
        });
    }
  }
});

module.exports = Thermometer;
