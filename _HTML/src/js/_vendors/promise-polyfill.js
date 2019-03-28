'use strict';

/**
 * Полифил для IE, Edge и других браузеров
 * которые не имеют нативную поддержку Promise
 * @see {@link https://www.npmjs.com/package/es6-promise-polyfill}
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import { Promise } from 'es6-promise-polyfill';

// ----------------------------------------
// Public
// ----------------------------------------

window.Promise = window.Promise || Promise;
