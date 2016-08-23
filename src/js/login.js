/**
 * Toggles the visible form
 * @param  {Element} options.signupForm Signup form element.
 * @param  {Element} options.loginForm  Login form element.
 * @return {Void}
 */
const toggleForms = ({signupForm, loginForm, socialIcons}) => {
	if (!!signupForm) toggleClass(signupForm, 'hidden')
	if (!!loginForm)  toggleClass(loginForm, 'hidden')
	if (!!loginForm)  toggleClass(socialIcons, 'hidden')
}

const createUser = ({name, email, age, maleRadio, femaleRadio}, event) => {
	event.preventDefault()
	const data = {
		name: name.value,
		email: email.value,
		age: JSON.parse(age.options[age.selectedIndex].value),
		gender: !!maleRadio.checked ? 'male' : (!!femaleRadio.checked ? 'female' : undefined),
	}
	console.log(data)
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
			'signupForm',
			'loginForm',
			'socialIcons',
			'showLoginForm',
			'showSignupForm',
			'signupForm',
			'name',
			'email',
			'maleRadio',
			'femaleRadio',
			'age',
		]
		const el$ = getElementsById(ids, document)
		// Event Handlers
		const toggleFormsHandler = toggleForms.bind(this, el$)
		const createUserHandler = createUser.bind(this, el$)
		// Set event listeners
		addEventListener(el$['showLoginForm'], 'click', toggleFormsHandler)
		addEventListener(el$['showSignupForm'], 'click', toggleFormsHandler)
		addEventListener(el$['signupForm'], 'onsubmit', createUserHandler)
	} catch (err) {
		console.error(err)
	}
}
/**
 * Main page function.
 */
main(document, window)
