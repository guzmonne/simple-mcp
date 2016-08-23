const signupUrl = 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/signup'
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

const getUserDataFromForm = ({name, email, password, age, maleRadio, femaleRadio}) => Promise.resolve({
	name: name.value,
	email: email.value,
	password: password.value,
	age: JSON.parse(age.options[age.selectedIndex].value),
	gender: !!maleRadio.checked ? 'male' : (!!femaleRadio.checked ? 'female' : undefined),
})

const validateData = (data) => {
	console.log(data)
	return Promise.resolve(data)
}

const createUser = (el$, event) => {
	event.preventDefault()
	getUserDataFromForm(el$)
		.then(data => validateData(data))
		.then(data => signupUser(data))
		.then(json => console.log(json))
		.catch(err => console.error(err))
}

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
			'password',
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
