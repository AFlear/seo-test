'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {app.el.El}
 * @private
 */
function wrapper (app) {
	const classnames = require('classnames');
	const lodash = require('lodash');
	const {argv} = app.data;
	const {camel2dash, beautify} = app.module;

	/**
	 * @classDesc Обертка создания HTML Элемента при помощи `jsdom`.
	 * В результате Вы получаете полный экземпляр DOM элемента
	 * который имеет все свойства и методы по WHATWG [DOM](https://dom.spec.whatwg.org/) и [HTML](https://html.spec.whatwg.org/multipage/) стандартам.
	 * Соответствено Вы можете работать с элементам используя стандартную специфкацию
	 *
	 * _Примеры:_
	 *
	 * __Создание элемента__
	 *
	 * ```ejs
	 * <%
	 *     let $block = new app.el.El();
	 *     $block.id = 'test-id';
	 *     $block.title = 'Lorem ipsum dolor sit amet';
	 *     $block.innerHTML = '<i>Lorem ipsum dolor <b>sit amet</b></i>, consectetur adipisicing elit. Amet aspernatur aut dolores esse incidunt ipsam laborum, nam quis voluptate. Cum deserunt doloremque eos mollitia nulla praesentium provident quod rerum saepe?'
	 * %>
	 * <%- $block %>
	 * ```
	 *
	 * _Результат_
	 *
	 * ```markup
	 * &lt;div id=&#34;test-id&#34; title=&#34;Lorem ipsum dolor sit amet&#34;&gt;&lt;i&gt;Lorem ipsum dolor &lt;b&gt;sit amet&lt;/b&gt;&lt;/i&gt;, consectetur adipisicing elit. Amet aspernatur aut dolores esse incidunt ipsam laborum, nam quis voluptate. Cum deserunt doloremque eos mollitia nulla praesentium provident quod rerum saepe?&lt;/div&gt;
	 * ```
	 *
	 *
	 * __Создание элемента с атрибутами__
	 *
	 * ```ejs
	 * <%
	 *     let $block = new app.el.El('div', {
	 *         id: 'test-id',
	 *         title: 'Lorem ipsum dolor sit amet',
	 *         innerHTML: '<i>Lorem ipsum dolor <b>sit amet</b></i>, consectetur adipisicing elit. Amet aspernatur aut dolores esse incidunt ipsam laborum, nam quis voluptate. Cum deserunt doloremque eos mollitia nulla praesentium provident quod rerum saepe?'
	 *     });
	 * %>
	 * <%- $block %>
	 * ```
	 *
	 * _Результат_
	 *
	 * ```markup
	 * &lt;div id=&#34;test-id&#34; title=&#34;Lorem ipsum dolor sit amet&#34;&gt;&lt;i&gt;Lorem ipsum dolor &lt;b&gt;sit amet&lt;/b&gt;&lt;/i&gt;, consectetur adipisicing elit. Amet aspernatur aut dolores esse incidunt ipsam laborum, nam quis voluptate. Cum deserunt doloremque eos mollitia nulla praesentium provident quod rerum saepe?&lt;/div&gt;
	 * ```
	 *
	 * @memberOf app.el
	 * @param {string} [tag='div'] - имя элемента
	 * @param {Object} [props={}] - свойства элемента
	 * @param {Function} [done] - коллбек создания
	 * @returns {HTMLElement}
	 * @requires app.createEl
	 */
	class El {
		constructor (tag = 'div', props = {}, done) {
			let $element = app.createEl(tag);
			El.setProps($element, props);
			if (done) {
				done($element);
			}
			return $element;
		}

		/**
		 * Добавление свойств к элементу
		 * @param {Element|HTMLElement} $element
		 * @param {Object} [props={}]
		 * @sourceCode
		 */
		static setProps ($element, props = {}) {
			if ($element._ELEMENT) {
				throw new Error('Элементу уже добавленны свойства');
			}
			let _elementValue = String($element);

			Object.defineProperty($element, '_ELEMENT', {
				get () {
					return _elementValue.replace('object ', '').slice(1, -1);
				}
			});

			Object.defineProperty($element, '_IsHTML', {
				get () {
					return /^HTML/.test(this._ELEMENT);
				}
			});

			Object.defineProperty($element, '_IsSVG', {
				get () {
					return !this._IsHTML;
				}
			});

			El.classListWrap($element, 'add');
			El.classListWrap($element, 'remove');
			$element.toString = El.toString;

			let nodeName = $element.nodeName.toLowerCase();

			for (let key in props) {
				cycle(key, props[key]);
			}

			function cycle (key, value) {
				if (/^data.+/.test(key)) {
					key = camel2dash(key);
					if (typeof value === 'object' && value !== null) {
						value = JSON.stringify(value);
					}
					$element.setAttribute(key, value);
					return false;
				}

				switch (key) {
					case 'xlink:href':
						$element.setAttribute(key, value);
						break;
					case 'checked':
						if (nodeName === 'input' && !!value) {
							$element.setAttribute(key, '');
						}
						break;
					case 'class':
						$element.classList.add(value);
						break;
					default:
						$element[key] = value;
				}
			}
		}

		/**
		 * Пользовательский метод приведения элемента в строку
		 * @this Element|HTMLElement
		 * @returns {string}
		 * @sourceCode
		 */
		static toString () {
			let markup = this.outerHTML;

			// фикс JSON строк в дата атрибутах
			markup = markup.replace(/(data-(\w|-)+=)("[\{|\[]((?!"[\{|\[]).|\n)*[\}|\]]")/gi, (str, g1, g2, g3) => { // eslint-disable-line
				let val = g3.slice(1, -1).replace(/&quot;/g, '"');
				return `${g1}'${val}'`;
			});

			if (this._IsHTML) {
				markup = markup.replace(/\s((required|readonly|disabled|checked)="")/g, (str, g1, g2) => ` ${g2}`);
			}

			// форматируем на продакшн
			if (argv.production) {
				return beautify(markup);
			}
			return markup;
		}

		/**
		 * Обрертка для работы с методами `add и remove` объекта `classList`
		 * @param {Element|HTMLElement}$element
		 * @param {string} mtd
		 * @requires {@link https://www.npmjs.com/package/classnames}
		 * @sourceCode
		 */
		static classListWrap ($element, mtd) {
			let method = $element.classList[mtd];
			$element.classList[mtd] = function (...values) {
				let classes = classnames(values).split(' ');
				if (classes.length && classes[0] !== '') {
					method.apply(this, classes);
				}
			};
		}

		/**
		 * Добавление атрибута с объекта
		 * @param {Element|HTMLElement} $el
		 * @param {Object} data
		 * @param {string} prop
		 * @sourceCode
		 */
		static setAttr ($el, data, prop) {
			if (data[prop]) {
				$el.setAttribute(prop, data[prop]);
			}
		}

		/**
		 * Объединение свойств
		 * @param {Object} data
		 * @requires {@link https://www.npmjs.com/package/lodash}
		 * @sourceCode
		 */
		static mergeProps (...data) {
			let props = {
				class: []
			};
			data.forEach(list => {
				if (list !== null && !Array.isArray(list) && typeof list === 'object') {
					for (let key in list) {
						let value = list[key];
						switch (key) {
							case 'class':
								props.class.push(value);
								break;
						}
					};
				}
			});

			data.push(props);
			return lodash.merge({}, ...data);
		}
	};

	return El;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
