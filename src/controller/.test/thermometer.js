const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
chai.should();

const Thermometer = require('../thermometer');

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
    it('should set sensor ID upon initialization', () => {
      const thermometer = ValidThermometer();
      return thermometer.initialize()
        .then(() => expect(thermometer.sensorId).to.equal(SENSOR_ID));
    });
    it('should throw on failed initialization', () => {
      const thermometer = BrokeThermometer();
      return thermometer.initialize().should.be.rejected;
    });
  });

  describe('readTemperature', () => {
    it('should return the current temperature', () => {
      const thermometer = ValidThermometer();
      return thermometer.readTemperature().should.eventually.equal(TEMPERATURE);
    });
    it('should return null when an exception is thrown', () => {
      const thermometer = BrokeThermometer();
      return thermometer.readTemperature().should.eventually.be.null;
    });
  });
});
