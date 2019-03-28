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
	const lodash = require('lodash');
	// выгружаем инструменты
	const {test} = app.data;

	/**
	 * Компонент для перевода текстов актуален для мультиязычных сайтов.
	 * @param {string} str - строка, которую нужно перевести
	 * @param {string} [customLang] - пользовательский язык, если не указан используется [язык по умолчанию]{@link app.data.lang}
	 * @returns {string}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.__
	 * @sourceCode
	 */
	function __ (str, customLang) {
		let setLang = !!customLang;
		customLang = customLang || app.data.lang;
		let result = str;

		if (test) {
			if (/<\?php echo __\(/i.test(result)) {
				return result;
			}
			if (setLang) {
				return `<?php echo __( '${result}', NULL, '${customLang}' ); ?>`;
			}
			return `<?php echo __( '${result}' ); ?>`;
		}

		for (let key in __.translations) {
			let list = __.translations[key];
			let value = list[result] && list[result][customLang];
			if (typeof value === 'string') {
				result = value;
				break;
			}
		}

		return result;
	}

	/**
	 * Обрезка php кода
	 * @param {string} str
	 * @returns {string}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.__
	 * @sourceCode
	 */
	__.trim = function (str) {
		return str.replace(/(^<\?php echo |; \?>$)/g, '');
	};

	/**
	 * @param {string} [customLang] - язык переводов
	 * @returns {string} Разметка нумерованного списка со всеми переводами для текущего языка
	 *
	 * @memberOf app.module
	 * @tutorial app.module.__
	 * @sourceCode
	 */
	__.printAll = function (customLang) {
		let list = ['<ol>'];
		for (let key in __.translations) {
			list.push(`<li>${__(key, customLang)}</li>`);
		}
		list.push('</ol>');
		return list.join('\n');
	};

	/**
	 * Справочник всех переводов
	 * Этот справочник выводится как php файл для работы функции `<?php __( string: 'Text' ) ?>`
	 * смотрите `src/ejs/hidden/i18n/${lang}/`
	 *
	 * @type {Object}
	 * @memberOf app.module
	 * @tutorial app.module.__
	 * @sourceCode
	 */

	__.translations = {
		'info': lodash.merge({},
			app.require('./l18n/info.json', __dirname),
			app.require('./l18n/views.json', __dirname)
		),
		'system': lodash.merge({},
			app.require('./l18n/system.json', __dirname)
		),
		'javascript-plugins': lodash.merge({},
			app.require('./l18n/validation.json', __dirname),
			app.require('./l18n/magnific-popup.json', __dirname)
		)
	};

	/**
	 * Транформация переводов
	 *
	 * @type {Function}
	 * @param {string} [customLang=app.data.lang] - язык переводов
	 * @param {string} [branch='javascript-plugins'] - ветка переводов в {@link app.module.__.translations}
	 * @returns {string}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.__
	 * @sourceCode
	 */
	__.translateJSON = function (customLang = app.data.lang, branch = 'javascript-plugins') {
		let result = [];
		let list = lodash.merge({}, __.translations[branch]);
		for (let key in list) {
			let value = list[key][customLang] || key;
			result.push(`\t\t'${key}' => '${value}'`);
		}
		return `<?php\n\treturn array(\n${result.join(',\n')}\n\t);`;
	};

	return __;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
