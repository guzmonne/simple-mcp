var rewire = require('rewire')
var expect = require('chai').expect


const welcome = rewire('../src/js/welcome.js')
const addClass = welcome.__get__('addClass')
const getElements = welcome.__get__('getElements')
const getParameters = welcome.__get__('getParameters')

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

	suite('#getElements(document)', function(){
		test('should throw if "document" is undefined', function(){
			expect(getElements).to.throw('document is undefined')
		})

		test('should throw if "document.getElementById" is undefined', function(){
			expect(getElements.bind(this, {})).to.throw('document.getElementById is not a function')
		})

		test('should throw if "document.getElementById" is not a function', function(){
			expect(getElements.bind(this, {getElementById: "a string"})).to.throw('document.getElementById is not a function')
		})

		test('should return an object with only one method: get$', function(){
			const el$ = getElements(createDocument())
			const keys = Object.keys(el$) 
			expect(keys.length).to.equal(1)
			expect(keys[0]).to.equal('get$')
		})
	})

	suite('#getParameters', function(){
		test('should throw if href is undefined', function(){
			expect(getParameters()).to.throw('href is undefined')
		})
	})
})