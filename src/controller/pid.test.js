const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(chaiAsPromised);
const { expect } = chai;
chai.should();

const { PIDState } = require('../constants');
const PID = require('./pid');

const PID_TARGET = 100;
const PID_VALUE = 50;

const mockPIDController = sinon.fake();
mockPIDController.prototype.setTarget = sinon.fake();
mockPIDController.prototype.update = sinon.fake();

const errorPIDController = sinon.stub();
errorPIDController.prototype.setTarget = sinon.stub().throws();
errorPIDController.prototype.update = sinon.stub().throws();

const validPID = PID.props({
  PIDController: mockPIDController,
});

const errorPID = PID.props({
  PIDController: errorPIDController,
});

const uninitializablePID = PID.props({
  PIDController: sinon.stub().throws(),
});

describe('PID', () => {
  describe('initialize', () => {
    it(`should be created in state ${PIDState.UNINITIALIZED}`, () => {
      const pid = validPID();
      expect(pid.state).to.equal(PIDState.UNINITIALIZED);
    });

    it('should throw when an exception is thrown', () => {
      expect(() => uninitializablePID()).to.throw();
    });
  });

  describe('setTarget', () => {
    it(`should have a setpoint and be in state ${PIDState.READY}`, () => {
      const pid = validPID();
      expect(pid.setpoint).to.be.null;
      pid.setTarget(PID_TARGET);
      expect(pid.setpoint).to.equal(PID_TARGET);
      expect(pid.state).to.equal(PIDState.READY);
    });

    it(`should be in state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = errorPID();
      pid.setTarget(PID_TARGET);
      expect(pid.state).to.equal(PIDState.ERROR);
    });
  });

  describe('updateValue', () => {
    it('should set its value and return its state', () => {
      const pid = validPID();
      pid.setTarget(PID_TARGET);
      expect(pid.setValue(PID_VALUE)).to.equal(pid.state);
      expect(pid.value).to.equal(PID_VALUE);
    });

    it(`should be in state ${PIDState.ERROR} when updated without a setpoint`, () => {
      const pid = validPID();
      expect(pid.setValue(PID_VALUE)).to.equal(PIDState.ERROR);
    });

    it(`should be in state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = errorPID();
      pid.setTarget(PID_TARGET);
      pid.setValue(PID_VALUE);
      expect(pid.state).to.equal(PIDState.ERROR);
    });
  });
});
