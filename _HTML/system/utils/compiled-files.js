'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

// модули
const rename = require('gulp-rename');

// ----------------------------------------
// Public
// ----------------------------------------

class CompiledFiles {
	/**
	 * Составление списка путей файлов gulp задачи
	 */
	constructor () {
		this.list = [];
	}

	/**
	 * Сброс списка
	 * @sourceCode
	 */
	reset () {
		this.list = [];
	}

	/**
	 * Добавление пути в список
	 * @param {string} path
	 * @sourceCode
	 */
	push (path) {
		this.list.push(`${path.dirname.replace(/\\/g, '/')}/${path.basename + path.extname}`);
	}

	/**
	 * Использование в пайпах
	 * @sourceCode
	 */
	pipe () {
		return rename(path => this.push(path));
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = CompiledFiles;
