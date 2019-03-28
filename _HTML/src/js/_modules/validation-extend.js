'use strict';

/**
 * Расширение библиотеки валидации
 * @module
 */

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Получение имени типа
 * @param {string} type
 * @return {string}
 * @private
 */
function formGetTypeName (type) {
	let typeName;
	switch (type) {
		case 'select-one':
		case 'select-multiple':
			typeName = '_select';
			break;
		case 'radio':
		case 'checkbox':
			typeName = '_checker';
			break;
		default:
			typeName = '';
	}
	return typeName;
}

/**
 * Получение сообщения в зависимости от элемента
 * @param {HTMLElement} element
 * @param {string} method
 * @return {string}
 * @private
 */
function formGetMethodMsgName (element, method) {
	let value = element.value;
	let methodName;
	switch (method) {
		case 'required':
		case 'maxlength':
		case 'minlength':
		case 'rangelength':
			methodName = method + formGetTypeName(element.type);
			break;
		case 'password':
			if (/^(\s|\t)*/.test(value)) {
				methodName = method + '_space';
			} else {
				methodName = method;
			}
			break;
		case 'url':
			if (!/^(http(s)?:)?\/\//i.test(value)) {
				methodName = method + '_protocol';
			} else if (!/((?!\/).)\..*$/.test(value)) {
				methodName = method + '_domen';
			} else if (!/\..{2,}$/.test(value)) {
				methodName = method + '_domen-length';
			} else {
				methodName = method;
			}
			break;
		case 'email':
			if (/(@\.|\.$)/.test(value)) {
				methodName = method + '_dot';
			} else if (/@.*(\\|\/)/.test(value)) {
				methodName = method + '_slash';
			} else if (!/@/.test(value)) {
				methodName = method + '_at';
			} else if (/^@/.test(value)) {
				methodName = method + '_at-start';
			} else if (value.split('@').length > 2) {
				methodName = method + '_at-multiple';
			} else if (/@$/.test(value)) {
				methodName = method + '_at-end';
			} else {
				methodName = method;
			}
			break;
		default:
			methodName = method;
	}
	return methodName;
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Объект расширений
 * @const {Object}
 */
const extendConfig = {
	/**
	 * Прототипы плагина
	 * @var {Object} messages
	 * @sourceCode |+30
	 */
	get messages () {
		let translates = (window.jsTranslations && window.jsTranslations.validation) || {};

		for (let key in translates) {
			let value = translates[key];

			switch (key) {
				case 'maxlength':
				case 'maxlength_checker':
				case 'maxlength_select':
				case 'minlength':
				case 'minlength_checker':
				case 'minlength_select':
				case 'rangelength':
				case 'rangelength_checker':
				case 'rangelength_select':
				case 'range':
				case 'min':
				case 'max':
				case 'filetype':
				case 'filesize':
				case 'filesizeEach':
				case 'pattern':
					translates[key] = $.validator.format(value);
					break;
			}
		}

		return translates;
	},

	/**
	 * Прототипы плагина
	 * @var {Object} prototype
	 */
	prototype: {
		/**
		 * Вывод дефолтных сообщений
		 * @param {Element} element
		 * @param {Object|string} rule
		 * @return {string}
		 * @method prototype::defaultMessage
		 */
		defaultMessage (element, rule) {
			if (typeof rule === 'string') {
				rule = {method: rule};
			}

			let message = this.findDefined(
				this.customMessage(element.name, rule.method),
				this.customDataMessage(element, rule.method),
				!this.settings.ignoreTitle && element.title || undefined, // eslint-disable-line no-mixed-operators
				$.validator.messages[formGetMethodMsgName(element, rule.method)],
				'<strong>Warning: No message defined for ' + element.name + '</strong>'
			);

			let pattern = /\$?\{(\d+)\}/g;

			if (typeof message === 'function') {
				message = message.call(this, rule.parameters, element);
			} else if (pattern.test(message)) {
				message = $.validator.format(message.replace(pattern, '{$1}'), rule.parameters);
			}

			return message;
		}
	},

	/**
	 * Методы валидации
	 * @var {Object} methods
	 */
	methods: {
		/**
		 * Валидация email
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::email
		 * @sourceCode |+4
		 */
		email (value, element) {
			let pattern = /^(([a-zA-Z0-9&+-=_])+((\.([a-zA-Z0-9&+-=_]){1,})+)?){1,64}@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
			return this.optional(element) || pattern.test(value);
		},

		/**
		 * Валидация паролей
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::password
		 * @sourceCode |+3
		 */
		password (value, element) {
			return this.optional(element) || /^\S.*$/.test(value);
		},

		/**
		 * Проверка общего объема всех файла в KB
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::filesize
		 * @sourceCode |+7
		 */
		filesize (value, element, param) {
			let kb = 0;
			for (let i = 0; i < element.files.length; i++) {
				kb += element.files[i].size;
			}
			return this.optional(element) || (kb / 1024 <= param);
		},

		/**
		 * Максимальное количество файлов для загрузки
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::maxupload
		 * @sourceCode |+3
		 */
		maxupload (value, element, param) {
			return element.files.length <= param;
		},

		/**
		 * Проверка объема каждого файла в KB
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::filesizeeach
		 * @sourceCode |+10
		 */
		filesizeeach (value, element, param) {
			let flag = true;
			for (let i = 0; i < element.files.length; i++) {
				if (element.files[i].size / 1024 > param) {
					flag = false;
					break;
				}
			}
			return this.optional(element) || flag;
		},

		/**
		 * Проверка типа файла по расширению
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::filetype
		 * @sourceCode |+25
		 */
		filetype (value, element, param) {
			let result;
			let extensions = 'png|jpe?g|doc|pdf|gif|zip|rar|tar|html|swf|txt|xls|docx|xlsx|odt';
			if (element.files.length < 1) {
				return true;
			}

			param = typeof param === 'string' ? param.replace(/,/g, '|') : extensions;
			if (element.multiple) {
				let files = element.files;
				for (let i = 0; i < files.length; i++) {
					let value = files[i].name;
					let valueMatch = value.match(new RegExp('.(' + param + ')$', 'i'));

					result = this.optional(element) || valueMatch;
					if (result === null) {
						break;
					}
				}
			} else {
				let valueMatch = value.match(new RegExp('\\.(' + param + ')$', 'i'));
				result = this.optional(element) || valueMatch;
			}
			return result;
		},

		/**
		 * Проверка валидности одного из указанных элементов
		 * _этот или другой - должен быть валидным_
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::or
		 * @sourceCode |+4
		 */
		or (value, element, param) {
			let $module = $(element).parents('.js-form');
			return $module.find(param + ':filled').length;
		},

		/**
		 * Проверка валидности слов (чаще всего используется для имени или фамилии)
		 * @param {string} value
		 * @param {Element} element
		 * @return {boolean}
		 * @method methods::word
		 * @sourceCode |+4
		 */
		word (value, element) {
			let testValue = /^[a-zA-Zа-яА-ЯіІїЇєёЁЄґҐĄąĆćĘęŁłŃńÓóŚśŹźŻż\'\`\- ]*$/.test(value); // eslint-disable-line no-useless-escape
			return this.optional(element) || testValue;
		},

		/**
		 * Проверка валидности логинов
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::login
		 * @sourceCode |+4
		 */
		login (value, element) {
			let testValue = /^[0-9a-zA-Zа-яА-ЯіІїЇєЄёЁґҐ][0-9a-zA-Zа-яА-ЯіІїЇєЄґҐĄąĆćĘęŁłŃńÓóŚśŹźŻż\-\._]+$/.test(value); // eslint-disable-line no-useless-escape
			return this.optional(element) || testValue;
		},

		/**
		 * Валидация номера телефона (укр)
		 * @param {string} value
		 * @param {Element} element
		 * @return {boolean}
		 * @method methods::phoneua
		 * @sourceCode |+3
		 */
		phoneua (value, element) {
			return this.optional(element) || /^(((\+?)(38))\s?)?(([0-9]{3})|(\([0-9]{3}\)))(\-|\s)?(([0-9]{3})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{2})|([0-9]{2})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{3})|([0-9]{2})(\-|\s)?([0-9]{3})(\-|\s)?([0-9]{2}))$/.test(value); // eslint-disable-line no-useless-escape
		},

		/**
		 * Валидация номера телефона (общая)
		 * @param {string} value
		 * @param {Element} element
		 * @param {Object} param
		 * @return {boolean}
		 * @method methods::phone
		 * @sourceCode |+3
		 */
		phone (value, element) {
			return this.optional(element) || /^(((\+?)(\d{1,3}))\s?)?(([0-9]{0,4})|(\([0-9]{3}\)))(\-|\s)?(([0-9]{3})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{2})|([0-9]{2})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{3})|([0-9]{2})(\-|\s)?([0-9]{3})(\-|\s)?([0-9]{2}))$/.test(value); // eslint-disable-line no-useless-escape
		},

		/**
		 * Проверки пробелов в значении
		 * @param {string} value
		 * @return {boolean}
		 * @method methods::nospace
		 * @sourceCode |+4
		 */
		nospace (value) {
			let str = value.replace(/\s|\t|\r|\n/g, '');
			return str.length > 0;
		},

		/**
		 * Проверки валидности элемента
		 * @param {string} value
		 * @param {Element} element
		 * @return {boolean}
		 * @method methods::validTrue
		 * @sourceCode |+3
		 */
		validdata (value, element) {
			return $(element).data('valid') === true;
		}
	}
};

for (let key in extendConfig) {
	$.extend($.validator[key], extendConfig[key]);
}
