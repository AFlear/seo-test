'use strict';

/**
 * Инит валидации форм
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/dist/has-inited-key';
import 'custom-jquery-methods/dist/node-name';
import 'jquery-validation';
import Noty from 'noty';
import './validation-extend';
import phoneMask from './phone-mask';
import Preloader from './preloader';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Параметры по умолчанию
 * @const {Object}
 * @private
 */
const configDefault = {
	ignore: ':hidden, .js-ignore',
	errorClass: 'has-error',
	validClass: 'is-valid',
	get classes () {
		return {
			error: this.errorClass,
			valid: this.validClass,
			labelError: 'label-error',
			formError: 'form--error',
			formValid: 'form--valid',
			formPending: 'form--pending'
		};
	},

	onfocusout (element) {
		this.element(element);
	},

	highlight (element) {
		element.classList.remove(this.settings.classes.valid);
		element.classList.add(this.settings.classes.error);
	},

	unhighlight (element) {
		element.classList.remove(this.settings.classes.error);
		element.classList.add(this.settings.classes.valid);
	},

	submitHandler (form) {
		let $form = $(form);
		let actionUrl = $form.data('ajax');
		if (typeof (actionUrl) !== 'string') {
			window.alert([
				'Error!',
				'--------------------',
				'ajax обработчик не указан'
			].join('\n'));
			return;
		}

		let preloader = new Preloader($form);
		preloader.show();

		let formData = new window.FormData();
		formData.append('xhr-lang', $('html').attr('lang') || 'ru');

		// игнорируемые типы инпутов
		let ignoredInputsType = [
			'submit',
			'reset',
			'button',
			'image'
		];

		$form.find('input, textarea, select').each((i, element) => {
			let {value, type} = element;
			if (~ignoredInputsType.indexOf(type)) {
				return true;
			}

			let $element = $(element);
			let elementNode = $element.nodeName();
			let elementName = $element.data('name') || $element.attr('name') || null;

			if (elementName === null) {
				return true;
			}

			switch (elementNode) {
				case 'input':
					if (type === 'file') {
						element.files.forEach(file => {
							formData.append(file.name, file);
						});
					} else {
						if (type === 'checkbox' && !element.checked) {
							break;
						}
						formData.append(elementName, value);
					}
					break;

				case 'textarea':
					formData.append(elementName, value);
					break;

				case 'select':
					let multiName = /\[\]$/;
					if (multiName.test(elementName) || element.multiple) {
						elementName = elementName.replace(multiName, '');
						value.forEach(val => {
							formData.append(elementName, val);
						});
					} else {
						formData.append(elementName, value);
					}
					break;
			}
		});

		let xhrUrl = actionUrl;
		let xhr = new window.XMLHttpRequest();

		xhr.open('POST', xhrUrl);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				getResponse($form, xhr);
			}
		};
		xhr.send(formData);
		return false;
	}
};

/**
 * Обработка ответа от сервера
 * @param {jQuery} $form
 * @param {Object} xhr
 * @param {number} xhr.status
 * @param {string} xhr.statusText
 * @param {Object|string} xhr.response
 * @param {string} [xhr.response.redirect] - урл для редиректа, если равен текущему урлу - перегражаем страницу
 * @param {boolean} [xhr.response.reload] - перегрузить страницу
 * @param {boolean} [xhr.response.reset] - сбросить форму
 * @param {Array} [xhr.response.clear] - сбросить форму
 * @private
 */
function getResponse ($form, xhr) {
	let {status, response} = xhr;
	let {preloader} = $form.data();

	if (status === 200) {

	} else {
		console.error(xhr);
		preloader.hide();
		new Noty({
			text: 'К сожалению, произошла ошибка при отправке данных, попробуйте повторить',
			timeout: 3000,
			visibilityControl: true,
			type: 'error'
		}).show();
		return false;
	}

	// обрабатываем ответ
	// ------------------

	if (typeof response === 'string') {
		response = JSON.parse(response);
	}
	if (response.message) {
		new Noty({
			text: response.message,
			timeout: 3000,
			visibilityControl: true,
			type: status >= 200 && status < 300 ? 'success' : 'error'
		}).show();
	}
	if (response.reload || window.location.href === response.redirect) {
		return window.location.reload();
	}

	if (response.redirect) {
		return (window.location.href = response.redirect);
	}

	if (response.success) {
		if (response.clear) {
			if (Array.isArray(response.clear)) {
				response.clear.forEach(clearSelector => {
					$form.find(clearSelector).val('');
				});
			} else {
				// игнорируемые типы инпутов
				let ignoredInputsType = [
					'submit',
					'reset',
					'button',
					'image'
				];
				$form.find('input, textarea, select').each((i, element) => {
					if (~ignoredInputsType.indexOf(element.type)) {
						return true;
					}
					element.value = '';
				});
			}
		} else if (response.reset) {
			$form.trigger('reset');
		}

		preloader.hide();
	}
}

/**
 * Пользовательские обработчики формы
 * @param {jQuery} $form
 * @param {Object} Validator {@link https://jqueryvalidation.org/?s=validator}
 * @param {Function} Validator.resetForm {@link https://jqueryvalidation.org/Validator.resetForm/}
 */
function setHandlers ($form, Validator) {
	// сброс формы
	$form.on('reset', () => Validator.resetForm());

	// дальше ваш код
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} [selector=".js-form"]- поиск элементов по селектору
 * @param {jQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */
function validation (selector, $context = null) {
	let $forms = (selector && selector.jquery) ? selector : $(selector, $context);
	$forms.each((i, el) => {
		let $form = $(el);
		if ($form.hasInitedKey('validator', false)) {
			return true;
		}

		let configUser = $form.data('validation-config') || {};
		let configCurrent = $.extend(true, configDefault, configUser);

		phoneMask('[data-phone-mask]', $form);
		$form.validate(configCurrent);
		setHandlers($form, $form.data('validator'));
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default validation;
