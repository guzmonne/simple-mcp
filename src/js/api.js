import Rx from 'rx-dom'

// social-authentication
//const endpoint = 'https://0qnniuje2b.execute-api.us-east-1.amazonaws.com/dev'
// conatel-cmx
const endpoint = 'https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev' 

function ApiConstructor() {

	/**
	 * Inititates the correct signin process given the provided 'provider'
	 * @param  {String} provider Provider name. One of 'google' or 'facebook'
	 * @return {Void}          
	 */
	const signIn = (provider='facebook') => {
		window.location.href = `${endpoint}/authentication/signin/${provider}`
	}

	const getProfile = (token, provider) => {
		const url = `${endpoint}/authentication/profile/${token}?provider=${provider}`
		return Rx.DOM
			.getJSON(url)
			.do((response) => {
				if (!!response.errorType)
					throw response
			})
	}

	return Object.freeze({
		signIn,
		getProfile,
	})

}

const Api = new ApiConstructor()

export default Api