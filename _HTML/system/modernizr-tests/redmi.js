/* eslint-disable spaced-comment */
/*!
{
  "name": "redmi",
  "property": ["redmi", "redmi-note"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	var uA = window.navigator.userAgent;

	/**
	 * Определение **Redmi**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name redmi
	*/
	Modernizr.addTest('redmi', (/Android\s.*Redmi\s/i.test(uA)));

	/**
	 * Определение **Redmi Note**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name redmi-note
	*/
	Modernizr.addTest('redmi-note', (/Android\s.*Redmi.*\sNote\s/i.test(uA)));
});
