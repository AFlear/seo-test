'use strict';

/**
 * Внутрення, горизотальная прокрутка элементов со стилизацией
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/dist/has-inited-key';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Внутренний namespace
 * @const {string}
 * @private
 * @sourceCode
 */
const ns = 'horizontal-scroll';

/**
 * Список собранных элементов, к кототорым применен скролл
 * @type {Array}
 * @private
 * @sourceCode
 */
let $list = [];

/**
 * Обработчик собития `scroll.${ns}`
 * @param {Event} event
 * @param {Object} event.data
 * @param {number} event.data.gap
 * @param {jQuery} event.data.$wrapper
 * @param {jQuery} event.data.$element
 * @private
 * @sourceCode
 */
function onScroll (event) {
	let $holder = $(this);
	let {gap, $wrapper, $element} = event.data;

	let holderWidth = $holder.innerWidth();
	let holderScroll = $holder.scrollLeft();
	let holderScrollOffset = holderScroll + holderWidth + gap;
	let tableWidth = $element[0].scrollWidth;

	let doClassLeft = 'removeClass';
	let doClassRight = 'removeClass';

	if (holderScroll > gap) {
		doClassLeft = 'addClass';
	}

	if (tableWidth > holderScrollOffset) {
		doClassRight = 'addClass';
	}

	$wrapper[doClassLeft](`${ns}--left`);
	$wrapper[doClassRight](`${ns}--right`);

	if ($holder.data(`${ns}-synchronized`) !== true) {
		$element.data(`${ns}-$holders`).forEach($syncHolder => {
			$syncHolder.data(`${ns}-synchronized`, true);
			$syncHolder.scrollLeft(holderScroll);
		});
	}
	$holder.data(`${ns}-synchronized`, false);
}

/**
 * Обработчик собития `destroy.${ns}`
 * @param {Event} event
 * @param {Object} event.data
 * @param {jQuery} event.data.$holder
 * @private
 * @sourceCode
 */
function onDestroy (event) {
	let $this = $(this);
	let {$holder} = event.data;
	let index = $list.index($holder);
	if (~index) {
		$list.splice(index, 1);
		if ($list.length === 0) {
			$(window).off(`resize.${ns}`, onResize);
		}
	}
	$this.off(`destroy.${ns}`, onDestroy)
		.unwrap()
		.unwrap()
		.removeClass(`${ns}__element`)
		.removeInitedKey(ns)
		.data({
			[`${ns}-$holder`]: null,
			[`${ns}-$holders`]: null
		});
}

/**
 * Обработчик собития `mousedown.${ns}`
 * @param {Event} event
 * @param {Object} event.data
 * @param {jQuery} event.data.$holder
 * @param {jQuery} event.data.$wrapper
 * @private
 * @sourceCode
 */
function onDown (event) {
	let {$holder, $wrapper} = event.data;
	$wrapper.addClass(`${ns}--mousedown`);
	$holder.on(`mousemove.${ns}`, {$holder, $wrapper, downX: event.pageX}, onMove);
}

/**
 * Обработчик собития `mouseup.${ns}`
 * @param {Event} event
 * @param {Object} event.data
 * @param {jQuery} event.data.$holder
 * @param {jQuery} event.data.$wrapper
 * @private
 * @sourceCode
 */
function onUp (event) {
	let {$holder, $wrapper} = event.data;
	$wrapper.removeClass(`${ns}--mousedown`);
	$holder.off(`mousemove.${ns}`, onMove);
}

/**
 * Обработчик собития `mousemove.${ns}`
 * @param {Event} event
 * @param {Object} event.data
 * @param {jQuery} event.data.$holder
 * @param {jQuery} event.data.$wrapper
 * @private
 * @sourceCode
 */
function onMove (event) {
	let gutter = 12;
	let {downX, $holder, $wrapper} = event.data;
	let {pageX: x, pageY: y} = event;

	let offset = $wrapper.offset();
	let left = offset.left + gutter;
	let top = offset.top + gutter;
	let right = left - gutter * 2 + $wrapper.innerWidth();
	let bottom = top - gutter * 2 + $wrapper.innerHeight();

	if (x < left || x > right || y < top || y > bottom) {
		$holder.trigger(`mouseup.${ns}`);
		return false;
	}
	let scroll = $holder.scrollLeft() - (x - downX) / 2;
	$holder.scrollLeft(scroll);
}

/**
 * Обработчик собития `destroy.${ns}` для `window`
 * @private
 * @sourceCode
 */
function onResize () {
	if ($list.length) {
		$list.trigger('scroll');
	}
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Оборачивание элементов и добавление прослушки на горизотальную прокрутку.
 * При инициализации каждому элементу добавляеться запись `data('horizontal-scroll', true)`
 * Для того чтобы отфильтровывать уже инициализированные элементы при возможных последующих обращениях
 *
 * Каждому элементу добавляеться CSS класс, а также оборачивается нужной разметкой
 * для стилизации и возможность устастановки прослушек.
 *
 * Пример начальной разметки
 *
 * ```markup
 * <div class="wysiwyg">
 *     <table>
 *         <!-- content -->
 *     </table>
 * </div>
 * ```
 *
 * Пример результата
 *
 * ```markup
 * <div class="wysiwyg">
 *     <div class="horizontal-scroll"> <!-- Стилизация псевдоэлементами слева и справа в зависимости от прокрутки -->
 *         <div class="horizontal-scroll__holder"> <!-- Создает прокрутку и не нем же весят события скрола -->
 *             <table class="horizontal-scroll__element">
 *                 <!-- content -->
 *             </table>
 *         </div>
 *     </div>
 * </div>
 * ```
 *
 * @example <caption>Инит таблиц</caption>
 * horizontalScroll('.wysiwyg table');
 *
 * @example <caption>Инит таблиц в текущем контейнере</caption>
 * horizontalScroll('.wysiwyg table', $currentContainer);
 *
 * @example <caption>Инит таблиц в текущем контейнере с зазором в 20 пикселей</caption>
 * horizontalScroll('.wysiwyg table', $currentContainer, 20);
 *
 * @example <caption>Инит таблиц с зазором в 20 пикселей</caption>
 * horizontalScroll('.wysiwyg table', null, 20);
 *
 * @param {string|jQuery} selector - поиск элементов по селектору или jQuery element
 * @param {jQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @param {number} [gap=4] - зазор для скролла (в пикселях), который определяет, когда добавлять/удалять классы стилизации
 * @sourceCode
 */
function horizontalScroll (selector, $context = null, gap = 4) {
	let $elements = (selector && selector.jquery) ? selector : $(selector, $context);

	$elements.each((i, el) => {
		let $element = $(el);

		if ($element.hasInitedKey(ns, false)) {
			return true;
		}

		$element.addClass(`${ns}__element`).wrap(`<div class="${ns}"><div class="${ns}__holder"></div></div>`);
		horizontalScroll.init($element, gap);
	});
}

/**
 * Инициализация прослушки
 * Метод можно использовать отдельно, если у вас уже есть готовая структура разметки
 *
 * Необходимая структура
 *
 * ```markup
 * <div class="horizontal-scroll">
 *     <div class="horizontal-scroll__holder">
 *         <div class="horizontal-scroll__element">
 *             <!-- content -->
 *         </div>
 *     </div>
 * </div>
 * ```
 *
 * @example <caption>Необходимая структура</caption>
 * let $element = $('.horizontal-scroll__element);
 * horizontalScroll.init($element);
 * // horizontalScroll.init($element, 20); // => с зазором в 20 пикселей
 *
 * @param {jQuery} $element - поиск элементов по селектору
 * @param {number} [gap=3] - зазор для скролла (в пикселях), который определяет, когда добавлять/удалять классы стилизации
 * @method horizontalScroll::init
 * @inner
 */
horizontalScroll.init = function ($element, gap = 3) {
	if ($element.hasInitedKey(ns)) {
		return true;
	}

	let $holder = $element.parent();
	let $wrapper = $holder.parent();

	$holder.on(`scroll.${ns}`, {gap, $element, $wrapper}, onScroll);
	$holder.on(`mousedown.${ns}`, {$holder, $wrapper}, onDown);
	$holder.on(`mouseup.${ns}`, {$holder, $wrapper}, onUp);
	$holder.on(`dragstart.${ns}`, () => false);
	$element.on(`destroy.${ns}`, {$holder}, onDestroy);
	$element.data(`${ns}-$holder`, $holder);
	$element.data(`${ns}-$holders`, []);

	if ($list.length) {
		$list = $list.add($holder);
	} else {
		$list = $holder;
		$(window).on(`resize.${ns}`, onResize);
	}

	$holder.trigger(`scroll.${ns}`);
};

/**
 * Синхронизация скролов
 * __Важно!__ метод нужно вызывать после инициализации скролов для каждлго из элементов
 *
 * @example
 * let $elements = $('.elements');
 * horizontalScroll($elements);
 * horizontalScroll.sync($elements);
 *
 * @param $elements
 * @method horizontalScroll::sync
 * @inner
 * @sourceCode
 */
horizontalScroll.sync = function ($elements) {
	$elements.each((i, el) => {
		let $el = $(el);
		let $holders = [];

		$elements.not($el).each((i, el) => {
			$holders.push($(el).data(`${ns}-$holder`));
		});

		$el.data(`${ns}-$holders`, $holders);
	});
};

/**
 * Удаление внутреннего скролла
 *
 * @example <caption>Удаление внутреннего скрола с таблиц в текущем контейнере</caption>
 * horizontalScroll.destroy('.wysiwyg table');
 *
 * @example <caption>Удаление внутреннего скрола с таблиц в текущем контейнере</caption>
 * horizontalScroll.destroy('.wysiwyg table', $currentContainer);
 *
 * @example <caption>Удаление внутреннего скрола с нужного элемента</caption>
 * horizontalScroll.destroy($myElement);
 *
 * @param {string|jQuery} selector - Селектор или jQuery элемент
 * @param {string} selector.jquery - Если передан элемент - строка, содержащая номер версии `jQuery` ({@link http://api.jquery.com/jquery-2/})
 * @param {jQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @method horizontalScroll::destroy
 * @inner
 */
horizontalScroll.destroy = function (selector, $context = null) {
	if (selector && selector.jquery) {
		selector.trigger(`destroy.${ns}`);
		return;
	}

	$(selector, $context).each((i, el) => {
		let $element = $(el);
		$element.trigger(`destroy.${ns}`);
	});
};

// ----------------------------------------
// Exports
// ----------------------------------------

export default horizontalScroll;
