'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');

const PATHS = {
   base: './',
   src: './src',
   deps: './node_modules'
};

const FILES = {
  index: `${PATHS.src}/index.html`
};


gulp.task('inject:app', () => {
  let target = gulp.src(FILES.index);
  // lets start with an array of one glob, that way its
  // easy to add more later
  let sources = gulp.src(
    // glob to recursively look through all components folder for JS
    [
      './components/**/*.js',
      './components/**/*.css'
    ],
    // this is nifty. gulp doesn't actually have to read the contents
    // of any of these files.  we only care about their locations!
    {
      read: false,
      cwd: __dirname + '/src'
    }
  );
  return target
          .pipe(inject(sources, {
            ignorePath: 'src',
            name: 'app'
          }))
          // hmm, its a bit scary to write over top of our source
          // file, but it appears that this is what is expected
          // for this plugin.  ok then!
          .pipe(gulp.dest(PATHS.src));

});

gulp.task('inject:vendor', () => {
  let target = gulp.src(FILES.index);
  let sources = gulp.src(
    // our vendor files from node_modules
    [
      `${PATHS.deps}/lodash/lodash.js`,
      `${PATHS.deps}/angular/angular.js`,
      `${PATHS.deps}/todomvc-app-css/index.css`,
    ], {
      read: false
    }
  );
  return target
          .pipe(inject(sources, {
            ignorePath: 'src',
            name: 'vendor'
          }))
          .pipe(gulp.dest(PATHS.src));
});


gulp.task('serve:src', ['inject:app', 'inject:vendor'], () => {
    browserSync.init({
        server: {
            baseDir: PATHS.src
        }
    });
});

gulp.task('inject', ['inject:vendor', 'inject:app']);

// alias, because we will forget the specific
gulp.task('serve', ['serve:src', 'inject']);

// always good to have a default
gulp.task('default', ['serve']);
