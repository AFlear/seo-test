class PriorityMenu {
	constructor (entryElement, userOptions) {
		let $entryElement = $(entryElement);
		if (!$entryElement.data('wPriorityMenu')) {
			this.init($entryElement, userOptions);
			this.showDebugInfo(PriorityMenu.debug);
			$entryElement.data('wPriorityMenu', true);
		}
	}

	init ($entryElement, userOptions) {
		let _self = this;
		let $container = $entryElement;
		let defaultOptions = {
			dropdownSelector: '[data-priority-menu="dropdown"]',
			secondaryContentSelector: '[data-priority-menu="secondary"]',
			hiddenItemClass: 'PriorityMenu' + '__hidden-item',
			visibleItemClass: 'PriorityMenu' + '__visible-item'
		};
		let inlineOptions = $container.data('options') || {};
		this.options = $.extend(true, {}, defaultOptions, userOptions, inlineOptions);
		this.$container = $container;
		this.$secondaryItemsContainer = this.$container.find(this.options.secondaryContentSelector);
		this.$allMenuItems = this.$container.children();
		this.$dropdownItem = this.$allMenuItems.filter(this.options.dropdownSelector);
		this.$allMenuItems.not(this.$dropdownItem).addClass(this.options.visibleItemClass);
		this.extendJquery();
		this.checkAvailableSpace();
		let resizeTimer;
		$(window).on('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				_self.checkAvailableSpace();
			}, 300);
		});
	}

	extendJquery () {
		$.fn.outerWidthOfAll = function () {
			let sum = 0;
			this.each((i, el) => {
				sum += $(el).outerWidth();
			});
			return Math.ceil(sum);
		};
		$.fn.sortByPriority = function () {
			return this.sort((a, b) => {
				let getPriority = el => +el.dataset.priority;
				return getPriority(a) - getPriority(b);
			});
		};
	}

	rescanItems () {
		let {hiddenItemClass, visibleItemClass} = this.options;
		this.$visibleItems = this.$allMenuItems.filter('.' + visibleItemClass);
		this.$hiddenItems = this.$allMenuItems.filter('.' + hiddenItemClass);
	}

	get deltaSpace () {
		let {$container, $dropdownItem, $allMenuItems} = this;
		$container.css('overflow', 'hidden');
		let containerSize = ~~($container.width() - $dropdownItem.outerWidth());
		let itemsSize = $allMenuItems.not($dropdownItem).outerWidthOfAll();
		$container.css('overflow', 'visible');
		return containerSize - itemsSize;
	}

	checkAvailableSpace () {
		this.rescanItems();
		let delta = this.deltaSpace;
		if (delta < 0) {
			console.log('lack of space', delta);
			this.$dropdownItem.show();
			this.$visibleItems.sortByPriority().eq(0)
				.removeClass(this.options.visibleItemClass)
				.addClass(this.options.hiddenItemClass);
		} else {
			if (delta > 1) {
				console.log('has space', delta);
			} else {
				console.log('delta zero');
				this.$dropdownItem.hide();
			}
		}
	}

	showDebugInfo (debug) {
		if (debug) {
			console.group('debugInfo');
			console.log('$container', ~~this.$container.width());
			console.log('$items', this.$items);
			console.groupEnd('debugInfo');
		}
	}
}

PriorityMenu.initSelector = '[data-priority-menu]';
PriorityMenu.debug = false;

export default PriorityMenu;
