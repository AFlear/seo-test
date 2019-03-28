/* eslint-disable spaced-comment */
/*!
{
  "name": "linux",
  "property": "linux"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **linux**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name linux
	 */
	Modernizr.addTest('linux', (navigator.platform.toLowerCase().indexOf('linux') >= 0));
});
