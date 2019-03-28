'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const argv = require('yargs').argv;
const logger = require('./utils/logger');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Получение массива из строчного аргумента
 * @private
 * @param {*} arg
 * @returns {string|null}
 */
function stringArg (arg) {
	return (typeof arg === 'string' && arg) ? arg.replace(/\s/g, '').split(',') : null;
}

/**
 * флаг отключения `bg`
 * @private
 */
let unUseBg = false;

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @namespace configSystem
 */
const configSystem = {

	/**
	 * Запущенный процесс webpack
	 * @returns {string}
	 * @sourceCode
	 */
	get isWebpack () {
		return !!~argv['$0'].indexOf('webpack.js');
	},

	/**
	 * Имя gulp заадчи
	 * @returns {string}
	 * @sourceCode
	 */
	get task () {
		if (argv.tasks || argv.T) {
			return undefined;
		}
		return argv._[0] || 'default';
	},

	/**
	 * Запущенная версия сборки
	 * @returns {string}
	 * @sourceCode
	 */
	get runningVersion () {
		if (this.argv.ftp) {
			return 'ftp';
		}
		return 'test';
	},

	/**
	 * Конфигурация параметров окружения
	 * @returns {Object} - параметры окружения
	 * @sourceCode
	 */
	argv: {
		/**
		 * флаг автоиспревления линтинга
		 * @memberOf argv
		 */
		fix: !!argv.fix,

		/**
		 * запуск задач без проверки файлов
		 * @memberOf argv
		 */
		forceRun: !!argv.forceRun,

		/**
		 * подробные отчеты от модулей
		 * @memberOf argv
		 */
		verbose: !!argv.verbose,

		/**
		 * отладка в модулях
		 * @memberOf argv
		 */
		debug: !!argv.debug,

		/**
		 * открыть сервер browser-sync после инита
		 * @memberOf argv
		 */
		open: !!(argv.open || (argv.o && argv.open !== false)),

		/**
		 * флаг сборки для ftp
		 * @memberOf argv
		 */
		get ftp () {
			return !!(argv.ftp || ~this.define.indexOf('ftp'));
		},

		/**
		 * флаг инита browser-sync'a с webpack-dev-middleware
		 * @memberOf argv
		 */
		get bsWebpack () {
			if (Array.isArray(argv.bsWebpack)) {
				return false;
			}
			return argv.bsWebpack;
		},

		/**
		 * флаг инита browser-sync
		 * @memberOf argv
		 * @returns {boolean}
		 */
		get bs () {
			if (Array.isArray(argv.bs)) {
				return false;
			}
			return !!(argv.bs || this.bsWebpack);
		},

		/**
		 * выводить push уведомления
		 * @memberOf argv
		 */
		notify: !!(argv.notify || (argv.n && argv.notify !== false)),

		/**
		 * флаг установки вотчей
		 * @memberOf argv
		 * @type {boolean}
		 */
		watch: !!(argv.watch || (argv.w && argv.watch !== false)),

		/**
		 * список задач для запуска
		 * @memberOf argv
		 * @type {Array.<string>|null}
		 */
		get run () {
			let list = stringArg(argv.run || argv.r);
			let bgList = this.bg;

			if (!this.watch && bgList) {
				if (list) {
					list = bgList.concat(list);
				} else {
					list = bgList;
				}
				unUseBg = true;
			}

			if (list) {
				if (configSystem.task !== 'default') {
					logger('red', '', 'Option --run allowed only with the default task');
					process.exit(0);
				}
				if (this.watch) {
					list.push('watch');
					if (this.bs) {
						list.push('bs');
					}
				}
			}
			return list;
		},

		/**
		 * список фоновых задач
		 * @memberOf argv
		 * @type {Array.<string>|null}
		 */
		get bg () {
			let list = unUseBg ? null : stringArg(argv.bg || argv.b);
			if (list) {
				if (configSystem.task !== 'default') {
					logger('red', '', 'Option --bg allowed only with the default task');
					process.exit(0);
				}
			}
			return list;
		},

		/**
		 * определение пользовательских значений
		 * @memberOf argv
		 * @type {Array.<string>}
		 */
		get define () {
			let result = stringArg(argv.define);
			return Array.isArray(result) ? result : [];
		},

		/**
		 * определение въюх для которых нужно генерировать критикал стили
		 * @memberOf argv
		 * @type {Array.<string>}
		 */
		get views () {
			let result = stringArg(argv.views);
			return Array.isArray(result) ? result : [];
		},

		/**
		 * запуск в продакш версии
		 * @memberOf argv
		 * @returns {boolean}
		 */
		get production () {
			return !!(this.ftp || argv.production || (argv.p && argv.production !== false));
		}
	},

	/**
	 * Основные пути проекта
	 * каждое свойтсво представлено объектом.
	 * Параметры будут переопределны автоматически
	 * в зависимости от запущенной задачи.
	 *
	 * Пути указываются относитльно директории запущенного процесса - `process.cwd()`
	 * по умолчанию это `_HTML/`
	 *
	 * - default - путь при работе на локальном сервере
	 * - bsStatic - путь при работе с статическим сервером от browser-sync
	 * - ftp - путь при выгрузке на фтп, по умолчанию на инкубатор
	 * @type {Object}
	 * @sourceCode
	 */
	paths: {
		/**
		 * Путь к корневой директории проекта из корневой папки сборки (_HTML)
		 * @memberOf paths
		 */
		get root () {
			let paths = {
				test: '../',
				ftp: './tmp/ftp/'
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к директории, в которую будет компилироваться только разметка
		 * и необходимые для нее файлы, к примеру `.htaccess`.
		 * @memberOf paths
		 * @type {string}
		 */
		get markup () {
			let paths = {
				test: './dist/',
				ftp: './tmp/ftp/'
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к директории, в которую будет компилироваться только разметка
		 * для браузера и browser-sync
		 * @memberOf paths
		 * @type {string}
		 */
		get toMarkup () {
			let paths = {
				test: '/_HTML/dist/',
				ftp: './'
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к корневой диретории со всеми медиа файлами.
		 * @memberOf paths
		 * @type {string}
		 */
		get media () {
			let paths = {
				test: `${this.markup}Media/`,
				ftp: `${this.root}media/`
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к корневой диретории со всеми медиа файлами для браузера.
		 * Используеться внутри разметки
		 * @memberOf paths
		 * @type {string}
		 */
		get toMedia () {
			let paths = {
				test: `${this.toMarkup}Media/`,
				ftp: 'media/'
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к диретории, в которую будет компилироваться медиа файлы разработки.
		 * @memberOf paths
		 * @type {string}
		 */
		get assets () {
			let paths = {
				test: `${this.media}assets/`,
				ftp: `${this.media}assets/`
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Путь к медиа файлам разработки в браузере
		 * и в webpack сборке, как часть пути - publicPath: `${paths.toAssets}js/`
		 * @memberOf paths
		 * @type {string}
		 */
		get toAssets () {
			let paths = {
				test: `${this.toMedia}assets/`,
				ftp: `${this.toMedia}assets/`
			};
			return paths[configSystem.runningVersion];
		},

		/**
		 * Названния корневых, итоговых, директорий
		 * которые будут удаляться при очистке или билде проекта
		 *
		 * Удалять существующий набор запрещенно!
		 * Можно только добавлять для использования в задачах сборки
		 * и очистке перед построением проекта.
		 *
		 * Если вы добавите еще директории
		 * укажите это в _HTML/README.md -> раздел - Важная информация!
		 * @memberOf paths
		 * @type {Array}
		 */
		get clearFolders () {
			return [
				this.markup,
				`${this.assets}`
			];
		}
	},

	/**
	 * FTP пресеты соединения
	 * @type {Object}
	 * @private
	 */
	ftpPresets: {
		inkubator: {
			host: '91.200.60.72',
			user: 'inkubator',
			pass: '6N7h4U9p',
			parallel: 10
		}
	},

	/**
	 * Список вотчеров
	 * @type {Object}
	 * @prop {Object} list
	 * @prop {Function} push
	 * @sourceCode
	 */
	watchers: {
		list: {},
		push (item) {
			if (configSystem.argv.watch && this.list[item.taskName] === undefined) {
				this.list[item.taskName] = item.src;
			}
		}
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = configSystem;
