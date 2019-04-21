'use strict';

const parse = require('./parser');
const print = require('./printer');
const clean = require('./clean');
const options = require('./options');
const comments = require('./comments');
const { hasPragma, insertPragma } = require('./pragma');

// TODO: remove after resolve https://github.com/prettier/prettier/pull/5854
function createLanguage(linguistData, { extend, override }) {
  const language = {};

  for (const key in linguistData) {
    const newKey = key === 'languageId' ? 'linguistLanguageId' : key;
    language[newKey] = linguistData[key];
  }

  if (extend) {
    for (const key in extend) {
      language[key] = (language[key] || []).concat(extend[key]);
    }
  }

  for (const key in override) {
    language[key] = override[key];
  }

  return language;
}

const languages = [
  createLanguage(require('linguist-languages/data/shell'), {
    override: {
      parsers: ['bash'],
      vscodeLanguageIds: ['shellscript'],
    },
  }),
];

const loc = prop => node => {
  return node.loc && node.loc[prop] && node.loc[prop].char;
};

const parsers = {
  bash: {
    parse,
    astFormat: 'bash',
    locStart: loc('start'),
    locEnd: loc('end'),
    // hasPragma,
  },
};

const printers = {
  bash: {
    print,
    massageAstNode: clean,
  },
};

module.exports = {
  languages,
  printers,
  parsers,
  options,
};
