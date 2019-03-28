'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const path = require('path');
const watchAndTouch = require('gulp-watch-and-touch');

const pkg = require('./package.json');
const logger = require('./system/utils/logger');
const notify = require('./system/utils/notify');
const {task, argv, paths, ftpPresets, watchers, testOne} = require('./system/config');

var browserSync = null;
try {
	browserSync = require('browser-sync').create();
} catch (err) {
	browserSync = {
		reload: () => logger('gray', 'browserSync pseudo reload'),
		init: () => logger('gray', 'browserSync pseudo init'),
		stream: () => logger('gray', 'browserSync pseudo stream'),
		getOption: () => logger('gray', 'browserSync pseudo getOption'),
		exit: () => logger('gray', 'browserSync pseudo exit')
	};
}

// ----------------------------------------
// Private
// ----------------------------------------

// Уведомление о старте работ
logger('yellow', '', 'Starting gulp...');

const {
	// список задач для запуска с дефолтной задачей
	run: runningTasks,
	// список задач для фонового запуска с дефолтной задачей
	bg: bgTasks
} = argv;

/**
 * Проверка задачи и создание
 * @private
 * @param {string} task - имя задачи
 * @returns {boolean|undefined} - флаг проверки
 */
function hasTask (task) {
	if (task === undefined) {
		return false;
	}
	let has = typeof gulpTasks[task] === 'function';
	if (has) {
		logger('gray', `Create a task "${task}"`);
		gulpTasks[task]();
	} else {
		logger('red', `Task "${task}" - is not defined, skipping creation!`);
	}
	return has;
}

/**
 * Проверка массива задач
 * @private
 * @param {Array|null} list - список задач
 * @returns {Array} - если задач нету - пустой массив
 */
function mapTasks (list) {
	if (Array.isArray(list)) {
		return list.filter(task => {
			if (hasTask(task)) {
				return task;
			}
		});
	}
	return [];
}

/**
 * Определение локальной директории
 * @private
 * @returns {string}
 */
function localFolder () {
	let folder = '';
	let getFolder = (arr = path.normalize(process.cwd()).replace(/(\\)+/g, '/').split('/')) => {
		folder = arr.pop();
		if (~pkg.projectFolders['ignore-detect'].indexOf(folder)) {
			getFolder(arr);
		}
	};
	getFolder();
	return folder;
}

// ----------------------------------------
// Public
// ----------------------------------------

// Список задач
const gulpTasks = {
	/**
	 * Генерация критикал стилей
	 * @name gulp critical
	 * @global
	 */
	'critical' () {
		const createConfig = require('./critical.config');
		const gulpTask = require('./system/tasks/critical');
		return gulpTask('critical', createConfig, browserSync);
	},

	/**
	 * Составление списка `todo` на основе комментариев разметки
	 * @name gulp todo
	 * @global
	 */
	'todo' () {
		const gulpTask = require('./system/tasks/todo');
		const taskPaths = {
			src: [
				'./todo-banner.md',
				path.join(paths.markup, '*.{php,html}'),
				'!' + path.join(paths.markup, 'ui*')
			],
			dest: '../'
		};
		return gulpTask('todo', taskPaths);
	},

	/**
	 * Очистка всех директорий сборки путей
	 * @name gulp clear
	 * @global
	 */
	'clear' () {
		const taskName = 'clear';
		const gulpTask = require('./system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: paths.clearFolders
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Составление `svg` спрайта
	 * @name gulp svg-sprite
	 * @global
	 */
	'svg-sprite' () {
		const taskName = 'svg-sprite';
		const gulpTask = require('./system/tasks/svg-sprite');
		const SvgList = require('./system/utils/svg-list');
		const svgList = new SvgList();

		const taskPaths = {
			src: [
				'./src/svg-sprite/from-parser-only/*.svg',
				'./src/svg-sprite/simple-icons/*.svg'
			],
			destIcons: path.join(paths.assets, '/images/sprites/'),
			destList: './src/ejs/_requires/data/', // путь также используется в задаче 'ejs-markup'
			listName: 'svg-list'
		};

		const options = {
			// gulp-cheerio
			cheerio: {
				run ($) {
					$('symbol').each((i, symbol) => svgList.push($(symbol)));
				},
				parserOptions: {
					xmlMode: true
				}
			},
			// gulp-cheerio
			cheerioNotFromParser: {
				run ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: {
					xmlMode: true
				}
			},
			// gulp-svgmin
			svgmin: {
				js2svg: {
					pretty: true
				}
			},
			// gulp-svg-sprite
			svgSprite: {
				svg: {
					namespaceIDs: false
				},
				shape: {
					transform: [{
						svgo: {
							plugins: [{
								cleanupIDs: false
							}]
						}
					}
					]
				},
				mode: {
					symbol: {
						sprite: '../icons'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, svgList);
	},

	/**
	 * Рендер ejs разметки
	 * @name gulp ejs-markup
	 * @global
	 */
	'ejs-markup' () {
		const taskName = 'ejs-markup';
		const gulpTask = require('./system/tasks/ejs');
		const lodash = require('lodash');
		const beautify = require('./system/utils/beautify');

		const ejsFileWatcher = watchAndTouch(gulp);

		const jsdom = require('jsdom');
		const {JSDOM} = jsdom;
		const {document} = (
			new JSDOM(`...`)
		).window;

		const taskPaths = {
			src: [
				'./src/ejs/hidden/**/*.ejs',
				'./src/ejs/*.ejs'
			],
			base: './src/ejs/',
			dest: paths.markup
		};

		const options = {
			ejs: {
				layouts: './src/ejs/_layouts',
				widgets: './src/ejs/_widgets',
				includes: './src/ejs/_includes',
				requires: './src/ejs/_requires', // путь также используется в задаче 'svg-sprite'
				compileDebug: argv.verbose && argv.debug,
				showHistory: argv.debug,
				showHistoryOnCrash: argv.verbose || argv.debug,
				extname: '.html',
				delimiter: '%',
				localsName: 'app',
				locals: {
					createEl (tag = 'div') {
						return document.createElement(tag);
					},
					createElSVG (qualifiedName = 'svg') {
						return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
					},
					data: {
						testOne,
						pkg: lodash.cloneDeep(pkg),
						argv: lodash.cloneDeep(argv),
						paths: lodash.cloneDeep(paths),
						ejsPaths: {
							localFolder: localFolder(),
							cwd: process.cwd(),
							components: path.join(process.cwd(), 'frontend-components'),
							ejsCwd: path.join(process.cwd(), './src/ejs/'),
							includes: './src/ejs/_includes'
						}
					},
					module: {
						logger,
						notify,
						beautify
					}
				},
				afterRender (markup, ...args) {
					if (argv.watch) {
						let sources = args[1];
						let filePath = sources.shift();
						ejsFileWatcher(filePath, filePath, sources);
					}

					if (argv.production) {
						return beautify(markup);
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер статических файлов разметки
	 * @name gulp ejs-assets
	 * @global
	 */
	'ejs-assets' () {
		const taskName = 'ejs-assets';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: [
				'./src/ejs/*.!(ejs)',
				'./src/ejs/.*',
				'./src/ejs/hidden/**/*.!(ejs)',
				'./src/ejs/hidden/**/.*',
				'./frontend-components/**/ejs/*.!(ejs)',
				'./frontend-components/**/ejs/hidden/**/*.!(ejs)',
				'./frontend-components/**/ejs/.*',
				'./frontend-components/**/ejs/hidden/**/.*'
			],
			dest: paths.markup,
			base: './src/ejs/',
			baseReplace: /^.*(\\|\/)ejs(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории разметки
	 * @name gulp ejs-clear
	 * @global
	 */
	'ejs-clear' () {
		const taskName = 'ejs-clear';
		const gulpTask = require('./system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: paths.markup
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов разметки
	 * @name gulp ejs-lint
	 * @global
	 */
	'ejs-lint' () {
		const taskName = 'ejs-lint';
		const gulpTask = require('./system/tasks/happiness');

		const taskPaths = {
			src: [
				'./src/ejs/_requires/**/*.js',
				'./frontend-components/**/ejs/_requires/**/*.js'
			]
		};

		let firstRun = true;
		const options = {
			happiness: {
				linting: {
					noUnderscore: false,
					fix: argv.fix,
					linterOptions: {
						globals: ['app']
					}
				},
				format: {
					noUnderscore: false,
					showHappyFiles: argv.verbose
				},
				failAfterError: {
					noUnderscore: false,
					disabled: argv.watch,
					onEnd (err) {
						if (err) {
							notify.onError('Lint Error', taskName);
						} else {
							if (argv.notify) {
								notify.onDone('ESLint - happiness code style', 'Errors not found!');
							} else {
								logger('cyan', 'ESLint - happiness code style', 'Errors not found!');
							}
							if (argv.watch && !firstRun) {
								logger('yellow', 'При повторном запуске с вотчем - линтинг применяется к изменившимся файлaм!', 'Поэтому могут остаться файлы без проверки, которых вы могли забыть');
							}
						}
						firstRun = false;
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * EJS документация
	 * @name gulp ejs-docs
	 * @global
	 */
	'ejs-docs' () {
		const taskName = 'ejs-docs';
		const gulpTask = require('./system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./system/docs-assets/ejs/index.md',
				'./src/ejs/_requires/**/*.js',
				'./frontend-components/**/ejs/_requires/**/*.js'
			],
			dest: './api-docs/ejs'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './system/docs-assets/ejs/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'EJS API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src.concat([
				'./system/docs-assets/ejs/tutorials/*.*'
			])
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Сканирование тестов `modernizr` и построение файла библиотеки
	 * @name gulp modernizr
	 * @global
	 */
	'modernizr' () {
		const taskName = 'modernizr';
		const gulpTask = require('./system/tasks/modernizr');

		const taskPaths = {
			src: [
				path.join(paths.assets, '/css/**/*.css'),
				path.join(paths.assets, '/js/**/*.js'),
				'!' + path.join(paths.assets, '/js/modernizr.js')
			],
			dest: path.join(paths.assets, '/js/')
		};

		const options = {

			modernizr: {
				customTests: './system/modernizr-tests/',
				options: [
					'addTest',
					'setClasses',
					'mq'
				],
				tests: [
					'touchevents'
				],
				excludeTests: [
					// 'opacity'
				]
			},
			// gulp-uglify
			uglify: {
				mangle: {
					reserved: ['Modernizr']
				},
				compress: {
					warnings: true
				}
			}
		};

		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Компиляция критикал скриптов
	 * @name gulp js-critical
	 * @global
	 */
	'js-critical' () {
		const taskName = 'js-critical';
		const gulpTask = require('./system/tasks/js');

		const taskPaths = {
			src: [
				'./src/js/critical/**/*.js',
				'./frontend-components/**/js/critical/**/*.js'
			],
			dest: path.join(paths.assets, '/js/critical/')
		};

		const options = {
			// gulp-babel
			babel: {
				presets: ['env'],
				plugins: ['syntax-dynamic-import']
			},
			// gulp-uglify
			uglify: {
				mangle: {
					reserved: ['Modernizr']
				},
				compress: {
					warnings: true
				}
			},
			// gulp-include
			include: {
				extension: 'js',
				hardFail: true,
				includePaths: [
					path.join(process.cwd(), './node_modules/'),
					path.join(process.cwd(), './src/js/')
				]
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, false, true);
	},

	/**
	 * Трансфер статических файлов скриптов
	 * @name gulp js-static
	 * @global
	 */
	'js-static' () {
		const taskName = 'js-static';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: [
				'./src/js/static/**/*.*',
				'./frontend-components/**/js/static/**/*.*'
			],
			dest: path.join(paths.assets, '/js/static'),
			base: './src/js/static/',
			baseReplace: /^.*(\\|\/)js(\\|\/)static(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории скриптов
	 * @name gulp js-clear
	 * @global
	 */
	'js-clear' () {
		const taskName = 'js-clear';
		const gulpTask = require('./system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: path.join(paths.assets, '/js/')
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов разработки
	 * @name gulp js-lint
	 * @global
	 */
	'js-lint' () {
		const taskName = 'js-lint';
		const gulpTask = require('./system/tasks/happiness');

		const taskPaths = {
			src: [
				'./src/js/**/*.js',
				'./frontend-components/**/js/**/*.js',
				'!./src/js/static/**',
				'!./src/js/_vendors/**',
				'!./frontend-components/**/js/_vendors/**',
				'!./frontend-components/**/js/static/**/**'
			]
		};

		let firstRun = true;
		const options = {
			happiness: {
				linting: {
					noUnderscore: false,
					fix: argv.fix,
					linterOptions: {
						env: {
							browser: true
						},
						globals: ['$', 'IS_PRODUCTION', 'IS_FTP']
					}
				},
				format: {
					noUnderscore: false,
					showHappyFiles: argv.verbose
				},
				failAfterError: {
					noUnderscore: false,
					disabled: argv.watch,
					onEnd (err) {
						if (err) {
							notify.onError('Lint Error', taskName);
						} else {
							if (argv.notify) {
								notify.onDone('ESLint - happiness code style', 'Errors not found!');
							} else {
								logger('cyan', 'ESLint - happiness code style', 'Errors not found!');
							}
							if (argv.watch && !firstRun) {
								logger('yellow', 'При повторном запуске с вотчем - линтинг применяется к изменившимся файлaм!', 'Поэтому могут остаться файлы без проверки, которых вы могли забыть');
							}
						}
						firstRun = false;
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * JavaScript API документация
	 * @name gulp js-docs
	 * @global
	 */
	'js-docs' () {
		const taskName = 'js-docs';
		const gulpTask = require('./system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./system/docs-assets/js/index.md',
				'./src/js/**/*.js',
				'./frontend-components/**/js/**/*.js',
				'!./src/js/static/**',
				'!./src/js/_vendors/**',
				'!./frontend-components/**/js/_vendors/**',
				'!./frontend-components/**/js/static/**/**'
			],
			dest: './api-docs/js'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './system/docs-assets/js/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'JavaScript API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Рендер стилей
	 * @name gulp sass-main
	 * @global
	 */
	'sass-main' () {
		const taskName = 'sass-main';
		const gulpTask = require('./system/tasks/sass');
		const sassFileWatcher = watchAndTouch(gulp);

		const taskPaths = {
			src: ['./src/sass/*.scss'],
			dest: path.join(paths.assets, '/css/')
		};

		const options = {
			sass: {
				includePaths: [
					'./node_modules/',
					'./frontend-components/'
				],
				addVariables: {
					argv: {
						production: argv.production,
						ftp: argv.ftp
					}
				},
				afterRender (result, file) {
					if (argv.watch) {
						let filePath = file.path;
						let sources = result.stats.includedFiles;
						if (sassFileWatcher(filePath, filePath, sources)) {
							logger('cyan', `New imports for ${file.stem}.scss [${sources.length}]`);
						}
					}
				}
			},
			postcss: [
				require('autoprefixer')({
					browsers: [
						'> 1%',
						'ie 11'
					],
					cascade: false
				}),
				require('css-mqpacker')({
					sort: require('sort-css-media-queries')
				})
			]
		};

		if (argv.production) {
			options.postcss.push(
				require('cssnano')({
					zindex: false,
					autoprefixer: false,
					discardUnused: false,
					reduceIdents: false
				})
			);
		}

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, true);
	},

	/**
	 * Рендер критикал стилей
	 * @name gulp sass-critical
	 * @global
	 */
	'sass-critical' () {
		const taskName = 'sass-critical';
		const gulpTask = require('./system/tasks/sass');
		const sassFileWatcher = watchAndTouch(gulp);

		const taskPaths = {
			src: [
				'./src/sass/critical/**/*.scss',
				'./frontend-components/**/sass/critical/**/*.scss'
			],
			dest: path.join(paths.assets, '/css/critical/')
		};

		const options = {
			sass: {
				includePaths: [
					'./node_modules/',
					'./frontend-components/'
				],
				addVariables: {
					argv: {
						production: argv.production,
						ftp: argv.ftp
					}
				},
				afterRender (result, file) {
					if (argv.watch) {
						let filePath = file.path;
						let sources = result.stats.includedFiles;
						if (sassFileWatcher(filePath, filePath, sources)) {
							logger('cyan', `New imports for ${file.stem}.scss [${sources.length}]`);
						}
					}
				}
			},
			postcss: [
				require('autoprefixer')({
					browsers: [
						'> 1%',
						'ie 11'
					],
					cascade: false
				}),
				require('css-mqpacker')({
					sort: require('sort-css-media-queries')
				}),
				require('cssnano')({
					zindex: false,
					autoprefixer: false,
					discardUnused: false,
					reduceIdents: false
				})
			]
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер статических файлов стилей
	 * @name gulp sass-assets
	 * @global
	 */
	'sass-assets' () {
		const taskName = 'sass-assets';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: [
				'./src/sass/**/*.!(scss)',
				'./frontend-components/**/sass/**/*.!(scss)',
				'!./src/sass/_vendors/**',
				'!./frontend-components/**/sass/_vendors/**'
			],
			dest: path.join(paths.assets, '/css/'),
			base: './src/sass/',
			baseReplace: /^.*(\\|\/)sass(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории стилей
	 * @name gulp sass-clear
	 * @global
	 */
	'sass-clear' () {
		const taskName = 'sass-clear';
		const gulpTask = require('./system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: path.join(paths.assets, '/css/')
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг scss стилей разработки
	 * @name gulp sass-lint
	 * @global
	 */
	'sass-lint' () {
		const taskName = 'sass-lint';
		const gulpTask = require('./system/tasks/happiness-scss');

		const taskPaths = {
			src: [
				'./src/sass/**/*.scss',
				'./frontend-components/**/sass/**/*.scss',
				'!./src/sass/critical/generated/**',
				'!./src/sass/_vendors/**',
				'!./frontend-components/**/sass/_vendors/**'
			]
		};

		let firstRun = true;
		const options = {
			happinessScss: {
				linting: {
					noUnderscore: false
				},
				format: {
					noUnderscore: false,
					showHappyFiles: argv.verbose
				},
				failAfterError: {
					noUnderscore: false,
					disabled: argv.watch,
					onEnd (err) {
						if (err) {
							notify.onError('Lint Error', taskName);
						} else {
							if (argv.notify) {
								notify.onDone('SassLint - happiness-scss code style', 'Errors not found!');
							} else {
								logger('cyan', 'SassLint - happiness-scss code style', 'Errors not found!');
							}
							if (argv.watch && !firstRun) {
								logger('yellow', 'При повторном запуске с вотчем - линтинг применяется к изменившимся файлaм!', 'Поэтому могут остаться файлы без проверки, которых вы могли забыть');
							}
						}
						firstRun = false;
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Sass документация
	 * @name gulp sass-docs
	 * @global
	 */
	'sass-docs' () {
		const taskName = 'sass-docs';
		const gulpTask = require('./system/tasks/sassdoc');

		const taskPaths = {
			src: [
				'./src/sass/**/*.scss',
				'./frontend-components/**/sass/**/*.scss',
				'!./src/sass/critical/generated/**',
				'!./src/sass/_vendors/**',
				'!./frontend-components/**/sass/_vendors/**'
			],
			dest: './api-docs/sassdoc'
		};

		const options = {
			sassdoc: {
				verbose: argv.verbose,
				dest: taskPaths.dest,
				package: require('./package.json'),
				display: {
					access: [
						'public',
						'private'
					],
					alias: true,
					watermark: true
				},
				groups: {
					'undefined': 'Без группы'
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Туториалы
	 * @name gulp sass-tutorials
	 * @global
	 */
	'sass-tutorials' () {
		const taskName = 'sass-tutorials';
		const gulpTask = require('./system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./system/docs-assets/sass-tutorials/index.md',
				'./system/docs-assets/sass-tutorials/index.js'
			],
			dest: './api-docs/sass-tutorials'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './system/docs-assets/sass-tutorials/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'SASS tutorials',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Трансфер статических файлов
	 * @name gulp static-assets
	 * @global
	 */
	'static-assets' () {
		const taskName = 'static-assets';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: [
				'./src/assets/**/*.*',
				'./src/assets/**/.*',
				'./frontend-components/**/assets/**/*.*',
				'./frontend-components/**/assets/**/.*'
			],
			dest: paths.assets,
			baseReplace: /^.*assets\\/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер favicon.ico в корень проекта
	 * @name gulp static-assets
	 * @global
	 */
	'favicon-ico' () {
		const taskName = 'favicon-ico';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: './src/assets/favicons/favicon.ico',
			dest: paths.root
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории ститеческих файлов
	 * @name gulp static-clear
	 * @global
	 */
	'static-clear' () {
		const taskName = 'static-clear';
		const gulpTask = require('./system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: [
				path.join(paths.assets, '/**/'),
				'!' + paths.assets,
				'!' + path.join(paths.assets, '/css/**/'),
				'!' + path.join(paths.assets, '/js/**/')
			]
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов сборки проекта
	 * @name gulp system-lint
	 * @global
	 */
	'system-lint' () {
		const taskName = 'system-lint';
		const gulpTask = require('./system/tasks/happiness');

		const taskPaths = {
			src: [
				'./*.js',
				'./system/**/*.js'
			]
		};

		let firstRun = true;
		const options = {
			happiness: {
				linting: {
					noUnderscore: false,
					fix: argv.fix,
					linterOptions: {
						globals: ['define', 'describe', 'it']
					}
				},
				format: {
					noUnderscore: false,
					showHappyFiles: argv.verbose
				},
				failAfterError: {
					noUnderscore: false,
					disabled: argv.watch,
					onEnd (err) {
						if (err) {
							notify.onError('Lint Error', taskName);
						} else {
							if (argv.notify) {
								notify.onDone('ESLint - happiness code style', 'Errors not found!');
							} else {
								logger('cyan', 'ESLint - happiness code style', 'Errors not found!');
							}
							if (argv.watch && !firstRun) {
								logger('yellow', 'При повторном запуске с вотчем - линтинг применяется к изменившимся файлaм!', 'Поэтому могут остаться файлы без проверки, которых вы могли забыть');
							}
						}
						firstRun = false;
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * API документация по файлам сборки
	 * @name gulp system-docs
	 * @global
	 */
	'system-docs' () {
		const taskName = 'system-docs';
		const gulpTask = require('./system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./system/docs-assets/system/index.md',
				'./*.js',
				'./system/**/*.js'
			],
			dest: './api-docs/system'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './system/docs-assets/system/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'System API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Создание главной страницы для разделов документации
	 * @name gulp docs-index
	 * @global
	 */
	'docs-index' () {
		const taskName = 'docs-index';
		const gulpTask = require('./system/tasks/assets');

		const taskPaths = {
			src: [
				'./system/docs-assets/index/**/*.*'
			],
			dest: './api-docs/'
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Выгрузка документации на инкубатор
	 * @name gulp docs-upload
	 * @global
	 */
	'docs-upload' () {
		const taskName = 'docs-upload';
		const gulpTask = require('./system/tasks/upload');
		const lodash = require('lodash');

		const taskPaths = {
			src: [
				'./api-docs/**/*.*'
			]
		};

		const options = {
			vinylFtp: lodash.merge(ftpPresets.inkubator, {
				remotePath: `www/inkubator.ks.ua/docs/${pkg.projectFolders.inkubator}/`
			})
		};
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Установка вотчей
	 * @name gulp watch
	 * @global
	 */
	'watch' () {
		gulp.task('watch', done => {
			let {list} = watchers;
			if (Object.keys(list).length) {
				for (let task in list) {
					let src = list[task];
					gulp.watch(src, gulp.series(task));
				}
			} else {
				logger('red', 'No list of watchers');
			}
			done();
		});
	},

	/**
	 * Инит сервера browser-sync
	 * @name gulp bs
	 * @global
	 */
	'bs' () {
		gulp.task('bs', done => {
			function setupOptions () {
				let enable = /* WS-REPLACE=>`${data.bs.enable}` */true/* WS-REPLACE-END */;
				let useHost = /* WS-REPLACE=>`${data.bs.host}` */true/* WS-REPLACE-END */;
				let useStatic = /* WS-REPLACE=>`${data.bs.static}` */false/* WS-REPLACE-END */;
				let openOnInit = argv.open ? 'external' : false;

				if (!enable) {
					return null;
				}

				if (useStatic) {
					// параметры статического сервера
					return {
						open: openOnInit,
						server: {
							baseDir: paths.markup
						}
					};
				}

				if (useHost) {
					let folder = localFolder();

					// параметры прокируемого сервера с именнованым хостом
					return {
						open: openOnInit,
						port: 4000,
						host: folder,
						proxy: `http://${folder + paths.toMarkup}`
					};
				}

				// дефолтные параметры инита
				return {
					open: openOnInit,
					port: 4000
				};
			}

			const options = setupOptions();
			if (options === null) {
				logger('red', 'browser-sync - disabled!');
				return done();
			}

			if (argv.bsWebpack) {
				let webpack = require('webpack');
				let webpackDevMiddleware = require('webpack-dev-middleware');
				let WriteFilePlugin = require('write-file-webpack-plugin');

				let notify = require('./system/utils/notify');
				let webpackConfig = require('./webpack.config');
				let icon = path.join(process.cwd(), './system/notify-icons/webpack.png');
				let wasErrors = false;
				let getEmittedAssets = (assets) => {
					let arr = [];
					for (let chunk in assets) {
						if (assets[chunk].emitted) {
							arr.push(chunk);
						}
					}
					return arr;
				};

				webpackConfig.plugins.push(new WriteFilePlugin());
				let bundler = webpack(webpackConfig);

				bundler.plugin('done', stats => {
					if (stats.hasErrors() || stats.hasWarnings()) {
						wasErrors = true;
						notify.onError('webpack build', stats.toString(), icon);
					} else if (wasErrors) {
						notify.onResolved('webpack build');
						wasErrors = false;
					}
					let assets = getEmittedAssets(stats.compilation.assets);

					if (assets.length) {
						browserSync.reload();
					}
				});

				options.middleware = [
					webpackDevMiddleware(bundler, {
						publicPath: webpackConfig.output.publicPath,
						stats: {
							colors: true
						}
					})
				];
			}
			browserSync.init(options, done);
		});
	},

	/**
	 * Выгрузка проекта верстки на инкубатор
	 * @name gulp ftp-upload
	 * @global
	 */
	'ftp-upload' () {
		const taskName = 'ftp-upload';
		const lodash = require('lodash');
		const gulpTask = require('./system/tasks/upload');

		const taskPaths = {
			src: ['./tmp/ftp/**/*.*']
		};

		const options = {
			vinylFtp: lodash.merge(ftpPresets.inkubator, {
				remotePath: `www/inkubator.ks.ua/html/${pkg.projectFolders.inkubator}/`
			})
		};
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Дефолтная задача
	 * @name gulp default
	 * @global
	 */
	'default' () {
		let runSeries = mapTasks(runningTasks);
		mapTasks(bgTasks);
		if (runSeries.length) {
			return gulp.task('default', gulp.series(...runSeries));
		}

		gulp.task('default', done => {
			logger('red', '', 'You did not specify a task list, example:');
			logger.command('gulp --run "<task-1>, <task-2>, ...<task-n>"');
			console.log('');
			done();
		});
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

if (hasTask(task) !== true && task === undefined) {
	for (let key in gulpTasks) {
		hasTask(key);
	}
}
