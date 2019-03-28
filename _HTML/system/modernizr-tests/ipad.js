/* eslint-disable spaced-comment */
/*!
{
  "name": "ipad",
  "property": "ipad"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **ipad**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ipad
	 */
	Modernizr.addTest('ipad', (navigator.userAgent.toLowerCase().indexOf('ipad') >= 0));
});
