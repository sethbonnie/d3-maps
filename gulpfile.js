var gulp = require( 'gulp' );
var babel = require( 'gulp-babel' );
var browserify = require( 'browserify' );
var buffer = require( 'vinyl-buffer' );
var source = require( 'vinyl-source-stream' );

var paths = {
  srcJS: './src/**/*.js'
};

gulp.task( 'js', ['babel'], function () {
  var b = browserify({
    entries: './dist/js/app.js',
    debug: true
  });

  return b.bundle()
    .pipe( source('app.js') )
    .pipe( buffer() )
    .pipe( gulp.dest('./public/js/') );
});

gulp.task( 'babel', function () {
  gulp.src( paths.srcJS )
    .pipe( babel() )
    .pipe( gulp.dest('dist') );
});

gulp.task( 'default', ['js', 'watch'] );

gulp.task( 'watch', function () {
  gulp.watch(paths.srcJS, ['js']);
});