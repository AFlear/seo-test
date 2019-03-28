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
	const {ejsPaths, paths} = app.data;

	/**
	 * Определение относительного пути от текущей директории
	 * из папки с разметкой ДО папки с медиа файлами
	 *
	 * @example <caption>Путь от <code>_HTML/dist/index.php</code> до корневой директории проекта</caption>
	 * app.module.host(); // => '../../'
	 *
	 * @example <caption>Путь от <code>_HTML/dist/hidden/callback.php</code> до корневой директории проекта</caption>
	 * app.module.host(); // => '../../../'
	 *
	 * @returns {string}
	 * @memberOf app.module
	 * @sourceCode
	 */
	function host () {
		let exec = /^(\.\.\/)*/.exec(host.mediaPath());
		let hostValue = './';

		if (exec !== null && exec[0]) {
			hostValue = exec[0];
		}

		return hostValue;
	}

	/**
	 * Определение относительного пути
	 * из папки с разметкой В папку с медиа файлами
	 *
	 * @example <caption>Путь от <code>_HTML/dist/index.php</code> в <code>Media/</code></caption>
	 * app.module.host(); // => '../../Media'
	 *
	 * @example <caption>Путь от <code>_HTML/dist/hidden/callback.php</code> в <code>Media/</code></caption>
	 * app.module.host(); // => '../../../Media'
	 *
	 * @returns {string}
	 * @memberOf app.module
	 * @sourceCode
	 * @requires app.viewPath
	 * @requires app.data.ejsPaths
	 * @requires app.data.paths
	 */
	host.mediaPath = function () {
		let relPath = path.dirname(path.relative(ejsPaths.ejsCwd, app.viewPath));
		let distMarkup = path.resolve(path.join(paths.markup, relPath));
		let distMedia = path.resolve(paths.media);

		return path.relative(distMarkup, distMedia).replace(/\\/g, '/') + '/';
	};

	return host;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
