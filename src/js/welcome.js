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
		return undefined
	else if (typeof element.classList === 'object') 
		element.classList.add(className)
	else
		element.className += ' ' + className
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
	if (!isUrl(href)) throw new Error('href is not a url')
	if (!isArray(list)) throw new Error('list is not an array')
	return list
		.map(val => ({[val]: getParameterByName(val, href)}))
		.reduce((acc, obj) => Object.assign(acc, obj), {})
}

(function (document, window){
	try {
		const ids = ['welcome', 'authorizing', 'icon', 'iconContainer']
		const el$ = getElementsById(ids, document)
		const parameters = ['provider']
		const query = getParameters(parameters, window.location.href)

		addClass(el$['welcome'], 'hidden')
		addClass(el$['icon'], `icon-${query['provider']}`)
		addClass(el$['iconContainer'], query['provider'])
	} catch (err) {}
})(document, window)