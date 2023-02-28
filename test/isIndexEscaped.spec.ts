import assert from 'node:assert/strict';

import * as escape from '../src';


// note:
// first assertion: illustrates escape chars themselves are included in escaped results.
// second assertion: illsutrates escaped content are included in escaped results.
// third assertion: illustrates non-escaped content is excluded from escaped results.

describe('isIndexEscaped', () => {

  it.skip('backslash', () => {
    assert.strictEqual(
      escape.isIndexEscaped(15, 'should escape: \\a'),
      true,
    );
    assert.strictEqual(
      escape.isIndexEscaped(16, 'should escape: \\a'),
      true,
    );
    assert.strictEqual(
      escape.isIndexEscaped(0, 'should escape: \\a'),
      false,
    );
  });

  describe('code', () => {

    it('code block (by indented spaces)', () => {
      assert.strictEqual(
        escape.isIndexEscaped(0, '    this should all be code\nthis should not be code'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(4, '    this should all be code\nthis should not be code'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(30, '    this should all be code\nthis should not be code'),
        false,
      );
    });

    it('code fence; backtick', () => {
      assert.strictEqual(
        escape.isIndexEscaped(0, '```\nthis should be code\n```\nthis should not be in code\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(5, '```\nthis should be code\n```\nthis should not be in code\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(30, '```\nthis should be code\n```\nthis should not be in code\n'),
        false,
      );
    });

    it('code fence; tilde', () => {
      assert.strictEqual(
        escape.isIndexEscaped(0, '~~~\nthis should be code\n~~~\nthis should not be in code\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(4, '~~~\nthis should be code\n~~~\nthis should not be in code\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(30, '~~~\nthis should be code\n~~~\nthis should not be in code\n'),
        false,
      );
    });

    it('code span', () => {
      assert.strictEqual(
        escape.isIndexEscaped(22, 'here is some text and `here is some code`.'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(23, 'here is some text and `here is some code`.'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(0, 'here is some text and `here is some code`.'),
        false,
      );
    });

  });

  describe('math', () => {

    it('fence', () => {
      assert.strictEqual(
        escape.isIndexEscaped(0, '$$\nthis should be math\n$$\nthis should not be math\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(3, '$$\nthis should be math\n$$\nthis should not be math\n'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(26, '$$\nthis should be math\n$$\nthis should not be math\n'),
        false,
      );
    });

    it('span', () => {
      assert.strictEqual(
        escape.isIndexEscaped(22, 'here is some text and $here is some math$.'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(23, 'here is some text and $here is some math$.'),
        true,
      );
      assert.strictEqual(
        escape.isIndexEscaped(0, 'here is some text and $here is some math$.'),
        false,
      );
    });

  });

});
