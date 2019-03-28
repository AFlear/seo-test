'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Форматирует число с разделением групп
 *
 * @memberOf app.module
 * @this app
 * @sourceCode
 *
 * @param {number} [numberValue=9999.99] - число для форматирования
 * @param {number} [decimals=2] - количество чисел после запятой
 * @param {string} [decPoint="."] - раздилетель дробей
 * @param {string} [thousandsSep=" "] - раздилетель тисяч
 * @return {string}
 */
function numberFormat (numberValue = 9999.99, decimals = 2, decPoint = '.', thousandsSep = ' ') {
	// выгружаем инструменты
	let number = Number(numberValue);
	if (!isFinite(number)) {
		return number;
	}

	let stringNumber = String(number);
	let parts = stringNumber.replace(/,/, '.').split('.');
	let int = [];
	let increment = 0;

	for (let num = parts[0], i = num.length - 1; i >= 0; i--) {
		int.push(num[i]);
		if ((int.length - increment) % 3 === 0) {
			int.push(thousandsSep);
			increment++;
		}
	}
	parts[0] = int.reverse().join('');

	if (decimals) {
		let penny = parts[1] || '';
		let tail = new Array(++decimals - penny.length);
		parts[1] = penny + tail.join('0');
	}
	return parts.join(decPoint);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = numberFormat;
