/* eslint-disable spaced-comment */
/*!
{
  "name": "moz",
  "property": "moz"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение браузера **mozilla**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name moz
	 */
	Modernizr.addTest('moz', (typeof InstallTrigger !== 'undefined'));
});
