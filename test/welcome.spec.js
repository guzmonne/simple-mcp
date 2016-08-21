var rewire = require('rewire')
var expect = require('chai').expect

const welcome = rewire('../dist/js/welcome.js')
const addClass = welcome.__get__('addClass')
const getElementsById = welcome.__get__('getElementsById')
const getParameters = welcome.__get__('getParameters')
const getParameterByName = welcome.__get__('getParameterByName')
const isUrl = welcome.__get__('isUrl')
const isArray = welcome.__get__('isArray')

function classList (classNames) {
	const array = [classNames]
	array.add = (className) => array.push(className) 
	return array
}

const createDocument = () => ({
	getElementById: function(){return classList()}
})

suite('welcome.js', function(){

	suite('#addClass(element, className)', function(){
		test('should add the new className to the array if element.classList is an array', function(){
			// emulate the behaviour of an element
			const element = {
				classList: classList('one'),
			}
			const expected = JSON.stringify(['one', 'two'])
			addClass(element, 'two')
			const actual = JSON.stringify(element.classList)
			expect(actual).to.equal(expected)
		})

		test('should add the new class to the className string separated by a space', function(){
			const element = {
				className: 'one',
			}
			const expected = 'one two'
			addClass(element, 'two')
			const actual = element.className
			expect(actual).to.equal(expected)
		})

		test('should not throw if "element" is undefined', function(){
			expect(addClass(undefined)).to.not.throw
		})
	})

	suite('#getElementsById(ids, document)', function(){
		const ids = ['anID', 'anotherId']
		const innerHtml = document.documentElement.innerHTML

		setup(function(){
			document.write(`
				<div id="anID"></div>
				<div id="anotherId"></div>
			`)
		})

		teardown(function(){
			document.write(innerHtml)
		})

		test('should throw if ids or document is undefined', function(){
			expect(getElementsById).to.throw('undefined arguments')
			expect(getElementsById.bind(this, ids, undefined)).to.throw('undefined arguments')
			expect(getElementsById.bind(this, undefined, document)).to.throw('undefined arguments')
		})

		test('should throw if "document.getElementById" is undefined', function(){
			expect(getElementsById.bind(this, ids, {})).to.throw('document.getElementById is not a function')
		})

		test('should throw if "document.getElementById" is not a function', function(){
			expect(getElementsById.bind(this, ids, {getElementById: 'a string'})).to.throw('document.getElementById is not a function')
		})

		test('should throw if ids is not an array', function() {
			expect(getElementsById.bind(this, 'not an array', document)).to.throw('ids is not an array')
		})

		test('should return an object with its keys mathcing the list of ids', function(){
			const elements = getElementsById(ids, document)
			expect(elements).to.be.an('object')
			expect(JSON.stringify(Object.keys(elements))).to.equal(JSON.stringify(ids))
		})
	})

	suite('#getParameters(list, href)', function(){
		const href = 'http://www.example.com/test?key=value&anotherKey=anotherValue'
		const parametersList = ['key', 'anotherKey']

		test('should throw an error if either argument is missing', function(){
			const errorMsg = 'undefined arguments'
			expect(getParameters.bind(this)).to.throw(errorMsg)
			expect(getParameters.bind(this, parametersList)).to.throw(errorMsg)
			expect(getParameters.bind(this, undefined, href)).to.throw(errorMsg)
		})

		test('should throw if href is not a proper url', function(){
			expect(getParameters.bind(this, parametersList, 'I am not a url')).to.throw('href is not a url')
		})

		test('should return an object with its keys matching the parameters list', function(){
			const parameters = getParameters(parametersList, href)
			expect(parameters).to.be.an('object');
			expect(JSON.stringify(Object.keys(parameters))).to.equal(JSON.stringify(parametersList))
		})

	})

	suite('#getParameterByName(paramName, href)', function(){
		test('should return the parameter value from a url given its key', function(){
			const url = 'http://www.example.com/test?key=value&anotherKey=anotherValue'
			expect(getParameterByName('key', url)).to.equal('value')
		})
	})

	suite('#isUrl(url)', function(){
		test('should return true if argument is a url', function(){
			const url = 'http://www.example.com/test?key=value&anotherKey=anotherValue'
			expect(isUrl(url)).to.be.true
		})

		test('should return false if argument is not a url', function(){
			const values = [undefined, null, '', 123, new Date(), [], {}, 'some string']
			values.map(val => expect(isUrl(val)).to.be.false)
		})
	})

	suite('#isArray(array)', function(){
		test('should return true if argument is an array', function() {
			expect(isArray([])).to.be.true
			expect(isArray([1, 2, 3])).to.be.true
		})

		test('should return false if argument is not an array', function(){
			const values = [undefined, null, '', 123, new Date(), {}, 'some string']
			values.map(val => expect(isArray(val)).to.be.false)
		})
	})

})