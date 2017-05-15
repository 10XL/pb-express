var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	usemin = require('gulp-usemin'),
	ngannotate = require('gulp-ng-annotate'),
	del = require('del'),
	rev = require('gulp-rev');

var basePath = '/client';
// use gulp to uglify, concat and copy to 'dist' folder

gulp.task('usemin', function() {
	return gulp.src('./client/**/*.html')
		.pipe(usemin({
			css: [minifycss(), rev()],
			js: [ngannotate(), uglify(), rev()]
		}))
		.pipe(gulp.dest('../postbucket-angular/'));
});

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('default', ['usemin']);