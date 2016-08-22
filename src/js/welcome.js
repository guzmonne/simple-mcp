const profileUrl = (token, provider) => `https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/profile/${token}?provider=${provider}`

const isUrl = (url) => {
	const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i')
	return !!url && pattern.test(url)
}

const isArray = (array) => !!(array && Array === array.constructor)

const isFunction = (fn) => {
	const getClass = {}
	return !!fn && getClass.toString.call(fn) === '[object Function]';
}

const addClass = (element, className) => {
	if (!element)
		return
	else if (typeof element.classList === 'object') 
		element.classList.add(className)
	else
		element.className += ' ' + className
}

const removeClass = (element, className) => {
	if (!element)
		return
	else if (element.classList)
		element.classList.remove(className)
	else
		element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}

const getParameterByName = (name, url) => {
	if (!url) return;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const getElementsById = (ids, document) => {
	if (!document || !ids) throw new Error('undefined arguments')
	if (!isFunction(document.getElementById)) throw new Error('document.getElementById is not a function')
	if (!isArray(ids)) throw new Error('ids is not an array')
	return ids
		.map(id => ({[id]: document.getElementById(id)}))
		.reduce((acc, id) => Object.assign(acc, id), {})
}

const getParameters = (list, href) => {
	if (!list || !href) throw new Error('undefined arguments')
	if (!isArray(list)) throw new Error('list is not an array')
	return list
		.map(val => ({[val]: getParameterByName(val, href)}))
		.reduce((acc, obj) => Object.assign(acc, obj), {})
}

function LambdaError(response) {
	this.name = 'LambdaError'
	this.message = response.errorMessage
	this.stack = response.stackTrace
}
LambdaError.prototype = Object.create(Error.prototype)
LambdaError.prototype.constructor = LambdaError

const checkError = (response) => {
	if (!!response.errorMessage) 
		throw new LambdaError(response)
	else
		return response
}

const parseJSON = (response) => response.json()

const getProfile = ({token, provider}) => {
	if (!fetch) return
	return fetch(profileUrl(token, provider))
		.then(parseJSON)
		.then(checkError)
}

const getProfileSuccess = (json, el$) => {
	if (!json || !el$) return
	if (!!el$['authorizing'] && !!el$['welcome']) {
		addClass(el$['authorizing'], 'hidden')
		removeClass(el$['welcome'], 'hidden')
	}
	if (!!el$['profilePicture'])
		el$['profilePicture'].src = json.picture || 'http://placehold.it/50x50'
	if (!!el$['profileName'])	
		el$['profileName'].innerHTML  = json.name || json.email || ''
}

const getProfileError = (err, el$) => {
	console.error(err)
	if (!!el$['errorMessage'] && !!el$['errorMessage']) {
		addClass(el$['authorizing'], 'hidden')
		removeClass(el$['errorMessage'], 'hidden')
	}
}

const main = (document, window) => {
	try {
		const ids = ['welcome', 'authorizing', 'icon', 'iconContainer', 'profilePicture', 'profileName', 'errorMessage']
		const el$ = getElementsById(ids, document)
		const parameters = ['provider', 'token']
		const query = getParameters(parameters, window.location.href)

		removeClass(el$['icon'], 'icon-wifi')
		addClass(el$['icon'], `icon-${query['provider']}`)
		addClass(el$['iconContainer'], query['provider'])

		getProfile(query)
			.then(json => getProfileSuccess(json, el$))
			.catch(err => getProfileError(err, el$))
	} catch (err) {
		console.error(err)
	}
}

main(document, window)
