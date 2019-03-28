let Accordion = class Accordion {
	constructor (entryElement, userOptions) {
		let $entryElement = $(entryElement);
		if (!$entryElement.data('wAccordion')) {
			this.init($entryElement, userOptions);
			this.addCrossLinks();
			this.addHandlers();
			this.showDebugInfo(Accordion.debug);
			$entryElement.data('wAccordion', true);
		}
	}

	init ($entryElement, userOptions) {
		if (Accordion.debug) console.groupCollapsed('init');
		let $container = $entryElement;
		let defaultOptions = {
			initial: 0
		};
		let inlineOptions = $container.data('options') || {};
		this.options = $.extend(true, {}, defaultOptions, userOptions, inlineOptions);
		this.$container = $container;
		this.$items = $container.children('[data-accordion="item"]');

		if (Accordion.debug) console.groupEnd('init');
	}

	addCrossLinks () {
		this.$items.each((i, item) => {
			let $item = $(item);
			let $toggle = $item.find('[data-accordion="toggle"]');
			let $content = $item.find('[data-accordion="content"]');
			$toggle.data('$content', $content);
			$toggle.data('$item', $item);
			$content.hide();
		});
	}

	addHandlers () {
		this.$container.on('click', '[data-accordion="toggle"]', e => {
			let $toggle = $(e.currentTarget);
			let $item = $toggle.data('$item');
			let $content = $toggle.data('$content');
			$item.toggleClass('is-open');
			$content.slideToggle();
		});
	}

	showDebugInfo (debug) {
		if (debug) {
			console.log('$container', this.$container);
			console.log('$tabs', this.$tabs);
			console.log('$contents', this.$contents);
		}
	}
};
Accordion.initSelector = '[data-accordion]';
Accordion.debug = false;

export default Accordion;
