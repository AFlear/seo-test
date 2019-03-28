/* eslint-disable spaced-comment */
/*!
{
  "name": "Intersection Observer",
  "property": "intersectionobserver"
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение поддержки **Intersection Observer**
	 * @see https://github.com/w3c/IntersectionObserver
	 * @see http://caniuse.com/#feat=intersectionobserver
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name intersectionobserver
	*/
	Modernizr.addTest(
		'intersectionobserver',
		function () {
			if ('IntersectionObserver' in window &&
				'IntersectionObserverEntry' in window &&
				'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
				// Minimal polyfill for Edge 15's lack of `isIntersecting`
				// See: https://github.com/w3c/IntersectionObserver/issues/211
				if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
					Object.defineProperty(window.IntersectionObserverEntry.prototype,
						'isIntersecting', {
							get: function () {
								return this.intersectionRatio > 0;
							}
						});
				}
				return true;
			}
			return false;
		});
});
