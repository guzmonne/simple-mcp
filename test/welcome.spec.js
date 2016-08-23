var rewire = require('rewire')
var expect = require('chai').expect

global.fetch = () => new Promise((resolve, reject) => {
	resolve({
		status: 200,
		statusText: 'ok',
		json: () => ({
			email: 'test@example.com',
			name: 'Test Me',
			picture: 'http://placehold.it/50x50',
		})
	})
})

suite('welcome.js', function(){

})
