'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Function}
 * @private
 */
function wrapper (app) {
	const path = require('path');
	// выгружаем инструменты
	const {host, notify} = app.module;
	const {test, ejsPaths, paths} = app.data;

	/**
	 * Вставка текстового файла из папки `Media` в код разметки
	 *
	 * @param {string} filePath - путь к файлу
	 * @param {boolean} [phpInclude] - Использовать php метод `include`
	 * @return {string} составленный код
	 *
	 * @memberOf app.module
	 * @requires app.include
	 * @requires app.data.paths
	 * @requires app.data.ejsPaths
	 * @requires app.module.host
	 * @requires app.module.notify
	 *
	 * @tutorial app.module.insert
	 * @sourceCode
	 */
	function insert (filePath, phpInclude) {
		let hostMediaPath = host.mediaPath();

		if (test) {
			let mtd = phpInclude ? 'include' : 'echo file_get_contents';
			let url = hostMediaPath.replace(host(), '');
			filePath = path.join(url, filePath).replace(/\\/g, '/');

			return `<?php ${mtd}( HOST . '${filePath}' ); ?>`;
		}

		let fsPath = path.resolve(paths.markup, path.join(hostMediaPath, filePath));
		let relPath = path.relative(ejsPaths.includes, fsPath);
		let result;

		try {
			result = app.include(relPath);
		} catch (err) {
			notify.onWarn('app.module.insert()', err.message);
		}
		return result;
	}

	/**
	 * Вставка текстового файла из папки `dist` в код разметки
	 *
	 * @param {string} filePath - путь к файлу
	 * @param {boolean} [phpInclude] - Использовать php метод `include`
	 * @return {string|undefined} составленный код
	 *
	 * @memberOf app.module
	 * @tutorial app.module.insert
	 * @sourceCode
	 */
	insert.fromDist = function (filePath, phpInclude) {
		if (test) {
			let mtd = phpInclude ? 'include' : 'echo file_get_contents';
			return `<?php ${mtd}( '${filePath}' ); ?>`;
		}

		let dist = path.join(ejsPaths.cwd, 'dist');
		let media = path.join(dist, host.mediaPath());
		let file = path.join(dist, filePath);
		filePath = path.relative(media, file);
		return insert(filePath);
	};

	return insert;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
