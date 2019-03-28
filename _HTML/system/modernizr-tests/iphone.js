/* eslint-disable spaced-comment */
/*!
{
  "name": "iphone",
  "property": ["iphone", "iphone4", "iphone5", "iphone6", "iphone6plus"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	var iPhone = !!~navigator.userAgent.toLowerCase().indexOf('iphone');
	var width = window.screen.width;
	var height = window.screen.height;

	if (width > height) {
		var tmp = height;
		height = width;
		width = tmp;
	}

	/**
	 * Определение **iphone**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone
	 */
	Modernizr.addTest('iphone', iPhone);

	/**
	 * Определение **iphone4**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone4
	 */
	Modernizr.addTest('iphone4', (iPhone && (width === 320 && height === 480)));

	/**
	 * Определение **iphone5**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone5
	 */
	Modernizr.addTest('iphone5', (iPhone && (width === 320 && height === 568)));

	/**
	 * Определение **iphone6**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone6
	 */
	Modernizr.addTest('iphone6', (iPhone && (width === 375 && height === 667)));

	/**
	 * Определение **iphone6plus**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone6plus
	 */
	Modernizr.addTest('iphone6plus', (iPhone && (width === 414 && height === 736)));
});
