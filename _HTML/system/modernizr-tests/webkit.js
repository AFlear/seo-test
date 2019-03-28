/* eslint-disable spaced-comment */
/*!
{
  "name": "webkit",
  "property": "webkit"
}
!*/

define(['Modernizr', 'docElement'], function (Modernizr, docElement) { // eslint-disable-line no-undef
	/**
	 * Определение **webkit** браузеров
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name webkit
	 */
	Modernizr.addTest(
		'webkit',
		function () {
			var ua = window.navigator.userAgent.toLowerCase();
			var webkit = 'WebkitAppearance' in docElement.style;
			var edge = !(ua.indexOf(' edge/') > 0);
			return webkit && edge;
		}
	);
});
