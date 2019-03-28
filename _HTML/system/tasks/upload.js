'use strict';

/**

 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const vinylFtp = require('vinyl-ftp');
const iF = require('gulp-if');

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
 *
 * @param {Object} options - параметры для модулей
 * @param {Object} options.vinylFtp
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let checkNewer = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;

	let ftpConnect = vinylFtp.create(options.vinylFtp);
	let remotePath = ftpConnect.config.remotePath;

	return gulp.task(taskName, done => {
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src, {buffer: false})
			// проверяем на новые файлы
			.pipe(iF(
				checkNewer,
				ftpConnect.newer(remotePath)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [vinyl-ftp]`, err.message);
					this.emit('end');
				})
			))

			// выгрузка
			.pipe(ftpConnect.dest(remotePath)
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [vinyl-ftp]`, err.message);
					this.emit('end');
				})
			)

			// уведомление
			.pipe(compiledFiles.pipe())
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
					logger('cyan', `Отправлено файлов: [${compiledFiles.list.length}]`);
				}
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
