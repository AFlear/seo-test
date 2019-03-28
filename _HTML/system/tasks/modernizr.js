'use strict';

/**
 * Сканирование тестов `modernizr` и построение файла библиотеки
 * @module
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 7.6.1
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const iF = require('gulp-if');
const changed = require('gulp-changed');
const modernizr = require('gulp-modernizr-wezom');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const {argv} = require('../config');
const logger = require('../utils/logger');
const notify = require('../utils/notify');
const CompiledFiles = require('../utils/compiled-files');

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
 * @param {Object} options.modernizr
 * @param {Array}  options.uglify
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let useUglify = argv.production;
	let checkChanged = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;

	return gulp.task(taskName, done => {
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src)
			.pipe(modernizr(options.modernizr)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-modernizr-wezom]`, err.message);
					this.emit('end');
				})
			)

			// инитим sourcemaps
			.pipe(sourcemaps.init())

			// минификация
			.pipe(iF(useUglify, uglify(options.uglify)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-uglify]`, err.message);
					this.emit('end');
				})
			))

			// пишем sourcemaps
			.pipe(sourcemaps.write('/'))

			// проверем, изменился контент или нет
			.pipe(iF(
				checkChanged,
				changed(taskPaths.dest, {
					hasChanged: changed.compareSha1Digest
				})
			))

			// сохраняем файлы
			.pipe(compiledFiles.pipe())
			.pipe(gulp.dest(taskPaths.dest))

			// уведомление
			.pipe(iF(
				notifyFlag,
				notify.onLast(taskName, compiledFiles.list)
			))

			// завершение задачи
			.on('end', () => {
				if (hasErrors) {
					return done();
				}

				if (!notifyFlag) {
					logger('cyan', `New files: [${compiledFiles.list.length}]`);
				}
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
