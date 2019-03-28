/* eslint-disable spaced-comment */
/*!
{
  "name": "opera",
  "property": "opera"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение браузера **opera**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name opera
	 */
	Modernizr.addTest('opera', (!!window.opera || navigator.userAgent.match(/Opera|OPR\//) !== null));
});
