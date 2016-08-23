/**
 * Builds the profile url from the provider and token values.
 * @param  {String} token    Token value.
 * @param  {String} provider Provider value.
 * @return {String}          Provider Lambda URL.
 */
const profileUrl = (token, provider) =>
	`https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/profile/${token}?provider=${provider}`
/**
 * Calls the Lambda endpoint for the user profile.
 * If fetch() is undefined it returns.
 * @param  {String} options.token    Token value.
 * @param  {String} options.provider Provider value.
 * @return {Promise}                 Profile call promise.
 */
const getProfile = ({token, provider}) => {
	if (!fetch) return
	return fetch(profileUrl(token, provider))
		.then(parseJSON)
		.then(checkError)
}
/**
 * If the user profile is returned, update the welcome page:
 *  - hide authenticating spinner.
 *  - show welcome section.
 *  - set the user name.
 *  - set the user profile.
 * @param  {Object} json User profile json information.
 * @param  {Object} el$  Object of page elements.
 * @return {Void}
 */
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
/**
 * If an error is returned from getProfile() call:
 * - hide authorizing spinner.
 * - show error message.
 * @param  {Error}  err Lambda error.
 * @param  {Object} el$ Object of page elements.
 * @return {Void}
 */
const getProfileError = (err, el$) => {
	console.error(err)
	if (!!el$['errorMessage'] && !!el$['errorMessage']) {
		addClass(el$['authorizing'], 'hidden')
		removeClass(el$['errorMessage'], 'hidden')
	}
}
/**
 * Main page function.
 * - gets the required page elements.
 * - gets the query values from the url.
 * - sets the authenticating spinner icon.
 * - calls the getProfile() method.
 *  - if the response is successful call getProfileSuccess()
 *  - if the response is no successful call getProfileError()
 *  - pass the list of page elements. 
 * @param  {Object} document Page document object-
 * @param  {Object} window   Page window object.
 * @return {Void}
 */
const main = (document, window) => {
	// Log error
	try {
		// Setup
		const ids = [
			'welcome',
			'authorizing',
			'icon',
			'iconContainer',
			'profilePicture',
			'profileName',
			'errorMessage',
		]
		const parameters = [
			'provider',
			'token',
		]
		const el$ = getElementsById(ids, document)
		const query = getParameters(parameters, window.location.href)
		// Set the authenticating spinner icon.
		removeClass(el$['icon'], 'icon-wifi')
		addClass(el$['icon'], `icon-${query['provider']}`)
		addClass(el$['iconContainer'], query['provider'])
		// Get the user profile.
		getProfile(query)
			.then(json => getProfileSuccess(json, el$))
			.catch(err => getProfileError(err, el$))
	} catch (err) {
		console.error(err)
	}
}
/**
 * Main page function.
 */
main(document, window)
