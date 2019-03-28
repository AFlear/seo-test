'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const gulp = require('gulp');
const iF = require('gulp-if');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');

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
 * @param {string} taskPaths.base - основная директория для путей
 * @param {RegExp} taskPaths.baseReplace - подмена основной директории для путей
 *
 * @param {Object} options - параметры для модулей
 * @param {Object} options.imageminPlugins
 * @param {Object} options.imageminOptions
 *
 * @param {Object} [bs={}] - browser-sync
 * @param {Object} [bs.reload] - метод перезагрузки сервера
 * @param {Function} [taskCb] - коллбек выполнения задачи
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options, bs = {reload () {}}, taskCb) {
	let checkNewer = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let minifyImages = argv.production || argv.ftp;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;
	let wasErrors = false;
	let imageminPlugins = [];
	let {
		imageminPlugins: imageminPluginsObject = {},
		imageminOptions = {}
	} = options;

	if (minifyImages) {
		for (let plugin in imageminPluginsObject) {
			let pluginConfig = imagemin[plugin](imageminPluginsObject[plugin]);
			imageminPlugins.push(pluginConfig);
		}
	}

	return gulp.task(taskName, done => {
		wasErrors = hasErrors;
		hasErrors = false;
		compiledFiles.reset();

		return gulp.src(taskPaths.src, {
			buffer: minifyImages,
			base: taskPaths.base
		})
			// подменяем base путь
			.on('data', file => {
				if (taskPaths.baseReplace) {
					file.relative.replace(taskPaths.baseReplace, function (str) {
						file.base = path.join(file.base, str);
					});
				}
			})

			// проверяем на новые файлы
			.pipe(iF(
				checkNewer,
				newer({
					dest: taskPaths.dest
				})
			))

			// оптимизируем изображения
			.pipe(iF(
				minifyImages && /\.(gif|jpe?g|png|svg)$/i,
				imagemin(imageminPlugins, imageminOptions)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [gulp-imagemin]`, err.message);
						this.emit('end');
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
				} else if (wasErrors) {
					notify.onResolved(taskName);
					wasErrors = false;
				}

				if (!notifyFlag) {
					logger('cyan', `New files: [${compiledFiles.list.length}]`);
				}

				checkNewer = true;
				if (compiledFiles.list.length) {
					bs.reload();
				}

				if (typeof taskCb === 'function') {
					taskCb();
				}
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
