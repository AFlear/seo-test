'use strict';

/**
 * Метод составления справочника хлебных крошек
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @memberOf frontendComponents
 * @param {app} app
 * @requires app.data.views
 * @returns {Array}
 */
function breadcrumbs (app) {
	const {views} = app.data;

	/**
	 * Справочник хлебных крошек
	 * Ключ каждого свойство - имя страницы к которой Вы можете обращатся
	 * Значение каждого свойства - массив объектов, который представляет собой путь к странице
	 *
	 * Вы можете составить любую последовательность
	 * с любым наполнением и контентом на свое усмотрение
	 *
	 * Каждый элемент массива должен иметь значение title для текста
	 * а также при необходимости href - для составления ссылки
	 *
	 * Упрощенный варинат набора данных - подставление с объектов views
	 * которые уже имеют значения `title` и `href`
	 *
	 * @private
	 * @type {Array}
	 */
	const list = {
		'ui': [
			{
				href: views.index.href, // если значение будет логически отрицательным - ссылки не будет
				title: views.index.title // или используем значение с views или можем указать свое строкой - 'Страница Bla-Bla-Bla'
			}, {
				title: views.ui.title
			}
		],

		'ui-svg': [
			views.index,
			views.ui,
			views['ui-svg'] // если элемент последний в списке - ссылки, так же, не будет (по умолчанию шаблона разметки)
		],

		'ui-forms': [
			views.index,
			views.ui,
			views['ui-forms']
		],

		'ui-wysiwyg': [
			views.index,
			views.ui,
			views['ui-wysiwyg']
		],

		'sitemap': [
			views.index,
			views.sitemap
		],

		'news': [
			views.index,
			views.blog,
			views.news
		],

		'news-page': [
			views.index,
			views.news,
			views['news-page']
		],

		'services': [
			views.index,
			views.services
		],

		'about': [
			views.index,
			views.about
		],

		'faq': [
			views.index,
			views.faq
		],

		'text-reviews': [
			views.index,
			views['text-reviews']
		],

		'video-reviews': [
			views.index,
			views['video-reviews']
		],

		'order-service': [
			views.index,
			views.services,
			views.subpage,
			views['order-service']
		],

		'subpage': [
			views.index,
			views.services,
			views.subpage
		],

		'contacts': [
			views.index,
			views.contacts
		],

		'articles': [
			views.index,
			views.blog,
			views.articles
		],

		'news-item': [
			views.index,
			views.blog,
			views.news,
			views['news-item']
		],

		'articles-item': [
			views.index,
			views.blog,
			views.articles,
			views['articles-item']
		]

	};

	return list;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = breadcrumbs;
