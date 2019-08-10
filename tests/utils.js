const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

sinon.usingPromise(Promise);

chai.use(chaiAsPromised);

const { assert } = chai;

module.exports = {
  assert,
  sinon,
};
