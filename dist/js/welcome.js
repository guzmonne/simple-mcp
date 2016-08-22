'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var profileUrl = function profileUrl(token, provider) {
	return 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/profile/' + token + '?provider=' + provider;
};

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
	if (!element) return;else if (_typeof(element.classList) === 'object') element.classList.add(className);else element.className += ' ' + className;
};

var removeClass = function removeClass(element, className) {
	if (!element) return;else if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
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
	if (!isArray(list)) throw new Error('list is not an array');
	return list.map(function (val) {
		return _defineProperty({}, val, getParameterByName(val, href));
	}).reduce(function (acc, obj) {
		return Object.assign(acc, obj);
	}, {});
};

function LambdaError(response) {
	this.name = 'LambdaError';
	this.message = response.errorMessage;
	this.stack = response.stackTrace;
}
LambdaError.prototype = Object.create(Error.prototype);
LambdaError.prototype.constructor = LambdaError;

var checkError = function checkError(response) {
	if (!!response.errorMessage) throw new LambdaError(response);else return response;
};

var parseJSON = function parseJSON(response) {
	return response.json();
};

var getProfile = function getProfile(_ref3) {
	var token = _ref3.token;
	var provider = _ref3.provider;

	if (!fetch) return;
	return fetch(profileUrl(token, provider)).then(parseJSON).then(checkError);
};

var getProfileSuccess = function getProfileSuccess(json, el$) {
	if (!json || !el$) return;
	if (!!el$['authorizing'] && !!el$['welcome']) {
		addClass(el$['authorizing'], 'hidden');
		removeClass(el$['welcome'], 'hidden');
	}
	if (!!el$['profilePicture']) el$['profilePicture'].src = json.picture || 'http://placehold.it/50x50';
	if (!!el$['profileName']) el$['profileName'].innerHTML = json.name || json.email || '';
};

var getProfileError = function getProfileError(err, el$) {
	console.error(err);
	if (!!el$['errorMessage'] && !!el$['errorMessage']) {
		addClass(el$['authorizing'], 'hidden');
		removeClass(el$['errorMessage'], 'hidden');
	}
};

var main = function main(document, window) {
	try {
		(function () {
			var ids = ['welcome', 'authorizing', 'icon', 'iconContainer', 'profilePicture', 'profileName', 'errorMessage'];
			var el$ = getElementsById(ids, document);
			var parameters = ['provider', 'token'];
			var query = getParameters(parameters, window.location.href);

			removeClass(el$['icon'], 'icon-wifi');
			addClass(el$['icon'], 'icon-' + query['provider']);
			addClass(el$['iconContainer'], query['provider']);

			getProfile(query).then(function (json) {
				return getProfileSuccess(json, el$);
			}).catch(function (err) {
				return getProfileError(err, el$);
			});
		})();
	} catch (err) {
		console.error(err);
	}
};

main(document, window);
//# sourceMappingURL=welcome.js.map
