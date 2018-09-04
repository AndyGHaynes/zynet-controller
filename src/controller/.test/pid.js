const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(chaiAsPromised);
const { expect } = chai;

const { PIDState } = require('../../constants/index');
const PID = require('../pid');

const PID_TARGET = 100;
const PID_VALUE = 50;

const mockPIDController = sinon.stub();
mockPIDController.prototype.setTarget = sinon.stub();
mockPIDController.prototype.update = sinon.stub();

const errorPIDController = sinon.stub();
errorPIDController.prototype.setTarget = sinon.stub().throws();
errorPIDController.prototype.update = sinon.stub().throws();

const SilentPID = PID.props({ error: false });
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
    it(`should be created in state ${PIDState.UNINITIALIZED}`, () => {
      const pid = ValidPID();
      expect(pid.state).to.equal(PIDState.UNINITIALIZED);
    });

    it('should throw when an exception is thrown', () => {
      expect(() => UninitializablePID()).to.throw();
    });
  });

  describe('setTarget', () => {
    it(`should have a setpoint and be in state ${PIDState.READY}`, () => {
      const pid = ValidPID();
      expect(pid.setpoint).to.be.null;
      pid.setTarget(PID_TARGET);
      expect(pid.setpoint).to.equal(PID_TARGET);
      expect(pid.state).to.equal(PIDState.READY);
    });

    it(`should be in state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      expect(pid.state).to.equal(PIDState.ERROR);
    });
  });

  describe('updateValue', () => {
    it('should set its value and return its state', () => {
      const pid = ValidPID();
      pid.setTarget(PID_TARGET);
      expect(pid.setValue(PID_VALUE)).to.equal(pid.state);
      expect(pid.value).to.equal(PID_VALUE);
    });

    it(`should be in state ${PIDState.ERROR} when updated without a setpoint`, () => {
      const pid = ValidPID();
      expect(pid.setValue(PID_VALUE)).to.equal(PIDState.ERROR);
    });

    it(`should be in state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      pid.setValue(PID_VALUE);
      expect(pid.state).to.equal(PIDState.ERROR);
    });
  });
});
