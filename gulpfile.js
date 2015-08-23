var rev = require('gulp-rev');
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');


gulp.task('clean', function (cb) {
    rimraf('./dist', cb);
});

gulp.task('default', ['clean'], function() {
    return gulp.src('public/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});
