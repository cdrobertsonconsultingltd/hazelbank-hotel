'use strict';

// -------------------------------------
//   Include Plugins
// -------------------------------------

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cleanCSS    = require('gulp-clean-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var imageop     = require('gulp-image-optimization');
var del         = require('del');

// -------------------------------------
//   Task: Clean
// -------------------------------------

gulp.task('clean', function () {
    del(['dist', 'css/*.css*', 'js/*.js*']);
});

// -------------------------------------
//   Task: Concatenate JS
// -------------------------------------

gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// -------------------------------------
//   Task: Watch
// -------------------------------------

/*gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});*/

// -------------------------------------
//   Task: Serve
// -------------------------------------

// Static Server + watching scss/html files
gulp.task('serve', ['compile-sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("scss/**/*.scss", ['compile-sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// -------------------------------------
//   Task: Compile SASS
// -------------------------------------

gulp.task('compile-sass', function() {
    return gulp.src("scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('minify-css', ["compile-sass"], function () {
    return gulp.src("css/*.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        //.pipe(gulp.rename({ suffix: '.min' }))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream())
});

// -------------------------------------
//   Task: Optimize images
// -------------------------------------

gulp.task('images', function(cb) {
    gulp.src(['img/*.png',
              'img/*.jpg',
              'img/*.gif',
              'img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true }))
        .pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});

// -------------------------------------
//   Task: Build
// -------------------------------------

//gulp.task("build", ['clean', 'images', 'minify-css'], function(){
gulp.task("build", ['clean', 'minify-css'], function(){
    return gulp.src([
            'css/main.css', 
            'js/scripts.min.js', 
            '*.html', 
            'img/**', 
            'fonts/**'], 
        {base: './'})
        .pipe(gulp.dest('dist'));
});

// -------------------------------------
//   Task: Default
// -------------------------------------

// Default Task
//gulp.task('default', ['scripts', 'sass', 'build']);

gulp.task('default', ['serve']);