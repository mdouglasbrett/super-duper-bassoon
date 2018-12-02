/* eslint-env node, mocha */
const assert = require('assert');
const { promisifiedDirectoryReader } = require('../dist/main.cjs');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('Directory Reader', () => {
  it('should return true', () =>
    assert.equal(promisifiedDirectoryReader(), true));
});
