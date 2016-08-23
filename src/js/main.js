/**
 * Returns true if url has a url format
 * TODO
 * Has some issues
 * @param  {Any} url url to test
 * @return {Bolean}     has url a url format
 */
const isUrl = (url) => {
	const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i')
	return !!url && pattern.test(url)
}
/**
 * Returns true if array is an Array
 * @param  {Any} array test argument
 * @return {Boolean}   test result
 */
const isArray = (array) => !!(array && Array === array.constructor)
/**
 * Returns true if fn is a Function
 * @param  {Any} fn  test argument
 * @return {Boolean} test result
 */
const isFunction = (fn) => {
	const getClass = {}
	return !!fn && getClass.toString.call(fn) === '[object Function]';
}
/**
 * Adds an event listener to a document element and
 * returns a function to disable the event listener.
 * @param  {Element}  element Document element.
 * @param  {String}   event   Event name.
 * @param  {Function} handler Event handler function.
 * @return {Function}         Unsubscribe event handler.
 */
const addEventListener = (element, event, handler) => {
	if (!!element.addEventListener) {
		if (event === 'onsubmit') event = 'submit'
		element.addEventListener(event, handler, false)
		return () => element.removeEventListener(event, handler)
	} else {
		element.attachEvent(event, callback)
		return () => element.detachEvent(event, handler)
	}
}
/**
 * Adds a class to a given element.
 * @param  {Element} element   Document element.
 * @param  {String}  className className to apply
 * @return {Void}
 */
const addClass = (element, className) => {
	if (!element)
		return
	else if (typeof element.classList === 'object') 
		element.classList.add(className)
	else
		element.className += ' ' + className
}
/**
 * Removes a class from an element.
 * @param  {Element} element   Document element.
 * @param  {String}  className className to remove.
 * @return {Void}
 */
const removeClass = (element, className) => {
	if (!element)
		return
	else if (element.classList)
		element.classList.remove(className)
	else
		element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}
/**
 * Toggles a class from an element.
 * @param  {Element} element   Document element.
 * @param  {String}  className Class name
 * @return {Void}
 */
const toggleClass = (element, className) => {
	if (element.classList) {
	  element.classList.toggle(className);
	} else {
	  var classes = element.className.split(' ');
	  var existingIndex = classes.indexOf(className);
	  if (existingIndex >= 0)
	    classes.splice(existingIndex, 1);
	  else
	    classes.push(className);
	  element.className = classes.join(' ');
	}
}
/**
 * Returns the value of a query parameter from a url
 * @param  {String} name Query parameter name.
 * @param  {String} url  URL string
 * @return {String}      Query parameter value.
 */
const getParameterByName = (name, url) => {
	if (!url) return;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
/**
 * Takes a list of ids and returns an object with the
 * ids as keys and the elements associated to it as
 * values.
 * @param  {Array}    ids      List of ids.
 * @param  {Document} document Document element
 * @return {Object}            Element object
 */
const getElementsById = (ids, document) => {
	if (!document || !ids) throw new Error('undefined arguments')
	if (!isFunction(document.getElementById)) throw new Error('document.getElementById is not a function')
	if (!isArray(ids)) throw new Error('ids is not an array')
	return ids
		.map(id => ({[id]: document.getElementById(id)}))
		.reduce((acc, id) => Object.assign(acc, id), {})
}
/**
 * Takes an array of parameters and returns an object
 * with the names of the parameters as keys and the 
 * query values as the keys values.
 * @param  {Array}  ids      Array of keys
 * @param  {String} document URL string
 * @return {Object}          Parameters objects
 */
const getParameters = (list, href) => {
	if (!list || !href) throw new Error('undefined arguments')
	if (!isArray(list)) throw new Error('list is not an array')
	return list
		.map(val => ({[val]: getParameterByName(val, href)}))
		.reduce((acc, obj) => Object.assign(acc, obj), {})
}
/**	
 *  This is taken from the Mozilla Documentation
 */
/**
 * [LambdaError description]
 * @param {Object} response Lambda response object.
 */
function LambdaError(response) {
	this.name = 'LambdaError'
	this.message = response.errorMessage
	this.stack = response.stackTrace
}
/**
 * Set LambdaError prototype to the Error.prototype
 * @type {Error}
 */
LambdaError.prototype = Object.create(Error.prototype)
/**
 * Set the constructor to LambdaError
 * @type {LambdaError}
 */
LambdaError.prototype.constructor = LambdaError
/**
 * Checks the lambda response object for an error
 * message.
 * @param  {Object} response    Lambda response
 * @return {Object|LambdaError} The response object or an Error
 */
const checkError = (response) => {
	if (!!response.errorMessage) 
		throw new LambdaError(response)
	else
		return response
}
/**
 * Takes fetch response and grabs the body of the response.
 * @param  {Object} response Fetch json response body.
 * @return {Object}          JSON response body.
 */
const parseJSON = (response) => response.json()
