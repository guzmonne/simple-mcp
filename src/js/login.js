const mainUrl = 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev'
const signupUrl = `${mainUrl}/authentication/signup`
const signinUrl = `${mainUrl}/authentication/login`
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
const toggleButtons = () =>
	map(document.forms, form => 
		map([...form.getElementsByTagName('button'), ...form.getElementsByTagName('a')], 
			button => toggleClass(button, 'hidden')))
/**
 * Disables or enables the form.
 * @param  {Object} el$ Object of DOM elements.
 * @return {Void}
 */
const toggleForm = (el$) => {
	map(document.forms, 
		form => map(form.getElementsByClassName('form-control'), 
			input => input.disabled = !input.disabled))
	toggleButtons()
	hideAlerts(el$)
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
const getUserDataFromSignupForm = ({name, email, password, age, maleRadio, femaleRadio}) => 
	Promise.resolve({
		name: name.value,
		email: email.value,
		password: password.value,
		age: JSON.parse(age.options[age.selectedIndex].value),
		gender: !!maleRadio.checked ? 'male' : (!!femaleRadio.checked ? 'female' : undefined),
	})
/**
 * Gets the user data from the loginForm
 * @param  {Element} options.loginForm Login form element.
 * @return {Void}
 */
const getUserDataFromLoginForm = ({loginForm}) => 
	Promise.resolve(
		map(loginForm.getElementsByClassName('form-control'), input => 
			({[input.name]: input.value})
		).reduce((acc, input) => Object.assign(acc, input), {})
	)
	
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
 * Calls the signup Lambda function.
 * @param  {Object} data New user data.
 * @return {Promise}     Lambda call promise.
 */
const signupUser = (data) => fetchJSONLambda(signupUrl, data)
/**
 * Calls the login Lambda function.
 * @param  {Object} data New user data.
 * @return {Promise}     Lambda call promise.
 */
const signinUser = (data, query) => fetchJSONLambda(urlBuilder(signinUrl, query), data)
/**
 * Login handler. It:
 * - grabs the user data from the login form.
 * - validates the user data.
 * - calls the lambda function to login the user.
 * - if the call succeeds redirect to welcome page.
 * - if the call fails throw an error.
 * @param  {Object} el$   List of elements of interest.
 * @param  {Object} event Event object.
 * @return {Void}
 */
const loginUser = (el$, query, event) => {
	event.preventDefault()
	toggleForm(el$)
	getUserDataFromLoginForm(el$)
		.then(data => validateData(data))
		.then(data => signinUser(data, query))
		.then(lambdaCallSuccess.bind(null, el$))
		.catch(loginUserError.bind(null, el$))
}

const loginUserError = (el$, err) => {
	console.error(err)
	toggleForm(el$)
}
/**
 * Submit handler. It:
 * - grabs the user data from the form.
 * - validates the user data.
 * - calls the lambda function to create the user.
 * - if the call succeeds redirect to welcome page.
 * - if the call fails throw an error.
 * @param  {Object} el$   List of elements of interest.
 * @param  {Object} event Event object.
 * @return {Void}
 */
const createUser = (el$, event) => {
	event.preventDefault()
	toggleForm(el$)
	getUserDataFromSignupForm(el$)
		.then(data => validateData(data))
		.then(data => signupUser(data))
		.then(lambdaCallSuccess.bind(null, el$))
		.catch(createUserError.bind(null, el$))
}
/**
 * createUser() success handler.
 * @param  {Object} el$  Object with DOM elements.
 * @param  {String} url  Welcome url.
 * @return {Void}
 */
const lambdaCallSuccess = (el$, url) => {
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
		const parameters = [
			'node_mac',
			'client_ip',
			'client_mac',
			'base_grant_user',
			'user_continue_url',
		]
		const el$ = getElementsById(ids, document)
		const query = getParameters(parameters, window.location.href)
		// Event Handlers
		const toggleSectionHandler = toggleSections.bind(this, el$)
		const createUserHandler = createUser.bind(this, el$)
		const loginUserHandler = loginUser.bind(this, el$, query)
		// Set event listeners
		addEventListener(el$['showSigninSection'], 'click', toggleSectionHandler)
		addEventListener(el$['showSignupSection'], 'click', toggleSectionHandler)
		addEventListener(el$['signupForm'], 'onsubmit', createUserHandler)
		addEventListener(el$['loginForm'], 'onsubmit', loginUserHandler)
	} catch (err) {
		console.error(err)
	}
}
/**
 * Main page function.
 */
main(document, window)
