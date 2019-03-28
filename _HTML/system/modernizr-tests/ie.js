/* eslint-disable spaced-comment */
/*!
{
  "name": "ie",
  "property": ["ie", "ie8", "ie9", "ie10", "ie11"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение браузера **ie**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ie
	 */
	Modernizr.addTest('ie', (/* @cc_on!@ */ false || document.documentMode));

	/**
	 * Определение браузера **ie8**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ie8
	 */
	Modernizr.addTest('ie8', (document.all && !document.addEventListener));

	/**
	 * Определение браузера **ie9**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ie9
	 */
	Modernizr.addTest('ie9', (document.all && !window.atob && !!document.addEventListener));

	/**
	 * Определение браузера **ie10**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ie10
	 */
	Modernizr.addTest('ie10', (document.all && !!window.atob && !!document.addEventListener));

	/**
	 * Определение браузера **ie11**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ie11
	 */
	Modernizr.addTest('ie11', (!!navigator.userAgent.match(/Trident.*rv[ :]*11\./)));
});
