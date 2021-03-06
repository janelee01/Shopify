'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var revDel = require('rev-del');

/**
 * Handle stream errors.
 *
 * @link http://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
 */
 var onError = function (err) {
     console.log(err.toString());
     this.emit('end');
 };

gulp.task('styles', function () {
    return gulp.src('scss/style.scss')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sass({
            'outputStyle' : 'compressed',
        }))
        .pipe($.autoprefixer('last 2 version', 'ie 9'))
        .pipe($.concat('lo.css')) // slate grabs this file for it's build
        .pipe(gulp.dest('../src/assets')) 
        .pipe($.size())
});

gulp.task('checkout', function () {
    return gulp.src('scss/checkout.scss')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sass({
            'outputStyle' : 'compressed',
        }))
        .pipe($.autoprefixer('last 2 version', 'ie 9'))
        .pipe($.concat('lo-checkout.css')) // slate grabs this file for it's build
        .pipe(gulp.dest('../src/assets')) 
        .pipe($.size())
});

gulp.task('notifications', function () {
    return gulp.src('scss/notifications.scss')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sass({
            'outputStyle' : 'compressed',
        }))
        .pipe($.autoprefixer('last 2 version', 'ie 9'))
        .pipe($.concat('notifications.css'))
        .pipe(gulp.dest('notifications')) 
        .pipe($.size())
});

// gulp.task('pages', function () {
//     return gulp.src('pages/*')
//         .pipe(gulp.dest('../src/assets')) 
//         .pipe($.size())
// });

gulp.task('default', function () {
  /**
   * Run tasks in sequence.
   * @{@link http://stackoverflow.com/a/22826429}
   */
  return runSequence('styles', 'checkout');
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', function() {
        return runSequence('styles', 'checkout', 'notifications');
    });

    // gulp.watch('pages/*', function() {
    //     return runSequence('pages');
    // });
});
