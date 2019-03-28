'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const sassdoc = require('sassdoc');

const {argv} = require('../config');
const logger = require('../utils/logger');
const notify = require('../utils/notify');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - исходные файлы
 * @param {string} taskPaths.dest - итоговая директория
 *
 * @param {Object} options - параметры для модулей
 * @param {Object} options.sassdoc
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let notifyFlag = argv.notify;

	return gulp.task(taskName, done => {
		let wasError = false;
		return gulp.src(taskPaths.src, {buffer: false})
			// генерация документации
			.pipe(sassdoc(options.sassdoc)
				.on('error', function (err) {
					wasError = true;
					notify.onError(`${taskName} [sassdoc]`, err.message);
					this.emit('end');
				})
			)
			.on('end', () => {
				if (notifyFlag && !wasError) {
					notify.onDone(`${taskName} [sassdoc]`, 'Done!');
				} else {
					logger('yellow', `${taskName} [sassdoc] - Done!`);
				}
				done();
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
