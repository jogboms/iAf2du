var gulp = require('gulp'),
    rename = require('gulp-rename'),
    traceur = require('gulp-traceur'),
    webserver = require('gulp-webserver');

var PATHS = {
  'jsmin' : [
    'build/lib/*.js',
    'min/js'
  ],
  'jsconcat' : [
    'build/lib/*.js',
    'build/prod'
  ]
}

// run init tasks
gulp.task('.', ['dependencies', 'js', 'html', 'images', 'css']);

gulp.task('default', ['.']);

// run development task
gulp.task('dev', ['watch', 'serve']);

// serve the build dir
gulp.task('serve', function () {
  gulp.src('build')
   .pipe(webserver({
      // open: true
      // livereload: true
   }));
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/img/**/*.*', ['images']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.css', ['css']);
});

// move dependencies into build dir
gulp.task('dependencies', function () {
  return gulp.src([
    'node_modules/traceur/bin/traceur-runtime.js',
    'node_modules/systemjs/dist/system-csp-production.src.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/angular2/bundles/angular2.min.js',
    'node_modules/angular2/bundles/http.min.js',
    'node_modules/angular2/bundles/router.min.js',
    'node_modules/angular2/bundles/angular2-polyfills.min.js',
    'node_modules/rxjs/bundles/Rx.min.js',
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/es6-shim/es6-shim.map'
  ])
    .pipe(gulp.dest('build/lib'));
});

// transpile & move js
gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(rename({
      extname: ''
    }))
    .pipe(traceur({
      // modules: 'parse',
      // modules: 'amd',
      // modules: 'commonjs',
      // modules: 'closure',
      modules: 'instantiate',
      // modules: 'inline',
      // modules: 'bootstrap',
      moduleName: true,
      annotations: true,
      types: true,
      memberVariables: true
    }))
    .on('error', console.log.bind(console))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jsconcat', function () {
  var concat = require('gulp-concat');

  // return gulp.src(['build/lib/angular2.js'])
  //     .pipe(concat('angular2.min.js'))
  //     .pipe(gulp.dest('build/lib'));
  // return gulp.src(['build/lib/dep/*.js'])
  //     .pipe(concat('angular2-dependencies.min.js'))
  //     .pipe(gulp.dest(PATHS.jsconcat[1]));
  // return gulp.src(['build/lib/*.js'])
  //     .pipe(concat('angular2-all.min.js'))
  //     .pipe(gulp.dest(PATHS.jsconcat[1]));
  // return gulp.src(PATHS.jsconcat[0])
  //     .pipe(concat('library.js'))
  //     .pipe(gulp.dest(PATHS.jsconcat[1]));
});

gulp.task('jsmin', function () {
  var jsmin = require('gulp-jsmin');
  var rename = require('gulp-rename');

  return gulp.src(['build/lib/angular2.js'])
      .pipe(jsmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('build/lib'));

  gulp.src(PATHS.jsmin[0])
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(PATHS.jsmin[1]));
});


// move html
gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'))
});

// move html
gulp.task('images', function () {
  return gulp.src('src/img/**/*.*')
    .pipe(gulp.dest('build/img'))
});

// move css
gulp.task('css', function () {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('build'))
});
