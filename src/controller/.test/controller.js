const { assert } = require('chai');
const sinon = require('sinon');

const { LogLevel } = require('../../constants');
const Controller = require('../controller');
const TemperatureController = require('../../thermostat/temperature_controller');

const TARGET_TEMP = 152;

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
      const controller = SilentController();
      return controller.setTargetTemperature(TARGET_TEMP)
        .then(() => {
          assert(
            controller.temperatureController.initialize.calledOnce,
            'calls initialize on the temperature controller'
          );
          assert(
            controller.temperatureController.setTemperature.calledOnce,
            'sets temperature on the temperature controller'
          );
        });
    });
  });

  describe('shutdown', () => {
    it('disposes registered pins', () => {
      const controller = SilentController();
      return controller.shutdown()
        .then(() => assert(
          controller.disposeAll.calledOnce,
          'pin register disposes all pins'
        ));
    });
  });
});
