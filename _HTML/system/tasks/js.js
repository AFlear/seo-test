'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const iF = require('gulp-if');
const newer = require('gulp-newer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
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
 * @param {Object} options.babel
 * @param {Array}  options.uglify
 * @param {Array}  options.include
 *
 * @param {Object} [bs={}] - browser-sync
 * @param {Object} [bs.reload] - метод перезагрузки сервера
 * @param {boolean} [useSourcemaps]
 * @param {boolean} [useUglify]
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options, bs = {reload () {}}, useSourcemaps, useUglify) {
	let checkNewer = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;
	let wasErrors = false;
	let firstRun = true;

	return gulp.task(taskName, done => {
		wasErrors = hasErrors;
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src, {since: firstRun ? 0 : gulp.lastRun(taskName)})
			// проверяем на новые файлы
			.pipe(iF(
				checkNewer,
				newer({
					dest: taskPaths.dest
				})
			))

			// инитим sourcemaps
			.pipe(iF(useSourcemaps, sourcemaps.init()))

			.pipe(include(options.include)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-include]`, err.message);
					this.emit('end');
				})
			)

			// es6 - es5
			.pipe(babel(options.babel)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-babel]`, err.message);
					this.emit('end');
				})
			)

			// минификация
			.pipe(iF(useUglify, uglify(options.uglify)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-uglify]`, err.message);
					this.emit('end');
				})
			))

			// пишем sourcemaps
			.pipe(iF(useSourcemaps, sourcemaps.write('/')))

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
				} else if (wasErrors) {
					notify.onResolved(taskName);
					wasErrors = false;
				}

				if (!notifyFlag) {
					logger('cyan', `New files: [${compiledFiles.list.length}]`);
				}

				checkNewer = true;
				firstRun = false;
				if (compiledFiles.list.length) {
					bs.reload();
				}
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
