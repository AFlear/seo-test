'use strict';

/**
 * Инициализация плагина Magnific Popup
 * @module
 * @see {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html}
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'magnific-popup';
import merge from 'lodash/merge';
import validation from './validation';
import horizontalScroll from './horizontal-scroll';
import wrapMedia from './wrap-media';

// ----------------------------------------
// Private
// ----------------------------------------

// переводы для плагина
(function ($, jsTranslations = {}) {
	let {mfp} = jsTranslations;
	if (!mfp) {
		return false;
	}

	$.extend(true, $.magnificPopup.defaults, {
		tClose: mfp.tClose,
		tLoading: mfp.tLoading,
		gallery: {
			tPrev: mfp.tPrev,
			tNext: mfp.tNext,
			tCounter: mfp.tCounter
		},
		image: {
			tError: mfp.tErrorImage
		},
		ajax: {
			tError: mfp.tError
		},
		inline: {
			tNotFound: mfp.tNotFound
		}
	});
})(window.jQuery, window.jsTranslations);

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} [selector=".js-form"]- поиск элементов по селектору
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @param {jQuery} [$wrapper=$('body')] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */
function mfpAjax (selector = '.js-mfp-ajax', userConfig = {}, $wrapper = $('body')) {
	const config = merge({
		mainClass: 'zoom-in',
		type: 'ajax',
		delegate: selector,
		removalDelay: 300,
		callbacks: {
			elementParse (item) {
				let {
					url,
					type = 'POST',
					param: data = {}
				} = item.el.data();
				this.st.ajax.settings = {url, type, data};
			},
			ajaxContentAdded () {
				let $container = this.contentContainer || [];
				if ($container) {
					horizontalScroll('.wysiwyg table', $container);
					wrapMedia('.wysiwyg iframe, .wysiwyg video', $container);
					validation('.js-form', $container);
				}
			}
		}
	}, userConfig);

	$wrapper.magnificPopup(config);
}

// ----------------------------------------
// Exports
// ----------------------------------------

export {mfpAjax};
