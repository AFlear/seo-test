'use strict';

/**
 * Основной, глобальный, объект, хранищий все локальные данные и методы
 * для работы ejs шаблонизатора.
 * @namespace app
 * @see module:docs
 */

/**
 * Основной лейаут страниц
 * @module core
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Object} app - {@link app}
 * @sourceCode
 */
function coreExtend (app) {
	// fallback
	let list = ['data', 'module', 'el'];
	list.forEach(prop => {
		if (!app.hasOwnProperty(prop)) {
			app[prop] = {};
		}
	});

	let viewPath = app.viewPath.replace(app.data.ejsPaths.ejsCwd, '');
	viewPath = viewPath.split('\\');
	viewPath.pop();
	viewPath.push(app.viewName);

	app.fileName = app.viewName;

	app.viewName = viewPath.join('--');

	app.module.camel2dash = app.require('module/camel2dash.js');
	app.module.mergeAsArrays = app.require('module/merge-as-arrays.js').bind(app);
	app.module.numberFormat = app.require('module/number-format.js').bind(app);
	app.module.object2php = app.require('module/object2php.js');
	app.module.host = app.require('module/host.js')(app);
	app.module.__ = app.require('module/__.js')(app);
	app.module.media = app.require('module/media.js')(app);
	app.module.insert = app.require('module/insert.js')(app);
	app.module.comment = app.require('module/comment.js')(app);
	app.module.md2html = app.require('module/md2html.js')(app);

	app.data.lang = app.require('data/lang.js');
	app.data.svg = app.require('data/svg-list.js');
	app.data.View = app.require('data/View.js');
	app.data.View.app = app;
	app.data.views = app.require('data/views.js')(app);
	app.data.sitemap = app.require('data/sitemap.js')(app);

	/**
	 * Текущая вьюха рендера
	 * @type {app.data.View}
	 * @memberOf app.data
	 * @sourceCode
	 */
	app.data.currentView = app.data.views[app.viewName] || new app.data.View(app.viewName);

	app.el.El = app.require('el/El.js')(app);
	app.el.ElSVG = app.require('el/ElSVG.js')(app);
	app.el.SvgIcon = app.require('el/SvgIcon.js')(app);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = coreExtend;
