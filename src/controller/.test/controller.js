const { assert } = require('chai');
const sinon = require('sinon');

const { LogLevel } = require('../../constants');
const Controller = require('../controller');
const TemperatureController = require('../../thermostat/thermostat');

const TARGET_TEMP = 152;

const mockConfig = {
  leds: [],
  relays: [],
  schedule: {
    targetTemperature: TARGET_TEMP,
  },
  thermometer: {
    readIntervalMS: 1000,
  }
};

const SilentController = Controller.props({
  logLevel: LogLevel.SILENT,
  TemperatureController: TemperatureController.methods({
    initialize: sinon.stub().resolves(),
    setTemperature: sinon.stub().resolves(),
  }),
}).methods({
  disposeAll: sinon.stub().resolves(),
});

describe('Controller', () => {
  describe('setTargetTemperature', () => {
    it('initializes the temperature controller and sets target temperature', () => {
      const controller = SilentController(mockConfig);
      return controller.setTargetTemperature(TARGET_TEMP)
        .then(() => {
          assert(
            controller.thermostat.initialize.calledOnce,
            'calls initialize on the temperature controller'
          );
        });
    });
  });

  describe('shutdown', () => {
    it('disposes registered pins', () => {
      const controller = SilentController(mockConfig);
      return controller.shutdown()
        .then(() => assert(
          controller.disposeAll.calledOnce,
          'pin register disposes all pins'
        ));
    });
  });
});
