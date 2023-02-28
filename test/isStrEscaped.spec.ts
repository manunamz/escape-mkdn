import assert from 'node:assert/strict';

import * as escape from '../src';


// note:
// first assertion: illsutrates escaped content are included in escaped results.
// second assertion: illustrates non-escaped content is excluded from escaped results.

describe('isStrEscaped', () => {

  it.skip('backslash', () => {
    assert.strictEqual(
      escape.isStrEscaped('a', 'should escape: \\a', 18),
      true,
    );
    assert.strictEqual(
      escape.isStrEscaped('a', 'should escape: \\a', 12),
      false,
    );
  });

  describe('code', () => {

    it('code block (by indented spaces)', () => {
      assert.strictEqual(
        escape.isStrEscaped('this', '    this should all be code\nthis should not be code', 4),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('this', '    this should all be code\nthis should not be code', 30),
        false,
      );
    });

    it('code fence; backtick', () => {
      assert.strictEqual(
        escape.isStrEscaped('this', '```\nthis should be code\n```\nthis should not be in code\n', 4),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('this', '```\nthis should be code\n```\nthis should not be in code\n', 30),
        false,
      );
    });

    it('code fence; tilde', () => {
      assert.strictEqual(
        escape.isStrEscaped('this', '~~~\nthis should be code\n~~~\nthis should not be in code\n', 4),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('this', '~~~\nthis should be code\n~~~\nthis should not be in code\n', 30),
        false,
      );
    });

    it('code span', () => {
      assert.strictEqual(
        escape.isStrEscaped('here', 'here is some text and `here is some code`.', 23),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('here', 'here is some text and `here is some code`.', 0),
        false,
      );
    });

  });

  describe('math', () => {

    it('math fence', () => {
      assert.strictEqual(
        escape.isStrEscaped('this', '$$\nthis should be math\n$$\nthis should not be math\n', 4),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('this', '$$\nthis should be math\n$$\nthis should not be math\n', 25),
        false,
      );
    });

    it('math span', () => {
      assert.strictEqual(
        escape.isStrEscaped('here', 'here is some text and $here is some math$.', 23),
        true,
      );
      assert.strictEqual(
        escape.isStrEscaped('here', 'here is some text and $here is some math$.', 0),
        false,
      );
    });

  });

});