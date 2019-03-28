'use strict';

/**
 * B2FAPI - backend 2 frontend api - мини интрефейс
 * для передачи статических значений с учетом сборки сайта.
 * К примеру путь к папке Медиа и тд.
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

;(function(window) {
	/**
	 * @global
	 * @name  B2FAPI
	 * @type  {Object}
	 */
	window.B2FAPI = {
		// список путей
		paths: {
			forms: './hidden/',
			hidden: '',
			media: window.location.hostname === 'inkubator.ks.ua' ? 'media/' : '/Media/'
		}
	};
})(window);
