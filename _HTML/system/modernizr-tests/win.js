/* eslint-disable spaced-comment */
/*!
{
  "name": "win",
  "property": ["win", "win7", "win8", "win10", "winvista", "winxp"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение операционной системы **Windows**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name win
	 */
	Modernizr.addTest('win', (navigator.platform.toLowerCase().indexOf('win') >= 0));

	/**
	 * Определение операционной системы **Windows 7**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name win7
	 */
	Modernizr.addTest('win7', (navigator.userAgent.toLowerCase().indexOf('windows nt 6.1') > 0));

	/**
	 * Определение операционной системы **Windows 8**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name win8
	 */
	Modernizr.addTest(
		'win8',
		function () {
			var ua = navigator.userAgent.toLowerCase();
			return ua.indexOf('windows nt 6.2') > 0 || ua.indexOf('windows nt 6.3') > 0;
		}
	);

	/**
	 * Определение операционной системы **Windows 10**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name win10
	 */
	Modernizr.addTest('win10', (navigator.userAgent.toLowerCase().indexOf('windows nt 10') > 0));

	/**
	 * Определение операционной системы **Windows Vista**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name winvista
	 */
	Modernizr.addTest('winvista', (navigator.userAgent.toLowerCase().indexOf('windows nt 6.0') > 0));

	/**
	 * Определение операционной системы **Windows XP**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name winxp
	 */
	Modernizr.addTest('winxp', (navigator.userAgent.toLowerCase().indexOf('windows nt 5.1') > 0));
});
