'use strict';

/**
 * Инит плгина lozad.js
 * @module
 * @see {@link https://github.com/ApoorvSaxena/lozad.js}
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/dist/node-name';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Добавлеям `lazyLoad` к глобальныму объекту `window`
 */
function createLazyLoad () {
	const lozad = require('lozad');
	window.lazyLoad = lozad('.lozad', {
		load (el) {
			let $el = $(el);
			let src = $el.data('src');

			if ($el.nodeName() === 'img') {
				$el.attr('src', src);
			} else {
				$el.css('background-image', `url(${src})`);
			}

			let $parent = $el.parent('.lazy-load');
			if (!$parent.length) {
				$parent = $el;
			}
			setTimeout(() => $parent.addClass('is-ready'), 50);
		}
	});
	window.lazyLoad.observe();
}

// ----------------------------------------
// Public
// ----------------------------------------

(function ($) {
	if (!$('.lozad').length) {
		return false;
	}

	// если уже `lazyLoad` добавлен вызываем
	if (window.lazyLoad) {
		return window.lazyLoad.observe();
	}

	// иначе добавляем
	if (window.Modernizr.intersectionobserver) {
		createLazyLoad();
	} else {
		// грузим асинхронно полифилл если не поддерживается Intersection Observer
		require.ensure([], () => {
			require('intersection-observer');
			createLazyLoad();
		}, 'intersection-observer-polyfill');
	}
})(window.jQuery);
