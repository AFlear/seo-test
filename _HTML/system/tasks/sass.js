'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const gulp = require('gulp');
const iF = require('gulp-if');
const changed = require('gulp-changed');
const sass = require('gulp-sass-monster');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');

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
 * @param {Object} options.sass
 * @param {Array}  options.postcss
 *
 * @param {Object} [bs={}] - browser-sync
 * @param {Object} [bs.reload] - метод перезагрузки сервера
 * @param {boolean} [useSourcemaps]
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options, bs = {reload () {}}, useSourcemaps) {
	let checkChanged = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;
	let wasErrors = false;
	let firstRun = true;
	let icons = {
		sass: path.join(process.cwd(), './system/notify-icons/sass.png'),
		postcss: path.join(process.cwd(), './system/notify-icons/postcss.png')
	};

	return gulp.task(taskName, done => {
		wasErrors = hasErrors;
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src, {since: firstRun ? 0 : gulp.lastRun(taskName)})
			// инитим sourcemaps
			.pipe(iF(useSourcemaps, sourcemaps.init()))

			// sass рендер
			.pipe(sass(options.sass, true)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-sass-monster]`, err.message, icons.sass);
					this.emit('end');
				})
			)

			// автопрефиксы
			// упаковка медиа-запросов
			// минификация по требованию
			.pipe(postcss(options.postcss)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-postcss]`, err.message, icons.postcss);
					this.emit('end');
				})
			)

			// пишем sourcemaps
			.pipe(iF(useSourcemaps, sourcemaps.write('/')))

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
				notify.onLast(taskName, compiledFiles.list, icons.sass)
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

				checkChanged = true;
				firstRun = false;

				let list = taskName === 'sass-critical' ? null : compiledFiles.list;
				if (compiledFiles.list.length) {
					bs.reload(list);
				}
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
