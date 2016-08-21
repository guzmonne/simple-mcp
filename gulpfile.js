const path = require('path')
const gulp = require('gulp')
const webserver = require('gulp-webserver')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const shell = require('gulp-shell')
const mocha = require('gulp-spawn-mocha')

const jsFiles = [
	'./src/js/**/*.js',
	'!./src/js/vendor/**/*.js',
]
const baseFiles = [
	'./src/*.html',
	'./src/tile.png',
	'./src/browserconfig.xml',
	'./src/apple-touch-icon.png',
	'./src/favicon.ico',
	'./src/images/**/*',
	'./src/js/vendor/**/*',
	'./src/css/vendor/**/*',
]
const cssFiles = [
	'./src/css/**/*.css',
	'!./src/css/vendor/**/*.css',
]
const testFiles = [
	'./test/*spec.js',
]
const testAllFiles = [
	'./test/*.js',
]
const defaultOptions = {base: './src/'}

/**
 * Task: copy
 * ----------
 * Copy base files to the dist folder
 */
gulp.task('copy', () => 
	gulp.src(baseFiles, defaultOptions)
		.pipe(gulp.dest('dist'))
)
/**
 * Task: autoprefix
 * ----------------
 * Create sourcemaps and autoprefix css files
 */
gulp.task('autoprefix', () => 
	gulp.src(cssFiles, defaultOptions)
		.pipe(sourcemaps.init())
		.pipe(postcss([
			autoprefixer({browsers: ['last 2 versions']})
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
)
/**
 * Task: babel
 * -----------
 * Transpile javascript with babel
 */
gulp.task('babel', () => 
	gulp.src(jsFiles, defaultOptions)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
)
/**
 * Task: serve
 * -----------
 * Run a webserver to test the webpages
 */
gulp.task('serve', () => 
	gulp.src('dist')
		.pipe(webserver({
			livereload: {
				enable: true,
				filter: fileName => fileName.match(/.map$/) ? false : true
			},
			fallback: 'index.html',
			open: false,
			port: 3000,
			path: '/',
			host: '0.0.0.0',
		}))
)
/**
 * Task: test
 * -------------
 * Run mocha tests
 */
gulp.task('test', () => {
	try {
		gulp.src(testFiles, defaultOptions)
			.pipe(mocha())
	} catch (err) {
		console.log(err)
	}
})
/**
 * Task: watch
 * -------------
 * Watch the appropiate files and run its appropiate tasks
 */
gulp.task('watch', () => {
	gulp.watch(baseFiles, ['copy'])
	gulp.watch(cssFiles, ['autoprefix'])
	gulp.watch(jsFiles, ['lint', 'babel'])
})
/**
 * Task: lint
 * ----------
 * Run eslint on javascript files
 */
gulp.task('lint', () => 
	gulp.src(jsFiles, defaultOptions)
		.pipe(eslint())
		.pipe(eslint.format())
)
/**
 * Task: default
 * -------------
 * Run all the tasks and watch
 */
gulp.task('default', ['copy', 'autoprefix', 'babel', 'lint', 'serve', 'watch'])