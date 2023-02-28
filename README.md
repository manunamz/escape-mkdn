# escape-mkdn

A little utility to find escaped ranges in markdown files -- useful for narrowing results when parsing with regex.

## Install

Install with [npm](https://docs.npmjs.com/cli/v9/commands/npm-install):

```
npm install escape-mkdn
```

## What Is This For?

If you're parsing markdown with some regular expressions instead of a proper parser, match results will sometimes be too greedy:

```markdown
Here is some text with a [[wikilink]] -- we want this to be parsed.

Here is some text with an `escaped [[wikilink]]` -- we do not want this to be parsed.
```

Simple regular expressions will capture both [[wikilink]] instances, which is potentially not what we want if we are, say, searching for active wikilinks to make them clickable. The `escape-mkdn` utility will find the `escaped [[wikilink]]`, so when we perform our regex match we can check the escaped results to identify matches we want to ignore.

## Use

The previous example might then be searched in the following manner:

```js
import { escapedIndices } from 'escape-mkdn';


let content: string = `
Here is some text with a [[wikilink]] -- we want this to be parsed.

Here is some text with an \`escaped [[wikilink]]\` -- we do not want this to be parsed.
`;

let escapedIndices: number[] = escIndices(content);

let match: RegExpExecArray | null;
do {
    match = RGX.WIKI.LINK.exec(content);
    if (match) {
        // only print results if the match was not escaped
        if (!escapedIndices.includes(match.index)) {
            console.log(match);
        }
    }
} while (match);
```

## API

### `isIndexEscaped(content: string, index: number): boolean`

Returns `true` if the index is inside of an escaped range in the given `content` string or `false` if not.

#### Parameters

##### `content: string`

A string representing the content to search.

##### `index: number`

A number representing an index

### `isStrEscaped(str: string, content: string, offset: number = 0, escIndices: number[] = []): boolean`

Returns `true` if the given string is escaped in the given content string. The first instance of the `str` will be used unless an `offset` is given, in which case the first instance after the offset will be inspected.

#### Parameters

##### `str: string`

The string to check if is within an escaped range.

##### `content: string`

A content string to search.

##### `offset: number = 0`

An offset to start from -- this is useful when there may be multiple instances of the given `str`, but instances that occur later in `content` are to be inspected. The default is 0.

##### `escIndices: number[] = []`

The indices to check the target `str` against for escape status. It is useful to provide this array when calling this function multiple times over the same `content`. The default is an empty array that is populated dynamically from the given `content` string.

### `escIndices(content: string): number[]`

Returns an array of numbers that represent all indices that are escaped in the given `content` string (includes indices of the escape chars themselves).

#### Parameters

##### `content: string`

### `esc(str: string): string`

An extra utility to escape regex reserved chars in a given string (similar to [`escape-regex-str`](https://github.com/sindresorhus/escape-string-regexp)).


#### Parameters

##### `str: string`

The string containing regular expression characters to be escaped.

## Escape Types

The following are examples of escape types this module will search for. Ranges will include the escape characters themselves as well as the content within in the escaped range.

### Code Blocks

```markdown
    indented by 4+ spaces or a tab
```

### Code Fences

~~~markdown
```
...with backticks
```
~~~

```markdown
~~~
...with tildes
~~~
```

### Code Spans

```markdown
Some text with a `code span`.
```

### Math Fences

```markdown
$$
...with dollar signs.
$$
```

### Math spans

```
$Some text with a $math span$.
```

