const addClass = (element, className) => {
	if (!!element.classList) 
		element.classList.add(className)
	else
		el.className += ' ' + className
}

const getParametersByName = (name, url) => {
	if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
	

(function(){
	const welcome = document.getElementById('welcome')
	const authorizing = document.getElementById('authorizing')
	const icon = document.getElementById('icon')
	const iconContainer = document.getElementById('iconContainer')
	const provider = getParametersByName('provider', window.location.href) 

	addClass(welcome, 'hidden')
	addClass(icon, `icon-${provider}`)
	addClass(iconContainer, provider)

})()