var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('clean', function () {  
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('build', ['clean'], function() {  
  return gulp.src([
  					'src/fluxybone.core.js',
  					'src/fluxybone.dispatcher.js',
  					'src/fluxybone.footer.js'
  				])
    .pipe(concat('backbone.fluxybone.js'))
    .pipe(umd({
    	dependencies: function() {
    		return [
    			{
    				name: 'backbone',
    				amd: 'backbone',
    				cjs: 'backbone',
    				global: 'Backbone',
    				param: 'Backbone'
    			},
    			{
    				name: 'underscore',
    				amd: 'underscore',
    				cjs: 'underscore',
    				global: '_',
    				param: '_'
    			}
    		]
    	}
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename('backbone.fluxybone.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});