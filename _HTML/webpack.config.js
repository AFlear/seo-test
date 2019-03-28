'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const webpack = require('webpack');

const logger = require('./system/utils/logger');
const {argv, paths, isWebpack} = require('./system/config');

// ----------------------------------------
// Private
// ----------------------------------------

// Уведомление о старте работ
logger('yellow', '', 'Starting webpack...');

/**
 * Список плагинов для использования
 * @const {Array}
 * @private
 */
const plugins = [
	// new BundleAnalyzerPlugin(),
	// не пропускать при ошибках
	new webpack.NoEmitOnErrorsPlugin(),

	// определяем дополнительные флаги,
	// которые будут достпны внутри файлов сборки
	new webpack.DefinePlugin({
		'IS_PRODUCTION': JSON.stringify(argv.production),
		'IS_FTP': JSON.stringify(argv.ftp)
	}),

	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors',
		minChunks (module) {
			// сюда будут сложенны все модули из:
			// - node_modules/
			// - src/js/_vendors/
			let context = module.context;
			return context && (context.indexOf('node_modules') !== -1 || context.indexOf('_vendors') !== -1);
		}
	})
];

if (isWebpack) {
	// выводит прогресс в консоль
	plugins.push(new webpack.ProgressPlugin());
}

if (argv.production) {
	// Если продакшн версия - добавляем минификатор
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		mangle: {
			reserved: ['Modernizr']
		},
		compress: {
			warnings: true
		}
	}));
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Конфигурация сборки `webpack`
 * @const {Object}
 * @sourceCode
 */
const config = {
	entry: {
		initialize: path.join(process.cwd(), 'src/js/entry.js')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(process.cwd(), path.join(paths.assets, '/js/')),
		publicPath: path.join(paths.toAssets, '/js/'),
		chunkFilename: `async-modules/[name].js${argv.production ? '?v=[chunkhash]' : ''}`
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: ['syntax-dynamic-import']
					}
				}]
			}, {
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader?importLoaders=1',
						options: {
							root: '.',
							importLoaders: 1
						}
					}, {
						loader: 'postcss-loader',
						options: {
							plugins () {
								let plugins = [
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
								];

								if (argv.production) {
									plugins.push(
										require('cssnano')({
											zindex: false,
											autoprefixer: false,
											discardUnused: false,
											reduceIdents: false
										})
									);
								}
								return plugins;
							}
						}
					}
				]
			}, {
				test: /\.(png|jpg|jpeg|svg|gif)$/,
				use: ['url-loader']
			}
		]
	},
	resolve: {
		modules: [
			'./node_modules/',
			'./frontend-components/',
			'./src/js'
		]
	},
	plugins: plugins,
	devtool: argv.production ? 'source-map' : 'inline-source-map',
	watch: argv.watch
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = config;
