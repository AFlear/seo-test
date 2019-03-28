'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param app
 * @returns {app.el.ElSVG}
 * @private
 */
function wrapper (app) {
	const {El} = app.el;

	/**
	 * @classDesc Обертка создания SVG Элемента
	 * @memberOf app.el
	 * @param {string} tag - имя элемента
	 * @param {Object} [props={}] - свойства элемента
	 * @param {Function} [done] - коллбек создания
	 * @returns {Element}
	 * @requires app.createElSVG
	 * @requires app.el.El.setProps
	 */
	class ElSVG {
		constructor (tag, props = {}, done) {
			let $element = app.createElSVG(tag);
			El.setProps($element, props);
			if (done) {
				done($element);
			}
			return $element;
		}
	};

	return ElSVG;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
