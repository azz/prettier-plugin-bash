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
// const {
//   isNextLineEmpty,
//   isNextLineEmptyAfterIndex,
//   getNextNonSpaceNonCommentCharacterIndex,
//   hasNewline,
//   hasNewlineInRange,
// } = require('prettier').util;

const lineContinuation = ifBreak(concat([' \\', softline]), ' ');

function printNode(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case 'Script': {
      return concat([
        '#!/bin/bash -eu', // TODO: use original shebang
        hardline,
        hardline,
        join(hardline, path.map(print, 'commands')),
      ]);
    }
    case 'Command': {
      const parts = [];

      if (node.prefix) {
        parts.push(join(lineContinuation, path.map(print, 'prefix')));
      }

      if (node.name) {
        parts.push(path.call(print, 'name'));
      }

      if (node.suffix) {
        parts.push(
          indent(
            concat([
              lineContinuation,
              join(lineContinuation, path.map(print, 'suffix')),
            ]),
          ),
        );
      }

      // parts.push(hardline);

      return group(concat(parts));
    }
    case 'Word': {
      if (/\n/.test(node.text)) {
        return `'${node.text}'`;
      }
      if (/ /.test(node.text)) {
        return `"${node.text}"`;
      }
      return node.text;
    }
    case 'AssignmentWord': {
      return concat([
        node.text.substring(0, node.text.indexOf('=')),
        '=',
        concat(path.map(print, 'expansion')),
      ]);
    }
    case 'ParameterExpansion': {
      return concat(['${', String(node.parameter), '}']);
    }
    case 'LogicalExpression': {
      return concat([
        group(path.call(print, 'left')),
        indent(
          concat([
            lineContinuation,
            group(
              concat([
                printOperator(node.op),
                lineContinuation,
                path.call(print, 'right'),
              ]),
            ),
          ]),
        ),
      ]);
    }
    case 'Pipeline': {
      return indent(
        join(concat([' |', lineContinuation]), path.map(print, 'commands')),
      );
    }
    case 'Redirect': {
      return concat([
        node.numberIo ? path.call(print, 'numberIo') : '',
        path.call(print, 'op'),
        path.call(print, 'file'),
      ]);
    }
    case 'If': {
      return concat([
        'if ',
        path.call(print, 'clause'),
        '; then',
        group(indent(concat([hardline, path.call(print, 'then')]))),
        node.else
          ? concat([
              hardline,
              'else',
              indent(concat([hardline, path.call(print, 'else')])),
              hardline,
            ])
          : '',
        'fi',
        hardline,
      ]);
    }
    case 'For': {
      return concat([
        'for ',
        path.call(print, 'name'),
        ' in ',
        concat(path.map(print, 'wordlist')),
        '; do',
        group(indent(concat([hardline, path.call(print, 'do')]))),
        hardline,
        'done',
        hardline,
      ]);
    }
    case 'While': {
      return concat([
        'while ',
        path.call(print, 'clause'),
        '; do',
        group(indent(concat([hardline, path.call(print, 'do')]))),
        hardline,
        'done',
        hardline,
      ]);
    }
    case 'CompoundList': {
      return join(hardline, path.map(print, 'commands'));
    }
    case 'Name': {
      return node.text;
    }
    case 'io_number':
    case 'dgreat':
    case 'greatand':
    case 'great': {
      return node.text;
    }

    default:
      // istanbul ignore next
      console.error(node); // eslint-disable-line no-console
      throw new Error(`Have not implemented type "${node.type}".`);
  }
}

function printOperator(op) {
  switch (op) {
    case 'or':
      return '||';
    case 'and':
      return '&&';
    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

module.exports = printNode;
