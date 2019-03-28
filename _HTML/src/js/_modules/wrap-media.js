'use strict';

/**
 * Оборачивание элементов для пропорцинальной адаптации
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/dist/has-inited-key';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} [selector=".js-form"]- поиск элементов по селектору
 * @param {jQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */
function wrapMedia (selector, $context = null) {
	let $elements = (selector && selector.jquery) ? selector : $(selector, $context);
	$elements.each((i, el) => {
		let $el = $(el);
		if ($el.hasInitedKey('wrap-media', false)) {
			return true;
		}

		let width = parseInt($el.attr('width') || $el[0].offsetWidth);
		let height = parseInt($el.attr('height') || $el[0].offsetHeight);
		let ratio = parseFloat((height / width * 100).toFixed(2));

		$el.unwrap('p').wrap(`
		<div class="ratio-wrapper" style="max-width:${width}px;margin-left:auto;margin-right:auto;">
			<div class="ratio" style="padding-top:${ratio}%;"></div>
		</div>
		`);

		console.log($el);
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default wrapMedia;
