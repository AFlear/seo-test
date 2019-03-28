'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Объединяет переданые аргументы в массив, по принципу объединения объектов
 * с фильтровкой одинаковых свойств.
 *
 * Основной причиной создания хелпера послужила задача для расширения классов
 * В компоненте `attrs`
 *
 * @memberOf app.module
 * @sourceCode
 * @requires {@link https://www.npmjs.com/package/lodash}
 *
 * @example <caption>объединение двух массивов с числами</caption>
 * let arr1 = [1, 2, 4];
 * let arr2 = [2, 3];
 * let result = app.module.mergeAsArrays(arr1, arr2); // => [1, 2, 4, 3]
 *
 * @example <caption>объединение разных типов данных, с повторяющимся значениями</caption>
 * let a = [1, 2, 4];
 * let b = 4;
 * let c = 'Hello world!';
 * let d = ['Hello world!', 2];
 * let result = app.module.mergeAsArrays(a, b, c, d); // => [1, 2, 4, 'Hello world!']
 *
 * @example <caption>объединение объектов, с повторяющимся значениями</caption>
 * let a = {
 *    key: true,
 *    foo: 'foo'
 * };
 * let b = {
 *    key: false,
 *    bar: 'bar'
 * };
 * let result = app.module.mergeAsArrays(a, b); // => [{key: false, foo: 'foo', bar: 'bar'}]
 *
 * @param {...Array} args - Массивы для объединения
 * @return {Array}
 */
function mergeAsArrays (...args) {
	let arrays = [];
	let objects = [];
	let lodash = this.requireNodeModule('lodash');

	args.forEach(item => {
		let items = [];

		if (Array.isArray(item)) {
			items = items.concat(item);
		} else {
			items = [item];
		}
		objects = objects.concat(items.filter(item => {
			if (lodash.isPlainObject(item)) {
				return item;
			} else {
				if (!~arrays.indexOf(item)) {
					arrays.push(item);
				}
			}
		}));
	});

	if (!objects.length) {
		return arrays;
	}

	let mergedObjects = objects.reduce((prev, current) => {
		return lodash.merge({}, prev, current);
	});

	return arrays.concat(mergedObjects);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = mergeAsArrays;
