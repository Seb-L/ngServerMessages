var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
	return gulp.src('./ngServerMessages.js')
		.pipe(ngAnnotate())
    	.pipe(uglify())
    	.pipe(rename('ngServerMessages.min.js'))
    	.pipe(gulp.dest('./'));
});