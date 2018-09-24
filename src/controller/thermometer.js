const stampit = require('@stamp/it');
const Promise = require('bluebird');
const ds18b20 = Promise.promisifyAll(require('ds18b20'));
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const { EventType } = require('../constants');

const Thermometer = stampit.compose(EventLogger, {
  props: {
    ds18b20,
    sensorId: null,
  },
  methods: {
    logThermometerError(error) {
      this.logThermometerEvent(EventType.THERMOMETER_INITIALIZED);
    },
    logThermometerEvent(event, temperature, error) {
      this.logEvent(event, {
        error,
        temperature,
        ..._.pick(this, 'sensorId', 'ds18b20'),
      });
    },
    initialize() {
      return this.ds18b20.sensorsAsync()
        .then((ids) => _.isArray(ids) && (this.sensorId = ids[0]))
        .then(() => this.logThermometerEvent(EventType.THERMOMETER_INITIALIZED, null))
        .tapCatch((e) => this.logThermometerError(e));
    },
    readTemperature() {
      this.logDebug(`reading thermometer ${this.sensorId}`);
      return this.ds18b20.temperatureAsync(this.sensorId)
        .tap((temperature) => this.logThermometerEvent(EventType.THERMOMETER_READ, temperature))
        .tapCatch((e) => this.logThermometerError(e))
        .catchReturn(null);
    }
  }
});

module.exports = Thermometer;
