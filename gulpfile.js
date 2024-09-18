const gulp = require('gulp'),
    babel = require('gulp-babel'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    // concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    // concatCss = require('gulp-concat-css'),
    sourceMaps = require('gulp-sourcemaps'),
    sync = require('browser-sync'),
    nunjucks = require('gulp-nunjucks'),
    data = require('gulp-data')
reload = sync.reload;

// --------------------------------------------If you need icon fonts
// const iconfont = require('gulp-iconfont'),
//     iconfontCss = require('gulp-iconfont-css'),
//     fontName = 'Icons';

// const iconFonts = () => {
//   return gulp.src(['app/i/icons/*.svg'])
//       .pipe(iconfontCss({
//         fontName: fontName,
//         path: 'app/sass/iconfont/_icons.scss',
//         targetPath: '../sass/icons/_icons.scss',
//         fontPath: '../fonts/'
//       }))
//       .pipe(iconfont({
//         fontName: fontName,
//         formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
//         normalize: true,
//         fontHeight: 1001,
//         centerHorizontally: true
//       }))
//       .pipe(gulp.dest('app/fonts/'));
// };
//
// exports.iconFonts = iconFonts;

// html task
const html = () => {
  return gulp.src('app/html/*.+(html|njk|twig)')
      .pipe(data(function() {
        return require('./app/html/data/data.json')
      }))
      .pipe(nunjucks.compile())
      .pipe(gulp.dest('./html'))
      .pipe(reload({stream: true}));
}

exports.html = html;

// Styles

const style = () => {
  return gulp.src('app/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(prefix('last 10 versions'))
      .pipe(sourceMaps.write('/'))
      .pipe(gulp.dest('html/css/'))
};
exports.style = style;

const styleMin = () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefix('last 10 versions'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourceMaps.write('/'))
        .pipe(gulp.dest('html/css/'))
        .pipe(reload({stream: true}));
};
exports.styleMin = styleMin;


// Styles libs

// const styleLibs = () => {
//   return gulp.src(
//       [
//         './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
//       ]
//   )
//       .pipe(cleanCSS())
//       .pipe(gulp.dest('html/css/vendors/'));
// };
// exports.styleLibs = styleLibs;


// Scripts

const js = () => {
    return gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(plumber())
        .pipe(gulp.dest('html/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('html/js/'))
        .pipe(reload({stream: true}));
};

exports.js = js;

// Scripts libs
// const jsLibs = () => {
//   return gulp.src(
//       [
//         'node_modules/jquery/dist/jquery.min.js',
//       ]
//   )
//       .pipe(gulp.dest('html/js/'));
// };
//
// exports.jsLibs = jsLibs;

// Copy

const copy = () => {
  return gulp.src([
    'app/fonts/**/*',
    'app/images/**/*',
    'app/scss/**/*',
    'app/i/**/*',
  ], {
    base: 'app'
  })
      .pipe(gulp.dest('html'))
      .pipe(sync.stream({
        once: true
      }));
};

exports.copy = copy;


// Server

const server = () => {
  let files = [
    'app/scss/**/*.scss'
  ]
  sync.init(files,{
    ui: false,
    notify: false,
    server: {
      baseDir: 'html'
    }
  });
};

exports.server = server;

// Watch
const watch = () => {
  gulp.watch('app/html/**/*.+(html|njk|twig)', gulp.series(html));
  gulp.watch('app/scss/**/*.scss', gulp.series(style, styleMin));
  gulp.watch('app/js/**/*.js', gulp.series(js));
  gulp.watch([
    'app/fonts/**/*',
    'app/images/**/*',
  ], gulp.series(copy));
};

exports.watch = watch;

// Default

exports.default = gulp.series(
    gulp.parallel(
        html,
        style,
        styleMin,
        js,
        // styleLibs,
        // jsLibs,
        copy,
    ),
    gulp.parallel(
        watch,
        server,
    ),
);