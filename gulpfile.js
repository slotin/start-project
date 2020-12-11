'use strict';

// Require Dependencies
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const newer = require('gulp-newer');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const uglifyjs = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');

// Settings
let postCssSettings = [
  autoprefixer({browsers: ['last 2 version']})
];

const projectConfig = require('./projectConfig.json');
let srcPath = projectConfig.path.src || './src/';
let distPath = projectConfig.path.dist || './build/';

// Tasks

// minify js
gulp.task('compress',function() {
  return gulp.src([
    './src/scripts/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(uglifyjs())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/scripts'))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

// Concatenate scripts and styles
gulp.task('concat:scripts', function() {
  return gulp.src(projectConfig.assets.addJs)
    .pipe(concat('load-scripts.js'))
    .pipe(gulp.dest(distPath + 'scripts'));
});

gulp.task('copy:images', function() {
  return gulp.src(srcPath + 'images/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(newer(distPath + 'images'))
    .pipe(gulp.dest(distPath + 'images'));
});

gulp.task('copy:fonts', function() {
  return gulp.src(srcPath + 'fonts/**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(newer(distPath + 'fonts'))
    .pipe(gulp.dest(distPath + 'fonts'));
});

// Style
gulp.task('style', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postCssSettings))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('./build/dist'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Style build
gulp.task('style-build', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gcmq())
    .pipe(postcss(postCssSettings))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./build/dist'));
});

// Include HTML
gulp.task('html', function() {
  const fileinclude = require('gulp-file-include');
  return gulp.src(srcPath + '*.html')
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'HTML compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest(distPath));
});

// Sprite
gulp.task('sprite', function() {
  const spritesmith = require('gulp.spritesmith');
  const merge = require('merge-stream');
  const { img, css } = gulp.src('./src/images/sprite/*.png').pipe(spritesmith({
    imgName: 'spritesheet.png',
    cssName: '_sprite.scss',
    padding: 2,
    cssFormat: 'css',
    imgPath: '../images/spritesheet.png'
  }));
  const imgStream = img.pipe( gulp.dest('./src/images/') );
  const cssStream = css.pipe( gulp.dest('./src/sass/') );
  return merge( imgStream, cssStream );
});

// Clean
gulp.task('clean', function() {
  const del = require('del');
  return del([
    distPath + '*.html',
    distPath + 'fonts',
    distPath + 'images',
    distPath + 'scripts',
    distPath + 'styles'
  ]);
});


// Main tasks


// Build
gulp.task('build-dev', gulp.series('clean', 'style', 'concat:scripts', 'copy:images', 'compress', 'html'));

gulp.task('build', gulp.series('clean', 'style-build', 'concat:scripts', 'copy:images', 'compress' ));

// Watch
gulp.task('serve', gulp.series( 'build-dev', function() {
  browserSync.init({
    server: distPath,
    startPath: '/',
    open: false,
    port: 5050,
  });
  gulp.watch(['src/sass/**/*.scss'], {cwd: './'}, gulp.series('style'));
  gulp.watch(['src/scripts/main.js'], {cwd: './'}, gulp.series('compress'));
  gulp.watch([
    '*.html'
  ], {cwd: srcPath}, gulp.series('watch:html'));
  gulp.watch(['src/**/*.{js,jpg,jpeg,gif,png,svg,mp4}'], {cwd: './'}, gulp.series('watch:reload'));
}));

gulp.task('add-reload', gulp.series('compress', function() {}));
gulp.task('watch:reload', gulp.series('add-reload', reload));
gulp.task('watch:html', gulp.series('html', reload));

// Development task
gulp.task('default', gulp.series('serve'));

// Browser reload
function reload(done) {
  browserSync.reload();
  done();
}
