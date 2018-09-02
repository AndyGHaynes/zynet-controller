const stampit = require('@stamp/it');
const Promise = require('bluebird');
const ds18b20 = Promise.promisifyAll(require('ds18b20'));
const _ = require('lodash');

const Thermometer = stampit({
  props: {
    debug: false,
    ds18b20,
  },
  init() {
    this.sensorId = null;
  },
  methods: {
    initialize() {
      return this.ds18b20.sensorsAsync()
        .then((ids) => _.isArray(ids) && (this.sensorId = ids[0]))
        .catch((e) => console.log(e));
    },
    readTemperature() {
      return this.ds18b20.temperatureAsync(this.sensorId)
        .then((temperature) => this.sensorId && ((temperature * (9 / 5)) + 32))
        .catch((e) => console.log(e));
    }
  }
});

module.exports = Thermometer;
