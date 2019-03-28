'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Переводит js объект в JSON строку с php декодированием
 *
 * @memberOf app.module
 * @sourceCode
 *
 * @example
 * let obj = {
 *     key1: true,
 *     key2: 123,
 *     key3: 'Hello world'
 * }
 * let str = app.module.object2php(obj); // => 'json_decode(\'{"key1": true, "key2": 123, "key3": "Hello world"}\')'
 *
 * @param {Object} sample - объект для перевода
 * @param {boolean} [asArray] - если `true` возвращаемые объекты будут преобразованы в ассоциативные массивы.
 * @return {string}
 */
function object2php (sample, asArray) {
	let data = JSON.stringify(Object.assign({}, sample), null, '  ').replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
	if (asArray) {
		return `json_decode('${data}', true)`;
	}
	return `json_decode('${data}')`;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = object2php;
