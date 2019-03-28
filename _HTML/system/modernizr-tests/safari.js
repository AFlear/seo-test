/* eslint-disable spaced-comment */
/*!
{
  "name": "safari",
  "property": "safari"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение браузера **safari**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name safari
	 */
	Modernizr.addTest('safari', (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)));
});
