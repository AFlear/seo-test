'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const happinessScss = require('gulp-happiness-scss');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - исходные файлы
 * @param {Object} options - параметры для модулей
 * @param {Object} options.happinessScss
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let firstRun = true;

	return gulp.task(taskName, done => {
		if (!firstRun) {
			options.happinessScss.format.showHappyFiles = true;
		}

		return gulp.src(taskPaths.src, {since: firstRun ? 0 : gulp.lastRun(taskName)})
			// линтитнг
			.pipe(happinessScss(options.happinessScss.linting))
			// форматирование результат
			.pipe(happinessScss.format(options.happinessScss.format))
			// ошибки в конце всей задчи, если есть
			.pipe(happinessScss.failAfterError(options.happinessScss.failAfterError))
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
