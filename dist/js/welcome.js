'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isUrl = function isUrl(url) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
	'(\\#[-a-z\\d_]*)?$', 'i');
	return !!url && pattern.test(url);
};

var isArray = function isArray(array) {
	return !!(array && Array === array.constructor);
};

var isFunction = function isFunction(fn) {
	var getClass = {};
	return !!fn && getClass.toString.call(fn) === '[object Function]';
};

var addClass = function addClass(element, className) {
	if (!element) return undefined;else if (_typeof(element.classList) === 'object') element.classList.add(className);else element.className += ' ' + className;
};

var getParameterByName = function getParameterByName(name, url) {
	if (!url) return;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var getElementsById = function getElementsById(ids, document) {
	if (!document || !ids) throw new Error('undefined arguments');
	if (!isFunction(document.getElementById)) throw new Error('document.getElementById is not a function');
	if (!isArray(ids)) throw new Error('ids is not an array');
	return ids.map(function (id) {
		return _defineProperty({}, id, document.getElementById(id));
	}).reduce(function (acc, id) {
		return Object.assign(acc, id);
	}, {});
};

var getParameters = function getParameters(list, href) {
	if (!list || !href) throw new Error('undefined arguments');
	if (!isUrl(href)) throw new Error('href is not a url');
	if (!isArray(list)) throw new Error('list is not an array');
	return list.map(function (val) {
		return _defineProperty({}, val, getParameterByName(val, href));
	}).reduce(function (acc, obj) {
		return Object.assign(acc, obj);
	}, {});
};

(function (document, window) {
	try {
		var ids = ['welcome', 'authorizing', 'icon', 'iconContainer'];
		var el$ = getElementsById(ids, document);
		var parameters = ['provider'];
		var query = getParameters(parameters, window.location.href);

		addClass(el$['welcome'], 'hidden');
		addClass(el$['icon'], 'icon-' + query['provider']);
		addClass(el$['iconContainer'], query['provider']);
	} catch (err) {}
})(document, window);
//# sourceMappingURL=welcome.js.map
