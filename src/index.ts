export type { RegExpMatchResult } from './types';


// add escape chars where char
// is also a regex reserved char
export function esc(str: string) {
  // from: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  // todo? https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js#L10
  // .replace(/-/g, '\\x2d');
}

// esc char
// export const BACKSLASH        : RegExp = /\\.{1}/g;
// code
export const CODE_BLOCK       : RegExp = /(^( {4,}|\t)[^\r\n]*$)/gm;
export const CODE_FENCE_BTICK : RegExp = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;
export const CODE_FENCE_TILDE : RegExp = /^( {0,3}|\t)~~~[^`\r\n]*$[\w\W]+?^( {0,3}|\t)~~~ *$/gm;
export const CODE_SPAN        : RegExp = /`[^`\r\n]+`(?!``)/g;
// math
export const MATH_FENCE       : RegExp = /^( {0,3}|\t)\$\$[^$\r\n]*$[\w\W]+?^( {0,3}|\t)\$\$ *$/gm;
export const MATH_SPAN        : RegExp = /\$[^$\r\n]+\$(?!\$\$)/g;

export const calcEscIndices = (regex: RegExp, content: string): number[] => {
  const indices: number[] = [] as number[];
  // 🦨 do-while: https://stackoverflow.com/a/6323598
  let match: RegExpExecArray | null;
  do {
    match = regex.exec(content);
    if (match) {
      for (let i = match.index; i < (match.index + match[0].length); i++) {
        indices.push(i);
      }
    }
  } while (match);
  return indices;
};

export const getEscIndices = (content: string): number[] => {
  /* eslint-disable indent */
  return ([] as number[])
          // .concat(calcEscIndices(BACKSLASH, content))
          .concat(calcEscIndices(CODE_BLOCK, content))
          .concat(calcEscIndices(CODE_FENCE_BTICK, content))
          .concat(calcEscIndices(CODE_FENCE_TILDE, content))
          .concat(calcEscIndices(CODE_SPAN, content))
          .concat(calcEscIndices(MATH_FENCE, content))
          .concat(calcEscIndices(MATH_SPAN, content));
  /* eslint-enable indent */
};

export const isIndexEscaped = (index: number, content: string): boolean => {
  return getEscIndices(content).includes(index);
};

export const isStrEscaped = (
  str: string,
  content: string,
  offset: number = 0,
  escIndices: number[] = [],
): boolean => {
  if (escIndices.length === 0) {
    escIndices = getEscIndices(content);
  }
  // 'str' range
  const start: number = (offset);
  const end: number = (offset + str.length);
  // check for escapes
  for (let i = start; i <= end; i++) {
    if (escIndices.includes(i)) { return true; }
  }
  return false;
};
