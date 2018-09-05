const { assert } = require('chai');
const sinon = require('sinon');

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

const SilentPID = PID.props({ test: true });
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
      assert.equal(pid.state, PIDState.UNINITIALIZED);
    });

    it('throws when an exception is thrown', () => {
      assert.throws(() => UninitializablePID());
    });
  });

  describe('setTarget', () => {
    it(`has a setpoint and goes to state ${PIDState.READY}`, () => {
      const pid = ValidPID();
      assert.isNull(pid.setpoint);
      pid.setTarget(PID_TARGET);
      assert.equal(pid.setpoint, PID_TARGET);
      assert.equal(pid.state, PIDState.READY);
    });

    it(`goes to state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      assert.equal(pid.state, PIDState.ERROR);
    });
  });

  describe('updateValue', () => {
    it('sets its value and return its state', () => {
      const pid = ValidPID();
      pid.setTarget(PID_TARGET);
      assert.equal(pid.setValue(PID_VALUE), pid.state);
      assert.equal(pid.value, PID_VALUE);
    });

    it(`goes to state ${PIDState.ERROR} when updated without a setpoint`, () => {
      const pid = ValidPID();
      assert.equal(pid.setValue(PID_VALUE), PIDState.ERROR);
    });

    it(`goes to state ${PIDState.ERROR} when an exception is thrown`, () => {
      const pid = BrokePID();
      pid.setTarget(PID_TARGET);
      pid.setValue(PID_VALUE);
      assert.equal(pid.state, PIDState.ERROR);
    });
  });
});
