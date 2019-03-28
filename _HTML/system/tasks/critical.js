'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const penthouse = require('penthouse');

const {argv} = require('../config');
const logger = require('../utils/logger');

// ----------------------------------------
// Public
// ----------------------------------------

function checkPath (url) {
	let cwd = process.cwd();
	let parts = path.normalize(url).replace(/\\/g, '/').split('/');
	parts.pop();

	let folders = [];
	let goUp = parts.filter(part => {
		if (part === '.') {
			return false;
		} else if (part === '..') {
			return part;
		}
		folders.push(part);
	});
	if (goUp.length) {
		cwd = path.join(cwd, goUp.join('/'));
	}

	folders.forEach(folder => {
		cwd = path.join(cwd, folder);
		if (!fs.existsSync(cwd)) {
			fs.mkdirSync(cwd);
		}
	});
}

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Function} createConfig
 *
 * @returns {Function}
 */
function task (taskName, createConfig, browserSync) {
	/**
	 * Создание темповских директорий
	 * @return {string} абсолютный путь к темп директории
	 * @private
	 */
	function createTempFolders () {
		const tmpFolder = path.join(process.cwd(), 'tmp');
		const criticalFolder = path.join(tmpFolder, 'critical');

		if (!fs.existsSync(tmpFolder)) {
			fs.mkdirSync(tmpFolder);
		}
		if (!fs.existsSync(criticalFolder)) {
			fs.mkdirSync(criticalFolder);
		}

		return criticalFolder;
	}

	/**
	 * Создание одного стилевого файла из списка
	 * с фильтровкой игнорируемого кода
	 * @param {Object} view
	 * @param {string} fileName
	 * @param {string} dest
	 * @private
	 */
	function createCssSource (view, fileName, dest) {
		let {css, ignoreCode} = view;
		if (!Array.isArray(css)) {
			css = [css];
		}

		let sources = css.map(link => {
			let code = fs.readFileSync(link).toString();
			code = code.replace(/\/\*#\ssourceMappingURL=.+\*\//g, '');
			ignoreCode.forEach(ignore => {
				code = code.replace(ignore, '');
			});
			return `\n\n/* ${link} */\n\n${code}`;
		});

		let cssFile = path.join(dest, fileName + '.css');
		let cssCode = sources.join('\n');
		fs.writeFileSync(cssFile, sources.join('\n'));
		return cssCode;
	}

	return gulp.task(taskName, done => {
		const viewsConfig = createConfig(browserSync);
		const stop = () => {
			browserSync.exit();
			return done();
		};

		// фильтруем указаные въюхи
		if (argv.views.length) {
			for (let key in viewsConfig) {
				if (!~argv.views.indexOf(key)) {
					delete viewsConfig[key];
				}
			}
		}

		// фильтруем выключенные въюхи
		for (let key in viewsConfig) {
			if (viewsConfig[key].disabled) {
				delete viewsConfig[key];
				continue;
			}
			delete viewsConfig[key].disabled;
		}

		// выход, если страниц нету
		if (!Object.keys(viewsConfig).length) {
			logger('red', 'Нет страниц для генерации');
			return stop();
		}

		const criticalFolder = createTempFolders();
		const viewsList = [];
		for (let key in viewsConfig) {
			let view = viewsConfig[key];
			view.cssString = createCssSource(viewsConfig[key], key, criticalFolder).replace(/\\/g, '/');
			view.dest = path.join(view.destPath, (view.destName || key) + (view.destExt || '.css'));
			checkPath(view.dest);
			delete view.destPath;
			delete view.destName;
			delete view.destExt;
			delete view.ignoreCode;
			delete view.css;
			viewsList.push(view);
		}

		let activeView = 0;
		function generate () {
			let data = viewsList[activeView++];
			if (data) {
				logger('blue', 'Генерация критикал стилей');
				logger('magenta', data.url);
				let dest = data.dest;
				delete data.dest;

				penthouse(data).then(criticalCSS => {
					fs.writeFileSync(path.join(process.cwd(), dest), criticalCSS);
					logger('green', 'Готово!', dest);
					generate();
				}).catch(err => {
					logger('red', 'Ошибка!', err.message);
					generate();
				});
			} else {
				logger('yellow', 'Генерация выполенна успешно');
				stop();
			}
		}

		penthouse.DEBUG = argv.debug;
		generate();
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
