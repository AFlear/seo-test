'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Function}
 * @private
 */
function wrapper (app) {
	// выгружаем инструменты
	const {test} = app.data;

	/**
	 * Генерация комметариев
	 * @param {...string|Array} comments
	 * @return {string|undefined}
	 *
	 * @memberOf app.module
	 *
	 * @tutorial app.module.comment
	 * @sourceCode
	 */
	function comment (...comments) {
		if (Array.isArray(comments[0])) {
			comments = comments[0];
		}

		return `<!-- ${comments.join('\n\t')} -->`;
	}

	/**
	 * Вставка To Do комментария.
	 *
	 * @param {...string|Array} comments
	 * @return {string|undefined}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.comment
	 * @sourceCode
	 */
	comment.todo = function (...comments) {
		if (Array.isArray(comments[0])) {
			comments = comments[0];
		}
		comments[0] = '@TODO ' + comments[0];
		return comment(...comments);
	};

	/**
	 * Вставка PHP комментария.
	 * _Если ситаксис PHP отключен - будет HTML комментарий_
	 *
	 * @param {...string|Array} comments
	 * @return {string|undefined}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.comment
	 * @sourceCode
	 */
	comment.php = function (...comments) {
		let commentString = comment(...comments);
		if (!test) {
			return commentString;
		}
		commentString = commentString.replace(/<!--/, '<?php /*');
		commentString = commentString.replace(/-->/, '*/ ?>');
		return commentString;
	};

	/**
	 * Вставка To Do PHP комментария.
	 * _Если ситаксис PHP отключен - будет To Do HTML комментарий_
	 *
	 * @param {...string|Array} comments
	 * @return {string|undefined}
	 *
	 * @memberOf app.module
	 * @tutorial app.module.comment
	 * @sourceCode
	 */
	comment.todoPhp = function (...comments) {
		let commentString = comment.todo(...comments);
		if (!test) {
			return commentString;
		}
		commentString = commentString.replace(/<!--/, '<?php /*');
		commentString = commentString.replace(/-->/, '*/ ?>');
		return commentString;
	};

	return comment;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
