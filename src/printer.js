'use strict';

const {
  concat,
  join,
  line,
  group,
  indent,
  ifBreak,
  hardline,
  softline,
} = require('prettier').doc.builders;
const { willBreak } = require('prettier').doc.utils;
// const {
//   isNextLineEmpty,
//   isNextLineEmptyAfterIndex,
//   getNextNonSpaceNonCommentCharacterIndex,
//   hasNewline,
//   hasNewlineInRange,
// } = require('prettier').util;
const comments = require('./comments');

function genericPrint(path, options, print) {
  const node = path.getValue();

  return printNode(path, options, print);
}

function printNode(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case 'Script': {
      return concat([
        '#!/bin/bash -eu',
        hardline,
        hardline,
        concat(path.map(print, 'commands')),
      ]);
    }
    case 'Command': {
      // console.log(node);
      return concat([
        path.call(print, 'name'),
        ' ',
        join(' ', path.map(print, 'suffix')),
      ]);
    }
    case 'Word': {
      if (/ /.test(node.text)) {
        return `"${node.text}"`;
      }
      return node.text;
    }
    default:
      // istanbul ignore next
      throw new Error(`Have not implemented type "${node.type}".`);
  }
}

module.exports = genericPrint;
