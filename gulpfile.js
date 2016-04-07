
/**
* Gulp tasks
*/

var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    path            = require('path'),
    gutil           = require('gulp-util'),
    sass            = require('gulp-sass'),
    prefix          = require('gulp-autoprefixer'),
    cp              = require('child_process');


/**
* Vars
*/

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var paths = {
  "sass": [
    '_sass/*.scss'
  ],

  "js": ['.js/*.js']
};



/**
 * Build the Jekyll Site
 */

gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    .on('close', done);
});


/**
 * Rebuild Jekyll & do page reload
 */

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});


/**
 * Wait for jekyll-build, then launch the Server
 */

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass'])
    .on('change', function(event) {
    var absPath = event.path;
    var relPath = path.basename(absPath);
    console.log(gutil.colors.yellow('CSS ') + relPath + ' was ' + gutil.colors.magenta(event.type) + ', running tasks...');
  });
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */

gulp.task('default', ['browser-sync', 'watch']);