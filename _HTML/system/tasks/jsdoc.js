'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const del = require('del');
const jsdoc = require('gulp-jsdoc3');

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
 * @param {Object} options.jsdoc
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let notifyFlag = argv.notify;

	return gulp.task(taskName, done => {
		del.sync(taskPaths.dest);
		logger('cyan', `Clearing ${taskPaths.dest}`);

		return gulp.src(taskPaths.src, {buffer: false})
			// генерация документации
			.pipe(jsdoc(
				options.jsdoc,
				(err) => {
					if (err) {
						notify.onError(`${taskName} [gulp-jsdoc3]`, err.message);
					} else {
						if (notifyFlag) {
							notify.onDone(`${taskName} [gulp-jsdoc3]`, 'Done!');
						} else {
							logger('yellow', `${taskName} [gulp-jsdoc3] - Done!`);
						}
					}
					done();
				}
			));
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
