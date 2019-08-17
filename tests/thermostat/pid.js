const { expect, sinon } = require('../utils');

const { LogLevel, PIDState } = require('../../src/constants/index');
const PID = require('../../src/thermostat/pid');

const PID_TARGET = 100;
const PID_VALUE = 50;

const mockPIDController = sinon.stub();
mockPIDController.prototype.setTarget = sinon.stub();
mockPIDController.prototype.update = sinon.stub();

const errorPIDController = sinon.stub();
errorPIDController.prototype.setTarget = sinon.stub().throws();
errorPIDController.prototype.update = sinon.stub().throws();

const SilentPID = PID.props({ logLevel: LogLevel.SILENT });
const ValidPID = SilentPID.props({
  PIDController: mockPIDController,
});
const BrokePID = SilentPID.props({
  PIDController: errorPIDController,
});
const UninitializablePID = SilentPID.props({
  PIDController: sinon.stub().throws(),
});

describe('PID', () => {
  describe('initialize', () => {
    it(`is created in state ${PIDState.UNINITIALIZED}`, () => {
      const pid = ValidPID();
      expect(pid.state).equal(PIDState.UNINITIALIZED);
    });

    it('throws when an exception is thrown', () => {
      expect(() => UninitializablePID()).throw();
    });
  });

  describe('setTarget', () => {
    it(`has a setpoint and goes to state ${PIDState.READY}`, () => {
      const pid = ValidPID();
      expect(pid.setpoint).null;
      pid.setTarget(PID_TARGET);
      expect(pid.setpoint).equal(PID_TARGET);
      expect(pid.state).equal(PIDState.READY);
    });

    it(`goes to state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      expect(pid.state).equal(PIDState.ERROR);
    });
  });

  describe('setValue', () => {
    it('sets its value and return its state', () => {
      const pid = ValidPID();
      pid.setTarget(PID_TARGET);
      expect(pid.setValue(PID_VALUE)).equal(pid.state);
      expect(pid.value).equal(PID_VALUE);
    });

    it(`goes to state ${PIDState.ERROR} when updated without a setpoint`, () => {
      const pid = ValidPID();
      expect(pid.setValue(PID_VALUE)).equal(PIDState.ERROR);
    });

    it(`goes to state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      pid.setValue(PID_VALUE);
      expect(pid.state).equal(PIDState.ERROR);
    });
  });
});
