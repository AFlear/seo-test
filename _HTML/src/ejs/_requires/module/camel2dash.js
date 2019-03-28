'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Переводит строку _camelCase_ в _dash_ стиль -> camel-case
 *
 * @memberOf app.module
 * @sourceCode
 *
 * @example
 * app.module.camel2dash('dataRuleMinlength');        // => 'data-rule-minlength'
 * app.module.camel2dash('backgroundImage');          // => 'background-image'
 * app.module.camel2dash('WebkitBackfaceVisibility'); // => '-webkit-backface-visibility'
 *
 * @param {string} str - _camelCase_ строка
 * @return {string} - _dash_ строка
 */
function camel2dash (str) {
	return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = camel2dash;
