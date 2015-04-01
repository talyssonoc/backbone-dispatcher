var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var path = require('path');
var mocha = require('gulp-mocha');

gulp.task('clean', function () {  
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src('src/dispatcher.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('build', ['clean'], function() {  
  return gulp.src([
    'src/dispatcher.js'
    ])
    .pipe(concat('backbone.dispatcher.js'))
    .pipe(umd({
      exports: function(file) {
        return 'Dispatcher';
      },

      namespace: function(file) {
        return 'Backbone.Dispatcher';
      },

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
      },
      template: path.join(__dirname, '/src/umdTemplate.js')
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename('backbone.dispatcher.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function() {
  return gulp.src('test/unit/*Test.js')
    .pipe(mocha({
      globals: ['chai'],
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }));
});