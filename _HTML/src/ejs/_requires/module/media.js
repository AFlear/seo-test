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
	const fs = require('fs');
	const pattern = /^((http(s)?:)?\/\/|<\?php|data:)/i;
	// выгружаем инструменты
	const {test, paths, argv} = app.data;
	const {notify} = app.module;

	/**
	 * Компонент установки пути к медиа файлу.
	 * @param {string} filePath - путь к файлу, от папки `Media/`
	 * @param {boolean} [absolute=false] - абослютный путь (работает с ПХП)
	 * @param {boolean} [version=true] - версионирование файла, дата последней модификации
	 * @return {string} составленный путь к файлу
	 *
	 * @memberOf app.module
	 * @requires app.data.paths
	 * @requires app.data.argv
	 *
	 * @tutorial app.module.media
	 * @sourceCode
	 */
	function media (filePath, absolute = false, version = true) {
		if (pattern.test(filePath)) {
			return filePath;
		}

		if (argv.ftp) {
			absolute = false;
		}

		if (typeof filePath !== 'string') {
			throw new Error('app.module.media(filePath) - filePath must be an string!');
		}

		let hash = filePath.split('#');
		filePath = hash.shift();

		let query = filePath.split('?');
		filePath = query.shift();

		if (test) {
			let args = [`'${filePath}'`, absolute, version];
			let phpString = `<?php echo \\Core\\HTML::media( ${args.join(', ')} ); ?>`;

			if (query.length) {
				let q = version ? '&' : '?';
				phpString += q + query.join('&');
			}
			if (hash.length) {
				phpString += '#' + hash[0];
			}
			return phpString;
		}

		if (version) {
			let relPath = path.join(paths.media, filePath);
			let fsPath = path.resolve(relPath);
			try {
				query.unshift('v=' + fs.statSync(fsPath).mtime.getTime());
			} catch (err) {
				notify.onWarn('app.module.media()', err.message);
			}
		}

		if (query.length) {
			filePath += '?' + query.join('&');
		}

		if (hash.length) {
			filePath += '#' + hash[0];
		}

		return paths.toMedia + filePath;
	}

	return media;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
