import assert from 'node:assert/strict';

import * as escape from '../src';


describe('getEscIndices', () => {

  it.skip('backslash', () => {
    assert.deepStrictEqual(
      escape.getEscIndices('should escape: \\a'),
      [15, 16],
    );
  });

  describe('code', () => {

    it('code block (by indented spaces)', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('    this should all be code'),
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      );
    });

    it('code fence; backtick', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('```\nthis should be code\n```\nthis should not be in code\n'),
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      );
    });

    it('code fence; tilde', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('~~~\nthis should be code\n~~~\nthis should not be in code\n'),
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      );
    });

    it('code span', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('here is some text and `here is some code`.'),
        [22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
      );
    });

  });

  describe('math', () => {

    it('code fence', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('$$\nthis should be math\n$$\nthis should not be math\n'),
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      );
    });

    it('code span', () => {
      assert.deepStrictEqual(
        escape.getEscIndices('here is some text and $here is some math$.'),
        [22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
      );
    });

  });

});
