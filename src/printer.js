'use strict';

const {
  concat,
  join,
  group,
  indent,
  ifBreak,
  hardline,
  softline,
} = require('prettier').doc.builders;

const lineContinuation = ifBreak(concat([' \\', softline]), ' ');

// '#!/bin/bash -eu', // TODO: use original shebang
// hardline,
// hardline,

function printNode(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case 'Script': {
      return concat([join(hardline, path.map(print, 'commands'))]);
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
    case 'CommandExpansion': {
      return concat(['$(', path.call(print, 'commandAST'), ')']);
    }
    case 'ArithmeticExpansion': {
      return concat(['$((', path.call(print, 'arithmeticAST'), '))']);
    }
    case 'ParameterExpansion': {
      return concat(['${', String(node.parameter), '}']);
    }
    case 'Word': {
      if (/\n/.test(node.text)) {
        return `'${node.text}'`;
      }
      return node.text;
    }
    case 'Identifier': {
      return node.name;
    }
    case 'NumericLiteral': {
      return node.extra.raw;
    }
    case 'AssignmentWord': {
      const expansions = node.expansion && path.map(print, 'expansion');
      return concat([
        node.text.substring(0, node.text.indexOf('=')),
        '=',
        node.expansion
          ? expansions[expansions.length - 1] // TODO: Raise parser bug
          : node.text.substring(node.text.indexOf('=') + 1),
      ]);
    }
    case 'LogicalExpression': {
      return group(
        concat([
          group(path.call(print, 'left')),
          indent(
            concat([
              lineContinuation,
              concat([
                printOperator(node.op),
                lineContinuation,
                group(path.call(print, 'right')),
              ]),
            ]),
          ),
        ]),
      );
    }
    case 'BinaryExpression': {
      return group(
        concat([
          path.call(print, 'left'),
          node.operator,
          path.call(print, 'right'),
        ]),
      );
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
    case 'Case': {
      return concat([
        'case ',
        path.call(print, 'clause'),
        ' in',
        indent(concat([hardline, concat(path.map(print, 'cases'))])),
        hardline,
        'esac',
        hardline,
      ]);
    }
    case 'CaseItem': {
      return concat([
        concat(path.map(print, 'pattern')),
        ')',
        indent(concat([hardline, path.call(print, 'body'), hardline, ';;'])),
        hardline,
      ]);
    }
    case 'Function': {
      return concat([
        path.call(print, 'name'),
        '() {',
        indent(concat([hardline, path.call(print, 'body')])),
        hardline,
        '}',
      ]);
    }
    case 'CompoundList': {
      return join(hardline, path.map(print, 'commands'));
    }
    case 'Subshell': {
      return concat([
        '(',
        indent(concat([hardline, path.call(print, 'list')])),
        hardline,
        ')',
      ]);
    }
    case 'Name':
      return node.text;
    case 'io_number':
      return node.text;
    case 'great':
      return '>';
    case 'less':
      return '<';
    case 'dgreat':
      return '>>';
    case 'dless': {
      // TODO: Raise parser bug - herdocs are unhandled
      let sentinal = '';
      if (node.loc) {
        const tail = options.originalText.substring(node.loc.end.char);
        sentinal = tail.substring(1, tail.indexOf('\n'));
      }
      return concat(['<<', sentinal]);
    }
    case 'greatand':
      return '<&';
    case 'lessand':
      return '>&';

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
