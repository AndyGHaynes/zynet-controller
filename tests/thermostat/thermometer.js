const { LogLevel } = require('../../src/constants/index');
const Thermometer = require('../../src/thermostat/thermometer');
const { expect, sinon } = require('../utils');

const SENSOR_ID = 'SENSOR_ID';
const TEMPERATURE = 50;

const SilentThermometer = Thermometer.props({ logLevel: LogLevel.SILENT });
const ValidThermometer = SilentThermometer.conf({
  ds18b20: {
    sensorsAsync: sinon.stub().resolves([SENSOR_ID]),
    temperatureAsync: sinon.stub().resolves(TEMPERATURE),
  },
  sensorId: SENSOR_ID,
});
const BrokeThermometer = SilentThermometer.conf({
  ds18b20: {
    sensorsAsync: sinon.stub().rejects(),
    temperatureAsync: sinon.stub().rejects(),
  },
  sensorId: null,
});

describe('Thermometer', () => {
  describe('initialize', () => {
    it('sets sensor ID upon initialization', () => {
      const thermometer = ValidThermometer();
      return thermometer.initialize()
        .then(() => expect(thermometer.sensorId).equal(SENSOR_ID));
    });

    it('throws on failed initialization', () => {
      const thermometer = BrokeThermometer();
      return expect(thermometer.initialize()).rejected;
    });
  });

  describe('readTemperature', () => {
    it('returns the current temperature', () => {
      const thermometer = ValidThermometer();
      return expect(thermometer.readTemperature()).become(TEMPERATURE);
    });

    it('returns null when an exception is thrown', () => {
      const thermometer = BrokeThermometer();
      return expect(thermometer.readTemperature()).become(null);
    });
  });
});
