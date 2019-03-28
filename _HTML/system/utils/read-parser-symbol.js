'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

// модули
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');

// ----------------------------------------
// Private
// ----------------------------------------

const parserError = (data, errorOptions) => gutil.PluginError('parserStream', data, errorOptions);

// ----------------------------------------
// Public
// ----------------------------------------

function readParserSymbol (file, enc, isDone) {
	let notSupported = notSupportedFile(file, parserError);

	if (Array.isArray(notSupported)) {
		notSupported.shift();
		return isDone(...notSupported);
	}

	let content = file.contents.toString(enc);
	let symbol = /<symbol\s((?!<\/symbol>).|\r|\n)*<\/symbol>/i.exec(content);

	if (symbol === null) {
		let filepath = file.path.replace(file.cwd, '');

		return isDone(`Cимвол не найден ${filepath.replace(/\\/g, '/')}`);
	}

	symbol = symbol[0];
	let svgGradients = /<(linear|radial)Gradient\s((?!<\/symbol>).|\n)*Gradient>/i.exec(content);

	if (svgGradients !== null) {
		symbol = symbol.replace('>', `><defs>${svgGradients[0]}</defs>`);
	}

	content = symbol.replace(/^<symbol\s/, '<svg ').replace(/symbol>$/, 'svg>');
	file.contents = Buffer.from(content);
	isDone(null, file);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = readParserSymbol;
