'use strict';
const parseBash = require('bash-parser');

function parse(text, parsers, opts) {
  const inMarkdown = opts && opts.parentParser === 'markdown';

  if (!text && inMarkdown) {
    return '';
  }

  let ast;
  try {
    ast = parseBash(text, {
      insertLOC: true,
    });
  } catch (err) {
    // err.loc = {
    //   start: {
    //     line: err.lineNumber,
    //     column: err.columnNumber,
    //   },
    // };

    throw err;
  }

  return ast;
}

module.exports = parse;
