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

const getParametersByName = (name, url) => {
	if (!url) return;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const getElements = (doc) => {
	if (!!doc)
		throw new Error('document is undefined')
	if (!isFunction(doc.getElementById))
		throw new Error('document.getElementById is not a function')

	const el$ = {
		welcome: doc.getElementById('welcome'),
		authorizing: doc.getElementById('authorizing'),
		icon: doc.getElementById('icon'),
		iconContainer: doc.getElementById('iconContainer'),
	}

	const get$ = (key) => Object.keys(el$).indexOf(key) === -1 ? undefined : el$[key]

	return Object.freeze({
		get$
	})
}

const getParameters = (href) => {
	if (!!href)
		throw new Error('href is undefined')
}

function run(document, href){
	const el$ = getElements(document)
	const query = getParameters(href)

	addClass(el$.get$('welcome'), 'hidden')
	//addClass(el$.get$('icon'), `icon-${query.getParameter('provider')}`)
	//addClass(el$.get$('iconContainer'), query.getParameter('provider'))
}

// Run the page
run(document, window.location.href)
