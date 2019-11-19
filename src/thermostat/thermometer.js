const stampit = require('@stamp/it');
const Promise = require('bluebird');
const ds18b20 = Promise.promisifyAll(require('ds18b20'));
const _ = require('lodash');

const EventLogger = require('../composables/event_logger');
const { EventType } = require('../constants');

const SENSOR_ID_NOT_FOUND = 'not found.';

const Thermometer = stampit.compose(EventLogger, {
  props: {
    ds18b20,
    sensorId: null,
  },
  methods: {
    logThermometerError(error) {
      this.logThermometerEvent(EventType.THERMOMETER_ERROR, null, error);
    },

    logThermometerEvent(event, temperature, error) {
      this.logEvent(event, {
        error,
        temperature,
        ..._.pick(this, 'sensorId'),
      });
    },

    initialize() {
      return this.ds18b20.sensorsAsync()
        .then((ids) => {
          const sensorId = _.get(ids, '0', SENSOR_ID_NOT_FOUND);
          if (sensorId === SENSOR_ID_NOT_FOUND) {
            throw new Error('No sensor ID found');
          }
          this.sensorId = sensorId;
        })
        .then(() => this.logThermometerEvent(EventType.THERMOMETER_INITIALIZED, null))
        .tapCatch((e) => this.logThermometerError(e));
    },

    readTemperature() {
      if (!this.sensorId) {
        this.logThermometerError(new Error('No initialized thermometers'));
        return Promise.resolve(null);
      }
      return this.ds18b20.temperatureAsync(this.sensorId)
        .tap((temperature) => this.logThermometerEvent(EventType.THERMOMETER_READ, temperature))
        .tapCatch((e) => this.logThermometerError(e))
        .catchReturn(null);
    }
  }
});

module.exports = Thermometer;
