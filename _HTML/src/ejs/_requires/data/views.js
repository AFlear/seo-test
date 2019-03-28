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
	const {View} = app.data;

	/**
	 * Флаг быстрого отклбчения критикал стилей для всех страниц
	 * @const {boolean}
	 * @private
	 */
	const disableCriticalCSSByViews = false;

	/**
	 * Справочник по основным страницам `ejs` ренедера
	 * @type {Object}
	 * @memberOf app.data
	 * @sourceCode
	 */
	let views = {
		'index': new View('index', {
			title: 'Главная',
			criticalCSS: [
				'assets/css/critical/generated/index.css'
			]
		}),

		'news': new View('news', {
			title: 'Новости',
			criticalCSS: [
				'assets/css/critical/generated/news.css'
			]
		}),

		'news-item': new View('news-item', {
			title: 'В FACEBOOK стала доступна динамическая реклама для сферы туризма',
			criticalCSS: [
				'assets/css/critical/generated/news-item.css'
			]
		}),

		'articles-item': new View('articles-item', {
			title: 'В FACEBOOK стала доступна динамическая реклама для сферы туризма',
			criticalCSS: [
				'assets/css/critical/generated/articles-item.css'
			]
		}),

		'articles': new View('articles', {
			title: 'Статьи',
			criticalCSS: [
				'assets/css/critical/generated/articles.css'
			]
		}),

		'about': new View('about', {
			title: 'О нас',
			criticalCSS: [
				'assets/css/critical/generated/about.css'
			]
		}),

		'faq': new View('faq', {
			title: 'FAQ',
			criticalCSS: [
				'assets/css/critical/generated/faq.css'
			]
		}),

		'order-service': new View('order-service', {
			title: 'Контекстная реклама Google и Яндекс',
			criticalCSS: [
				'assets/css/critical/generated/order-service.css'
			]
		}),

		'text-reviews': new View('text-reviews', {
			title: 'Отзывы',
			criticalCSS: [
				'assets/css/critical/generated/text-reviews.css'
			]
		}),

		'video-reviews': new View('video-reviews', {
			title: 'Отзывы',
			criticalCSS: [
				'assets/css/critical/generated/video-reviews.css'
			]
		}),

		'services': new View('services', {
			title: 'Услуги',
			criticalCSS: [
				'assets/css/critical/generated/services.css'
			]
		}),

		'subpage': new View('subpage', {
			title: 'Комплексное продвижение',
			criticalCSS: [
				'assets/css/critical/generated/subpage.css'
			]
		}),

		'contacts': new View('contacts', {
			title: 'Контакты',
			criticalCSS: [
				'assets/css/critical/generated/contacts.css'
			]
		}),

		'404': new View('404', {
			title: '404 Страница не найдена',
			criticalCSS: [
				'assets/css/critical/generated/404.css'
			]
		}),

		'sitemap': new View('sitemap', {
			title: 'Карта сайта',
			criticalCSS: [
				// 'assets/css/critical/generated/sitemap.css'
			]
		}),

		'ui': new View('ui', {
			title: 'UI Kit'
		}),

		'blog': new View('blog', {
			title: 'Блог',
			criticalCSS: [
				'assets/css/critical/generated/blog.css'
			]
		}),

		'ui-svg': new View('ui-svg', {
			title: 'UI SVG Icons'
		}),

		'ui-wysiwyg': new View('ui-wysiwyg', {
			title: 'UI Типография'
		}),

		'ui-forms': new View('ui-forms', {
			title: 'UI Формы'
		})
	};

	if (disableCriticalCSSByViews) {
		for (let key in views) {
			views[key].criticalCSS = [];
		}
	}

	return views;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
