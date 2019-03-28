'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const happiness = require('gulp-happiness');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {Array.<string>|string} taskPaths.src - исходные файлы
 * @param {Object} options - параметры для модулей
 * @param {Object} options.happiness
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let firstRun = true;

	return gulp.task(taskName, done => {
		if (!firstRun) {
			options.happiness.format.showHappyFiles = true;
		}

		return gulp.src(taskPaths.src, {since: firstRun ? 0 : gulp.lastRun(taskName)})
			// линтитнг
			.pipe(happiness(options.happiness.linting))
			// форматирование результат
			.pipe(happiness.format(options.happiness.format))
			// ошибки в конце всей задчи, если есть
			.pipe(happiness.failAfterError(options.happiness.failAfterError))
			// завершение задачи
			.on('end', () => {
				firstRun = false;
				done();
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
