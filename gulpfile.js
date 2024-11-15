const gulp = require('gulp'),
    // babel = require('gulp-babel'),
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
    data = require('gulp-data'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    htmlbeautify = require('gulp-html-beautify'),
    svgSprite = require('gulp-svg-sprite'),
    cheerio = require('gulp-cheerio'),
    clean = require('gulp-clean'),
    reload = sync.reload,
    src = 'app',
    dist = 'html';

// --------------------------------------------If you need icon fonts
// const iconfont = require('gulp-iconfont'),
//     iconfontCss = require('gulp-iconfont-css'),
//     fontName = 'Icons';

// const iconFonts = () => {
//   return gulp.src([`${src}/i/icons/*.svg`])
//       .pipe(iconfontCss({
//         fontName: fontName,
//         path: `${src}/sass/iconfont/_icons.scss`,
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
//       .pipe(gulp.dest(`${src}/fonts/`));
// };
//
// exports.iconFonts = iconFonts;


const sprite = () => {
    const options = {
        indentSize: 2
    };
    const config = {
        mode: {
            symbol: {
                dest: 'sprite',
                sprite: 'sprite.svg'
            }
        },
        shape: {
            transform: [
                {
                    svgo: false
                }
            ]
        }
    };
    return gulp.src(`${src}/images/icons/*.svg`)
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgSprite(config))
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest(`${dist}/`)); // шлях для збереження спрайта
}

exports.sprite = sprite;

// html task
const html = () => {
    const options = {
        indentSize: 2
    };
    return gulp.src(`${src}/html/*.+(html|njk|twig)`)
        .pipe(data(function () {
            return require(`./${src}/html/data/data.json`)
        }))
        .pipe(nunjucks.compile())
        .pipe(htmlbeautify(options))
        .pipe(removeEmptyLines())
        .pipe(gulp.dest(`${dist}`))
        .pipe(reload({stream: true}));
}

exports.html = html;

// Styles

const style = () => {
    return gulp.src(`${src}/scss/**/*.scss`)
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefix('last 10 versions'))
        .pipe(sourceMaps.write('/'))
        .pipe(gulp.dest(`${dist}/css/`))
};
exports.style = style;

const styleMin = () => {
    return gulp.src(`${src}/scss/**/*.scss`)
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefix('last 10 versions'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourceMaps.write('/'))
        .pipe(gulp.dest(`${dist}/css/`))
        .pipe(reload({stream: true}));
};
exports.styleMin = styleMin;


// Styles libs

const styleLibs = () => {
  return gulp.src(
      [
        './node_modules/swiper/swiper-bundle.min.css',
      ]
  )
      .pipe(cleanCSS())
      .pipe(gulp.dest(`${dist}/css/vendors/`));
};
exports.styleLibs = styleLibs;


// Scripts

const js = () => {
    return gulp.src(`${src}/js/*.js`)
        // .pipe(babel({
        //     presets: ['@babel/preset-env']
        // }))
        .pipe(plumber())
        .pipe(gulp.dest(`${dist}/js/`))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(`${dist}/js/`))
        .pipe(reload({stream: true}));
};

exports.js = js;

// Scripts libs
const jsLibs = () => {
  return gulp.src(
      [
        './node_modules/swiper/swiper-bundle.min.js',
      ]
  )
      .pipe(gulp.dest(`${dist}/js/`));
};

exports.jsLibs = jsLibs;

// Copy

const copy = () => {
    return gulp.src([
        `${src}/fonts/**/*`,
        `${src}/images/**/*`,
        `${src}/scss/**/*`,
        `${src}/i/**/*`,
    ], {
        base: 'app'
    })
        .pipe(gulp.dest(`${dist}`))
        .pipe(sync.stream({
            once: true
        }));
};

exports.copy = copy;

const remove = () => {
    return gulp.src(`${dist}`, { read: false, allowEmpty: true })
        .pipe(clean());
};

exports.remove = remove;

// Server

const server = () => {
    let files = [
        `${src}/scss/**/*.scss`
    ]
    sync.init(files, {
        ui: false,
        notify: false,
        server: {
            baseDir: `${dist}`
        }
    });
};

exports.server = server;

// Watch
const watch = () => {
    gulp.watch(`${src}/html/**/*.+(html|njk|twig)`, gulp.series(html));
    gulp.watch(`${src}/scss/**/*.scss`, gulp.series(style, styleMin));
    gulp.watch(`${src}/js/**/*.js`, gulp.series(js));
    gulp.watch([
        `${src}/fonts/**/*`,
        `${src}/images/**/*`,
        `${src}/i/**/*`,
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
        styleLibs,
        jsLibs,
        copy,
    ),
    gulp.parallel(
        watch,
        server,
    ),
);

exports.deploy = gulp.parallel(
    remove,
    html,
    style,
    styleMin,
    js,
    // styleLibs,
    // jsLibs,
    copy,
)