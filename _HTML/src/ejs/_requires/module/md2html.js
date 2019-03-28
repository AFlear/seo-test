'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Function}
 * @private
 */
function wrapper (app) {
	const marked = require('marked');
	const lodash = require('lodash');
	// выгружаем инструменты
	const {El} = app.el;

	// пользовательские параметры рендера
	const renderer = new marked.Renderer();
	renderer.heading = function (text, level) {
		return `<h${level}>${text}</h${level}>`;
	};

	renderer.code = function (code, lang) {
		let langClass = lang ? `language-${lang}` : false;
		let $code = new El('code', {class: langClass}, $el => {
			$el.textContent = code;
		});
		return `<pre>${$code}</pre>`;
	};

	renderer.link = function (href, title, text) {
		if (!title) {
			title = href;
		}

		let target = /^http(s)?:\/\//i.test(href) ? '_blank' : false;
		let link = new El('a', {href, title, target});
		link.innerHTML = text;
		return String(link);
	};

	// дефолтные параметры рендера
	// https://www.npmjs.com/package/marked#options-1
	const defaultOptions = {
		renderer,
		gfm: true,
		tables: true,
		breaks: true,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: true
	};

	/**
	 * Конвертация `markdown` в `html`
	 * [Список доступных параметров конвертации](https://www.npmjs.com/package/marked#options-1)
	 *
	 * @param {string} src - путь к `md` файлу, относительно директрии `includes` которая указавается в параметрах `gulp` задачи
	 * @param {Object} [options={}] - кастомные параметры рендера, объединяются с дефолтными
	 * @param {marked.Renderer} [options.renderer]
	 * @param {boolean} [options.gfm=true]
	 * @param {boolean} [options.tables=true]
	 * @param {boolean} [options.breaks=true]
	 * @param {boolean} [options.pedantic=false]
	 * @param {boolean} [options.sanitize=false]
	 * @param {boolean} [options.smartLists=true]
	 * @param {boolean} [options.smartypants=true]
	 *
	 * @memberOf app.module
	 * @requires {@link https://www.npmjs.com/package/marked}
	 * @requires {@link https://www.npmjs.com/package/lodash}
	 * @requires app.include
	 * @requires app.el.El
	 *
	 * @tutorial app.module.md2html
	 * @sourceCode
	 */
	function md2html (src, options = {}) {
		/**
		 * markdown file
		 * @type {Object}
		 * @prop {boolean} changed
		 * @prop {string} content
		 * @private
		 */
		let mdFile = app.include(src);
		if (mdFile.changed) {
			let markedOptions = lodash.merge({}, defaultOptions, options);
			// переписать содержимое кэшированного файла до тех пор, пока он не будет изменен
			mdFile.content = marked(mdFile.content, markedOptions);
		}
		return mdFile;
	}

	return md2html;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
