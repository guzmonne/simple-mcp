'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isFunction = function isFunction(fn) {
	var getClass = {};
	return !!fn && getClass.toString.call(fn) === '[object Function]';
};

var addClass = function addClass(element, className) {
	if (!element) return undefined;else if (_typeof(element.classList) === 'object') element.classList.add(className);else element.className += ' ' + className;
};

var getParametersByName = function getParametersByName(name, url) {
	if (!url) return;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var getElements = function getElements(doc) {
	if (!!doc) throw new Error('document is undefined');
	if (!isFunction(doc.getElementById)) throw new Error('document.getElementById is not a function');

	var el$ = {
		welcome: doc.getElementById('welcome'),
		authorizing: doc.getElementById('authorizing'),
		icon: doc.getElementById('icon'),
		iconContainer: doc.getElementById('iconContainer')
	};

	var get$ = function get$(key) {
		return Object.keys(el$).indexOf(key) === -1 ? undefined : el$[key];
	};

	return Object.freeze({
		get$: get$
	});
};

var getParameters = function getParameters(href) {
	if (!!href) throw new Error('href is undefined');
};

function run(document, href) {
	var el$ = getElements(document);
	var query = getParameters(href);

	addClass(el$.get$('welcome'), 'hidden');
	//addClass(el$.get$('icon'), `icon-${query.getParameter('provider')}`)
	//addClass(el$.get$('iconContainer'), query.getParameter('provider'))
}

// Run the page
run(document, window.location.href);
//# sourceMappingURL=welcome.js.map
