'use strict';

/**
 * Инит inputmask для телефонов
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'inputmask/dist/jquery.inputmask.bundle';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} [selector=".js-form"]- поиск элементов по селектору
 * @param {jQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */

function phoneMask (selector, $context = null) {
	let $inputs = (selector && selector.jquery) ? selector : $(selector, $context);

	$inputs.each((i, el) => {
		let $input = $(el);
		if ($input.hasInitedKey('inputmask-inited')) {
			return true;
		}

		let mask = $input.data('phoneMask') || '+38(999) 99-99-999';

		if (window.Modernizr.android5) {
			mask = $input.data('android-fix-mask') || '+999999999999';
		}

		$input.inputmask({
			mask: mask,
			androidHack: window.Modernizr.android,
			disablePredictiveText: window.Modernizr.android,
			oncomplete () {
				$input.data('valid', true);
			},
			onincomplete () {
				$input.data('valid', false);
			}
		}).on('change.isComplete', () => {
			$input.data('valid', $input.inputmask('isComplete'));
		});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default phoneMask;
