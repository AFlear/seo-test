/**
 * @fileOverview > Тест поддержки `localStorage`
 * @see localStorageSupport
 * @see localStorageWrite
 */

(function (window) {
	/**
	 * Флаг поддержки
	 * @global
	 * @type {boolean}
	 * @sourceCode
	 */
	window.localStorageSupport = testLocal('test-key');

	/**
	 * Запись данных в локальное хранилище
	 * @global
	 * @param {string} key - ключ под которым будут записаны данные
	 * @param {string} val - данные для записи
	 * @sourceCode
	 */
	window.localStorageWrite = function (key, val) {
		try {
			window.localStorage.setItem(key, val);
		} catch (e) {
			console.warn('localStorageWrite');
			console.warn(e);
		}
	};

	/**
	 * Тест поддержки
	 * @private
	 * @param {string} testKey
	 * @return {boolean}
	 * @sourceCode
	 */
	function testLocal (testKey) {
		try {
			window.localStorage.setItem(testKey, testKey);
			window.localStorage.removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}
	}
})(window);
