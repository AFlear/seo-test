/* eslint-disable spaced-comment */
/*!
{
  "name": "ios",
  "property": "ios"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **ios**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name ios
	 * @sourceCode |+4
	 */
	Modernizr.addTest('ios', (navigator.platform.match(/(iPhone|iPod|iPad)/i) !== null));
});
