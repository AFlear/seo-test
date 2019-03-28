'use strict';

/**
 * @fileOverview Основной файл инициализации модулей
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import './_vendors/promise-polyfill';
import './_vendors/jquery';
import Noty from 'noty';

import horizontalScroll from './_modules/horizontal-scroll';
import wrapMedia from './_modules/wrap-media';
import validation from './_modules/validation';
import {mfpAjax} from './_modules/magnific-popup';
import Accordion from './_modules/wAccordion';
import PriorityMenu from './_modules/wPriorityMenu';
import Blazy from 'blazy';
import 'slick-carousel';

window.Noty = Noty;
Noty.overrideDefaults({
	theme: 'metroui'
});
// ----------------------------------------
// Public
// ----------------------------------------

let autoInitPlugins = [
	Accordion,
	PriorityMenu
];
let initAllPlugins = (autoInitPlugins, context) => {
	autoInitPlugins.forEach(Plugin => {
		if (Plugin.debug) {
			console.group(Plugin.name);
		}
		$(`.js-init${Plugin.initSelector}`, context).each((i, pluginEntryElement) => {
			new Plugin(pluginEntryElement); // eslint-disable-line no-new
		});
		console.groupEnd(Plugin.name);
	});
};

window.jQuery(document).ready(($) => {
	horizontalScroll('.wysiwyg table');
	wrapMedia('.wysiwyg iframe, .wysiwyg video');
	validation('.js-form');
	mfpAjax('.js-mfp-ajax');
	initAllPlugins(autoInitPlugins);
	$('.js-init[data-slick]').each((i, sliderNode) => {
		let $slider = $(sliderNode);
		let presets = {
			'main': {
				dots: true,
				fade: true,
				appendDots: '.main-slider__dots'
			},
			'case': {
				arrows: true,
				prevArrow: '.case-slider__arrow--left',
				nextArrow: '.case-slider__arrow--right',
				autoplay: true,
				infinite: true,
				autoplaySpeed: 4000
			},
			'stage': {
				dots: true,
				fade: true,
				appendDots: '.main-slider__dots'
			},
			'video-reviews': {
				dots: true,
				appendDots: '.reviews-slider-dots',
				initialSlide: 1,
				asNavFor: '[data-slick][data-sync="text-reviews"]',
				responsive: [{
					breakpoint: 768,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}

				}]

			},
			'text-reviews': {
				asNavFor: '[data-slick][data-sync="video-reviews"]',
				initialSlide: 1,
				responsive: [{
					breakpoint: 768,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}

				}]
			}
		};
		let preset = presets[$slider.data('preset')] || {};
		$slider.slick($.extend({
			infinite: false,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			mobileFirst: true
		}, preset));
	});

	// TODO иправить определение не используеиоф переменной!
	let blazy = new Blazy(); // eslint-disable-line no-unused-vars

	// window.smartMenu = new SmartMenu($('.js-init[data-menu]'), {});
	$('.subDropdown').hide();
	$('.js-dropdown').click(function () {
		// $(this).parent().find('.caret').toggle();
	});
	$('.jsOpenPopup').click(function () {
		$.magnificPopup.open({
			items: {
				src: `<div class="magnific-popup _dark-bg "><div class="container"><div class="text-review__popup"><button class="mfp-close" type="button">x</button><div class="text-review__popup-text">${$(this).find('.text-review__comment').text()}</div></div></div></div>`,
				type: 'inline'
			}
		});
	});
	$('.jsOpenPopup-v').on('click', function (e) {
		e.preventDefault();
		$.magnificPopup.open({
			items: {
				src: $(this).find('a').attr('href'),
				type: 'iframe'
			}
		});
	});
});

// ===== Scroll to Top ====
$(window).scroll(function () {
	if ($(this).scrollTop() >= 600) {
		$('.js-top ').fadeIn(200);
	} else {
		$('.js-top ').fadeOut(200);
	}
});
$('.js-top ').on('click', function () {
	$('html, body').animate({scrollTop: 0}, 1000);
	return false;
});
