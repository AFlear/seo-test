/* eslint-disable spaced-comment */
/*!
{
  "name": "mac",
  "property": ["mac", "maclike"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **mac**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name mac
	 */
	Modernizr.addTest('mac', (navigator.platform.toLowerCase().indexOf('mac') >= 0));

	/**
	 * Определение **maclike**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name maclike
	 */
	Modernizr.addTest('maclike', (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) !== null));
});
