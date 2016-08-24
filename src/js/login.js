const signupUrl = 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/signup'
/**
 * Toggles the visible section
 * @param  {Element} options.signupSection Signup section element.
 * @param  {Element} options.signinSection Login section element.
 * @param  {Element} options.socialSection Social login section element.
 * @return {Void}
 */
const toggleSections = ({signupSection, signinSection, socialSection}) => {
	if (signupSection) toggleClass(signupSection, 'hidden')
	if (signinSection) toggleClass(signinSection, 'hidden')
	if (socialSection) toggleClass(socialSection, 'hidden')
}
/**
 * Toggles the buttons to show a login icon.
 * @param  {Element} options.spinButton   Spin button element.
 * @param  {Element} options.createButton Create button element.
 * @return {Void}
 */
const toggleSignupButtons = ({spinButton, createButton}) => {
	if (!!spinButton)   toggleClass(spinButton, 'hidden')
	if (!!createButton) toggleClass(createButton, 'hidden')
}
/**
 * Disables or enables the form.
 * @param  {Object} el$ Object of DOM elements.
 * @return {Void}
 */
const toggleForm = (el$) => {
	const {name, email, password, age, maleRadio, femaleRadio} = el$
	if (name)        name.disabled = !name.disabled
	if (email)       email.disabled = !email.disabled
	if (password)    password.disabled = !password.disabled
	if (age)         age.disabled = !age.disabled
	if (maleRadio)   maleRadio.disabled = !maleRadio.disabled
	if (femaleRadio) femaleRadio.disabled = !femaleRadio.disabled
	toggleSignupButtons(el$)
}
/**
 * Hide alert boxes
 * @param  {Element} options.mandatoryFieldsAlert Mandatory fields element.
 * @param  {Element} options.userExistsAlert      User exists element.
 * @return {Void}
 */
const hideAlerts = ({mandatoryFieldsAlert, userExistsAlert}) => {
	if (!!mandatoryFieldsAlert && !hasClass(mandatoryFieldsAlert, 'hidden'))
		addClass(mandatoryFieldsAlert, 'hidden')
	if (!!userExistsAlert && !hasClass(userExistsAlert))
		addClass(userExistsAlert, 'hidden') 
}
/**
 * Removes the hidden class from the alert element.
 * @param  {Element} alert Alert DOM element.
 * @return {Void}
 */
const showAlert = (alert) => removeClass(alert, 'hidden')
/**
 * Gets the user data from the form.
 * @param  {Element} options.name        Name input.
 * @param  {Element} options.email       Email input.
 * @param  {Element} options.password    Password input.
 * @param  {Element} options.age         Age select.
 * @param  {Element} options.maleRadio   Male radio.
 * @param  {Element} options.femaleRadio Female radio.
 * @return {Promise}                     Resolved promise with form data.
 */
const getUserDataFromForm = ({name, email, password, age, maleRadio, femaleRadio}) => 
	Promise.resolve({
		name: name.value,
		email: email.value,
		password: password.value,
		age: JSON.parse(age.options[age.selectedIndex].value),
		gender: !!maleRadio.checked ? 'male' : (!!femaleRadio.checked ? 'female' : undefined),
	})
/**
 * Validate the user data. If one value is undefined
 * then return a Rejected promise. Else returned a 
 * Resolved promise with the user data.
 * @param  {Object} data New user data.
 * @return {Promise}     Resolved or rejected promise.
 */
const validateData = (data) => {
	const notValid = Object.keys(data)
		.map(key => isEmpty(data[key]))
		.reduce((acc, partial) => acc || partial, false)
	return !!notValid ?
		Promise.reject(new Error('Todos los campos son obligatorios.')) :
		Promise.resolve(data) 
}
/**
 * Calls the lambda function.
 * @param  {Object} data New user data.
 * @return {Promise}     Lambda call promise.
 */
const signupUser = (data) => 
	fetchLambda(signupUrl, {
		method: 'POST',
		headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	  },
		body: JSON.stringify(data),
	})
/**
 * Submit handler. It:
 * - grabs the user data from the form.
 * - validates the user data.
 * - calls the lambda function to create the user.
 * - if the call succeeds log the result.
 * - if the call fails throw an error.
 * @param  {Object} el$   List of elements of interest.
 * @param  {Object} event Event object.
 * @return {Void}
 */
const createUser = (el$, event) => {
	event.preventDefault()
	toggleForm(el$)
	hideAlerts(el$)
	getUserDataFromForm(el$)
		.then(data => validateData(data))
		.then(data => signupUser(data))
		.then(createUserSuccess.bind(this, el$))
		.catch(createUserError.bind(this, el$))
}
/**
 * createUser() success handler.
 * @param  {Object} el$  Object with DOM elements.
 * @param  {String} url  Welcome url.
 * @return {Void}
 */
const createUserSuccess = (el$, url) => {
	console.log(url)
	toggleForm(el$)
	window.location.href = url
}
/**
 * createUser() error handler.
 * @param  {Object} el$ Object with DOM elements.
 * @param  {Error}  err Error object.
 * @return {Void}
 */
const createUserError = (el$, err) => {
	console.error(err)
	const {userExistsAlert, mandatoryFieldsAlert} = el$
	toggleForm(el$)
	if (err.message === 'Todos los campos son obligatorios.')
		showAlert(mandatoryFieldsAlert)
	if (err.message === 'email is in use')
		showAlert(userExistsAlert)
}
/**
 * Main page function.
 * TODO
 * Fill this info
 * @param  {Object} document Page document object-
 * @param  {Object} window   Page window object.
 * @return {Void}
 */
const main = (document, window) => {
	// Log error
	try {
		// Setup
		const ids = [
			// Sections
			'signupSection',
			'signinSection',
			'socialSection',
			// Forms
			'signupForm',
			'loginForm',
			// Anchors
			'showSigninSection',
			'showSignupSection',
			// Form inputs
			'name',
			'email',
			'password',
			'maleRadio',
			'femaleRadio',
			'age',
			// Buttons
			'spinButton',
			'createButton',
			// Alerts
			'mandatoryFieldsAlert',
			'userExistsAlert',
		]
		const el$ = getElementsById(ids, document)
		// Event Handlers
		const toggleSectionHandler = toggleSections.bind(this, el$)
		const createUserHandler = createUser.bind(this, el$)
		// Set event listeners
		addEventListener(el$['showSigninSection'], 'click', toggleSectionHandler)
		addEventListener(el$['showSignupSection'], 'click', toggleSectionHandler)
		addEventListener(el$['signupForm'], 'onsubmit', createUserHandler)
	} catch (err) {
		console.error(err)
	}
}
/**
 * Main page function.
 */
main(document, window)
