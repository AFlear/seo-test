'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const through2 = require('through2');
const Vinyl = require('vinyl');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - исходные файлы
 * @param {string|Array.<string>} taskPaths.dest - исходные файлы
 *
 * @returns {Function}
 */
function task (taskName, taskPaths) {
	const todos = {
		banners: [],
		list: {}
	};

	function readBuffer (file, ...args) {
		let cb = args[1];
		let content = file.contents.toString();

		if (file.extname === '.md') {
			todos.banners.push(content);
			return cb();
		}

		let comments = [];
		let pattern = /(<!--|<\?php\s\/\*)\s@todo\s(((?!(-->|\*\/ \?>)).|(\r)?\n)*)(-->|\*\/ \?>)/gi;
		let founded;

		while ((founded = pattern.exec(content)) !== null) {
			let before = content.substr(0, founded.index);
			before = before.replace(/\r\n/g, '\n').split('\n');

			comments.push({
				file: file.relative,
				text: founded[2],
				lineno: before.length
			});
		}

		comments.forEach(comment => {
			let key = JSON.stringify(comment.text);
			if (!todos.list.hasOwnProperty(key)) {
				todos.list[key] = {
					todo: comment.text,
					where: []
				};
			}
			todos.list[key].where.push(`- file: \`${comment.file}\`  \n  lineno: \`${comment.lineno}\``);
		});

		cb();
	}

	function afterRead (cb) {
		let joiner = '\n\n---\n\n';
		let content = [todos.banners.join(joiner), joiner].concat([
			`## Список задач\n\n`
		]);
		let num = 1;

		for (let key in todos.list) {
			let item = todos.list[key];
			let arr = [
				`### TODO № ${num++}\n`,
				`${item.todo}\n`
			].concat(item.where);

			content.push(arr.join('\n'), joiner);
		}

		this.push(new Vinyl({
			path: 'TODO-PHP.md',
			contents: Buffer.from(content.join('\n'))
		}));

		cb();
	}

	return gulp.task(taskName, () => {
		return gulp.src(taskPaths.src)
			.pipe(through2.obj(readBuffer, afterRead))
			.pipe(gulp.dest(taskPaths.dest));
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
