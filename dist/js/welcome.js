'use strict';

var addClass = function addClass(element, className) {
	if (!!element.classList) element.classList.add(className);else el.className += ' ' + className;
};

var getParametersByName = function getParametersByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

(function () {
	var welcome = document.getElementById('welcome');
	var authorizing = document.getElementById('authorizing');
	var icon = document.getElementById('icon');
	var iconContainer = document.getElementById('iconContainer');
	var provider = getParametersByName('provider', window.location.href);

	addClass(welcome, 'hidden');
	addClass(icon, 'icon-' + provider);
	addClass(iconContainer, provider);
})();
//# sourceMappingURL=welcome.js.map
