/* eslint-disable spaced-comment */
/*!
{
  "name": "retina",
  "property": "retina"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **retina** дисплеев
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name retina
	 */
	Modernizr.addTest(
		'retina',
		function () {
			var dpr = window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI) || 1;
			var flag = dpr > 1;
			return !!flag;
		}
	);
});
