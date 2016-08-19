'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _rxDom = require('rx-dom');

var _rxDom2 = _interopRequireDefault(_rxDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// social-authentication
//const endpoint = 'https://0qnniuje2b.execute-api.us-east-1.amazonaws.com/dev'
// conatel-cmx
var endpoint = 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev';

function ApiConstructor() {

	/**
  * Inititates the correct signin process given the provided 'provider'
  * @param  {String} provider Provider name. One of 'google' or 'facebook'
  * @return {Void}          
  */
	var signIn = function signIn() {
		var provider = arguments.length <= 0 || arguments[0] === undefined ? 'facebook' : arguments[0];

		window.location.href = endpoint + '/authentication/signin/' + provider;
	};

	var getProfile = function getProfile(token, provider) {
		var url = endpoint + '/authentication/profile/' + token + '?provider=' + provider;
		return _rxDom2.default.DOM.getJSON(url).do(function (response) {
			if (!!response.errorType) throw response;
		});
	};

	return Object.freeze({
		signIn: signIn,
		getProfile: getProfile
	});
}

var Api = new ApiConstructor();

exports.default = Api;
//# sourceMappingURL=api.js.map
