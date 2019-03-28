'use strict';

/**
 * Простой прелодер
 * @module
 */

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Дофелтный конфиг для всех экземпляров
 * @type {Object}
 * @prop {string} mainClass - основной CSS класс, который добавляется к контейнеру прелодара
 * @prop {string} subClass - Дополнительный CSS класс - который будет добавлен, если имеет логически позитивное значение
 * @prop {string} showClass - CSS класс, который добавляется к контейнеру прелодара, при его показе
 * @prop {string} hideClass - CSS класс, который добавляется к контейнеру прелодара, перед его закрытием
 * @prop {number} removeDelay - время задержки, после которой будут удалены разметка прелоадре и CSS классы у контейнера
 * @prop {string} markup - Разметка прелодера
 * @private
 */
let defaultConfig = {
	mainClass: 'preloader',
	subClass: '',
	showClass: 'preloader--show',
	hideClass: 'preloader--hide',
	removeDelay: 200,
	markup: '<div class="preloader__block"></div>'
};

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Создание прелодаров
 * @param {jQuery} $container - контейнер для прелоадера
 * @param {Object} [userConfig={}] - Пользвательский конфиг для создваемого экземпляра
 * @prop {jQuery} [$container] - контейнер для прелоадера
 * @prop {jQuery} [$markup] - блок разметки прелоадера
 * @prop {Object|number} timer - id таймера
 */
class Preloader {
	constructor ($container, userConfig = {}) {
		this.$container = $container;
		this.config = Object.assign({}, defaultConfig, userConfig);
		this.timer = null;
		this.$container.data('preloader', this);
	}

	/**
	 * Показ прелодера
	 * @param {string} [place="append"] - append / prepend / before / after
	 * @sourceCode
	 */
	show (place = 'append') {
		let {mainClass, subClass, showClass} = this.config;
		this.$container.addClass(mainClass);
		if (subClass) {
			this.$container.addClass(subClass);
		}
		this.$markup = $(this.config.markup);
		this.$container[place](this.$markup);

		window.clearTimeout(this.timer);
		this.timer = window.setTimeout(() => this.$container.addClass(showClass), 10);
	}

	/**
	 * Скритие прелодера
	 * @param {boolean} [removeMarkup=true] - удалить разметку прелодера после скрития
	 * @sourceCode
	 */
	hide (removeMarkup = true) {
		let {mainClass, subClass, showClass, hideClass} = this.config;
		this.$container.addClass(hideClass);
		window.clearTimeout(this.timer);
		this.timer = window.setTimeout(() => {
			if (removeMarkup) {
				this.$markup.remove();
			}
			this.$container.removeClass([mainClass, showClass, hideClass].join(' '));
			if (subClass) {
				this.$container.removeClass(subClass);
			}
		}, this.config.removeDelay + 50);
	}

	/**
	 * Получение глобального конфига для всех прелодаров
	 * @returns {Object}
	 * @sourceCode
	 */
	static get config () {
		return defaultConfig;
	}

	/**
	 * Установка глобального конфига
	 * @param {Object} value
	 * @sourceCode
	 */
	static set config (value) {
		Object.assign(defaultConfig, value);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default Preloader;
