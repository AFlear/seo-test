'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const chalk = require('chalk');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Уведомление в терминале
 * @param {string} [color="white"]
 * @param {string} messages
 * @sourceCode
 */
function logger (color = 'white', ...messages) {
	let message = chalk[color](messages.join('\n'));
	console.log(message);
}

/**
 * Обертка основно метода
 * с добавлением отступов до и после уведомления
 * @inner
 * @param {...string} args
 * @method logger::pad
 * @sourceCode |+5
 */
logger.pad = function (...args) {
	console.log('');
	this(...args);
	console.log('');
};

/**
 * Принт node.js команды
 * @inner
 * @param {string} command
 * @method logger::command
 * @sourceCode |+4
 */
logger.command = function (command) {
	command = command.replace(/(\s-(-)?(\w|-)+)/gi, (str, g) => chalk.blue(g));
	this('yellow', `${chalk.gray('$')} ${command}`);
};

/**
 * Принт данных JSON строкой с подсветкой
 * @inner
 * @param {*} data
 * @param {boolean} [asString]
 * @method logger::json
 * @sourceCode |+9
 */
logger.json = function (data, asString) {
	let str = JSON.stringify(data, (key, value) => {
		switch (typeof value) {
			case 'function':
				value = 'function () {}';
				break;
			case 'undefined':
				value = 'undefined';
				break;
		}
		return value;
	}, '  ');

	str = str.replace(/(":\s)"(function \(\) \{\})"/g, (str, g1, g2) => g1 + chalk.blue(g2));
	str = str.replace(/(":\s)"(undefined)"/g, (str, g1, g2) => g1 + chalk.gray(g2));
	str = str.replace(/(":\s)(".+")/g, (str, g1, g2) => g1 + chalk.yellow(g2));
	str = str.replace(/(":\s)(true|false|null|\d+)/g, (str, g1, g2) => g1 + chalk.blue(g2));

	if (asString) {
		return chalk.gray(str);
	}
	this('green', str);
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = logger;
