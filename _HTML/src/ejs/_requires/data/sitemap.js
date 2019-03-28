'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Array}
 * @private
 */
function wrapper (app) {
	const {views} = app.data;

	/**
	 * Составление карты сайта
	 * @type {Array.<Object>}
	 * @memberOf app.data
	 * @sourceCode
	 */
	let sitemap = [{
		href: views['index'].href,
		title: views['index'].title,
		children: [
			{
				href: views['ui'].href,
				title: views['ui'].title,
				children: [
					{
						href: views['ui-wysiwyg'].href,
						title: views['ui-wysiwyg'].title
					},
					{
						href: views['ui-svg'].href,
						title: views['ui-svg'].title
					},
					{
						href: views['ui-forms'].href,
						title: views['ui-forms'].title
					}
				]
			},
			{
				href: views['text-reviews'].href,
				title: views['text-reviews'].title
			},
			{
				href: views['video-reviews'].href,
				title: views['video-reviews'].title
			},
			{
				href: views['about'].href,
				title: views['about'].title
			},
			{
				href: views['subpage'].href,
				title: views['subpage'].title
			},
			{
				href: views['sitemap'].href,
				title: views['sitemap'].title
			},
			{
				href: views['contacts'].href,
				title: views['contacts'].title
			},
			{
				href: views['services'].href,
				title: views['services'].title
			},
			{
				title: views['blog'].title,
				children: [
					{
						href: views['news'].href,
						title: views['news'].title
					},
					{
						href: views['articles'].href,
						title: views['articles'].title
					}
				]
			}
		]
	}];

	return sitemap;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
