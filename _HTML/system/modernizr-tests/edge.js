/* eslint-disable spaced-comment */
/*!
{
  "name": "edge",
  "property": ["edge", "edge-ios", "edge-android"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	var uA = window.navigator.userAgent;
	var ua = uA.toLowerCase();

	/**
	 * Определение **Edge** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge
	 */
	Modernizr.addTest('edge', (ua.indexOf(' edge/') > 0));

	/**
	 * Определение **Edge iOS** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge-ios
	 */
	Modernizr.addTest('edge-ios', (/\sEdgiOS\//i.test(uA)));

	/**
	 * Определение **Edge Android** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge-android
	 */
	Modernizr.addTest('edge-android', (/\sEdgA\//i.test(uA)));
});
