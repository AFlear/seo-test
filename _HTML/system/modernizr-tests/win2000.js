/* eslint-disable spaced-comment */
/*!
{
  "name": "win2000",
  "property": "win2000"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение операционной системы **Windows2000**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name win2000
	 */
	Modernizr.addTest('win2000', (navigator.userAgent.toLowerCase().indexOf('windows nt 5.0') > 0));
});
