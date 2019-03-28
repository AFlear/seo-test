'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const gulp = require('gulp');
const iF = require('gulp-if');
const changed = require('gulp-changed');
const ejs = require('gulp-ejs-monster');

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
 * @param {string} taskPaths.base - основная директория для путей
 * @param {string} taskPaths.dest - итоговая директория
 *
 * @param {Object} options - параметры для модулей
 * @param {Object} options.ejs
 *
 * @param {Object} [bs={}] - browser-sync
 * @param {Object} [bs.reload] - метод перезагрузки сервера
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options, bs = {reload () {}}) {
	let checkChanged = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;
	let wasErrors = false;
	let firstRun = true;
	let icons = {
		ejs: path.join(process.cwd(), './system/notify-icons/ejs.png')
	};

	return gulp.task(taskName, done => {
		wasErrors = hasErrors;
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src, {
			base: taskPaths.base,
			since: firstRun ? 0 : gulp.lastRun(taskName)
		})

			// ejs рендер
			.pipe(ejs(options.ejs)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [gulp-ejs-monster]`, err.message, icons.ejs);
					this.emit('end');
				})
			)

			// hidden файлы всегда с `.php` расширением
			.on('data', file => {
				if (/hidden/.test(file.dirname)) {
					file.extname = '.php';
				}
			})

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
