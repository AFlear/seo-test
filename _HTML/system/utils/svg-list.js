'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

// хелперы
const cloneDeep = require('lodash/cloneDeep');

// ----------------------------------------
// Public
// ----------------------------------------

class SvgList {
	/**
	 * Создание нового списка
	 */
	constructor () {
		this.reset();
	}

	/**
	 * Сброс списка
	 */
	reset () {
		this.list = {};
		this.hasGradients = false;
	}

	/**
	 * Добавление в список
	 * @param {Element} $symbol
	 * @param {Function} $symbol.prop
	 * @param {Function} $symbol.find
	 */
	push ($symbol) {
		let id = $symbol.prop('id');
		let hasGradients = $symbol.find('linearGradient, radialGradient').length;
		let data = cloneDeep($symbol[0].attribs);
		let box = data.viewBox.split(' ');
		this.list[id] = {
			viewBox: data.viewBox,
			width: data.width || box[2],
			height: data.width || box[3]
		};

		if (hasGradients) {
			this.hasGradients = true;
		}
	}

	/**
	 * Вывод списка
	 */
	print () {
		let result = JSON.stringify({
			list: this.list,
			hasGradients: this.hasGradients
		}, null, '\t');
		let code = `'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/* eslint-disable quotes */

/**
 * Справочник по символам  SVG спрайта
 *
 * > ___ЭТОТ ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ___
 * > ___НЕ РЕДАКТИРУЙТЕ ЕГО!!!___
 *
 * @type {Object}
 * @memberOf app.data
 * @sourceCode
 */
let svg = ${result};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = svg;
`;
		return code;
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = SvgList;
