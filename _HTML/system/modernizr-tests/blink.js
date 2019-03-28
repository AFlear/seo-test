/* eslint-disable spaced-comment */
/*!
{
  "name": "blink",
  "property": "blink"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **blink** браузеров
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name blink
	 */
	Modernizr.addTest(
		'blink',
		function () {
			var ua = window.navigator.userAgent.toLowerCase();
			return ((window.chrome || (window.Intl && window.Intl.v8BreakIterator)) && 'CSS' in window) && !(ua.indexOf(' edge/') > 0);
		}
	);
});
