'use strict';

// --------------------------------------------------
// Imports
// --------------------------------------------------

// модули
const path = require('path');
const gulpNotify = require('gulp-notify');
const nodeNotifier = require('node-notifier');
const stripAnsi = require('strip-ansi');

const logger = require('./logger');

// --------------------------------------------------
// Public
// --------------------------------------------------

/**
 * @namespace notify
 */
const notify = {
	/**
	 * Пользовательское уведомление, после компиляции всех файлов
	 * @param {string} [title=''] - заголовок уведомления
	 * @param {Array} [filesList=[]] - список файлов
	 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/done.png')]
	 * @return {Function}
	 * @sourcecode
	 */
	onLast (taskName = '', filesList = [], icon = path.join(process.cwd(), './system/notify-icons/done.png')) {
		return gulpNotify({
			time: 2500,
			onLast: true,
			title: () => `${taskName} [${filesList.length}]`,
			icon: icon || path.join(process.cwd(), 'system/notify-icons/done.png'),
			message: () => '\n' + filesList.join('\n')
		});
	},

	/**
	 * Пользовательское уведомление
	 * @param {string} [title=''] - заголовок уведомления
	 * @param {string} [message=''] - сообщение
	 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
	 * @return {Function}
	 * @sourcecode
	 */
	onDone (title = '', message = '', icon = path.join(process.cwd(), './system/notify-icons/done.png')) {
		if (message) {
			logger('cyan', title, message);
		}
		nodeNotifier.notify({
			icon,
			title,
			type: 'info',
			time: 2500,
			message: stripAnsi(message)
		});
	},

	/**
	 * Пользовательское уведомление о ошибке
	 * @param {string} [title=''] - заголовок уведомления
	 * @param {string} [message=''] - сообщение ошибки
	 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
	 * @return {Function}
	 * @sourcecode
	 */
	onError (title = '', message = '', icon = path.join(process.cwd(), './system/notify-icons/error.png')) {
		title = `Error ${title}`;
		if (message) {
			logger('red', title, message);
		}
		nodeNotifier.notify({
			icon,
			title,
			type: 'error',
			time: 2500,
			message: stripAnsi(message)
		});
	},

	/**
	 * Пользовательское уведомление о предупреждении
	 * @param {string} [title=''] - заголовок уведомления
	 * @param {string} [message=''] - сообщение ошибки
	 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/warn.png')]
	 * @return {Function}
	 * @sourcecode
	 */
	onWarn (title = '', message = '', icon = path.join(process.cwd(), './system/notify-icons/warn.png')) {
		title = `Warning ${title}`;
		if (message) {
			logger('yellow', title, message);
		}
		nodeNotifier.notify({
			icon,
			title,
			type: 'warn',
			time: 2500,
			message: stripAnsi(message)
		});
	},

	/**
	 * Пользовательское уведомление о исправлении ошибки
	 * @param {string} [title=''] - заголовок уведомления
	 * @param {string} [message='Good job!'] - сообщение о исправлении ошибки
	 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
	 * @return {Function}
	 * @sourcecode
	 */
	onResolved (title = '', message = 'Good job!', icon = path.join(process.cwd(), './system/notify-icons/good-job.png')) {
		title = `Resolved error ${title}`;
		if (message) {
			logger('yellow', title, message);
		}
		nodeNotifier.notify({
			icon,
			title,
			type: 'info',
			time: 2500,
			message: stripAnsi(message)
		});
	}
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = notify;
