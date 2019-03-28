'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const del = require('del');
const gulp = require('gulp');
const path = require('path');
const inquirer = require('inquirer');
const nodeNotifier = require('node-notifier');

const logger = require('../utils/logger');
const notify = require('../utils/notify');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - пути для удаления
 * @param {boolean} askBeforeDel - спрашивать перед удалением
 * @returns {Function}
 */
function task (taskName, taskPaths, askBeforeDel) {
	let icon = path.join(process.cwd(), './system/notify-icons/attention.png');
	let title = 'DELETING PATHS:';
	let message = 'Needs to confirm the action!';

	/**
	 * @param {string|Array.<string>} deleteSrc
	 * @param {Function} done
	 * @returns {Promise}
	 * @private
	 * @sourceCode
	 */
	function deleteFn (deleteSrc, done) {
		function resolved (paths) {
			if (paths.length) {
				logger('yellow', 'Done');
			} else {
				logger('yellow', 'There is nothing to delete along the specified path, we go further ...');
			}
			return done();
		}

		function rejected (error) {
			notify.onError(taskName, error.message);
		}

		return del(deleteSrc, {force: true}).then(resolved, rejected);
	}

	return gulp.task(taskName, done => {
		let sources = Array.isArray(taskPaths.src) ? taskPaths.src : [taskPaths.src];
		del(sources, {dryRun: true, force: true}).then(paths => {
			// если нечего удалять
			if (!paths.length) {
				logger('yellow', 'notFound', sources.join(',\n'), 'There is nothing to delete along the specified path, we go further ...');
				return done();
			}

			let messages = paths.concat();

			// если нужно согласие на удаление
			if (askBeforeDel) {
				messages.push(message);
			}
			logger('yellow', title, ...messages);

			if (askBeforeDel) {
				nodeNotifier.notify({
					title,
					message,
					icon,
					type: 'info'
				});

				inquirer.prompt([{
					type: 'confirm',
					name: 'agree',
					message: 'Do you really want to delete the specified paths',
					default: false
				}]).then(answers => {
					if (answers.agree) {
						return deleteFn(paths, done);
					}
					console.log('');
					logger('red', 'Process interrupt, make a restart if necessary\n\n');
					process.exit(1);
				});
			} else {
				return deleteFn(paths, done);
			}
		});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
