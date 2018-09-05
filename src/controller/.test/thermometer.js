const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const Thermometer = require('../thermometer');

chai.use(chaiAsPromised);
const { assert } = chai;

const SENSOR_ID = 'SENSOR_ID';
const TEMPERATURE = 50;

const SilentThermometer = Thermometer.props({ error: false });
const ValidThermometer = SilentThermometer.props({
  ds18b20: {
    sensorsAsync: () => Promise.resolve([SENSOR_ID]),
    temperatureAsync: () => Promise.resolve(TEMPERATURE),
  },
  sensorId: SENSOR_ID,
});
const BrokeThermometer = SilentThermometer.props({
  ds18b20: {
    sensorsAsync: () => Promise.reject(new Error('No thermometer detected')),
    temperatureAsync: () => Promise.reject(new Error('Could not read temperature')),
  },
  sensorId: null,
});

describe('Thermometer', () => {
  describe('initialize', () => {
    it('sets sensor ID upon initialization', () => {
      const thermometer = ValidThermometer();
      return thermometer.initialize()
        .then(() => assert.equal(thermometer.sensorId, SENSOR_ID));
    });

    it('throws on failed initialization', () => {
      const thermometer = BrokeThermometer();
      return assert.isRejected(thermometer.initialize());
    });
  });

  describe('readTemperature', () => {
    it('returns the current temperature', () => {
      const thermometer = ValidThermometer();
      return assert.becomes(thermometer.readTemperature(), TEMPERATURE);
    });

    it('returns null when an exception is thrown', () => {
      const thermometer = BrokeThermometer();
      return assert.becomes(thermometer.readTemperature(), null);
    });
  });
});
