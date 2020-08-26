var gulp = require('gulp'),

    pug = require('gulp-pug'), //html preprocess
    browserSync = require('browser-sync').create(), //browser sync, auto reload

    uglify = require('gulp-uglify'), //uglify js files
    concat = require('gulp-concat'), //concat js files
    sourcemaps = require('gulp-sourcemaps'), //sourcemaps

    sass = require('gulp-sass'), //css preprocess
    cleanCSS = require('gulp-clean-css'), //css minify
    autoprefixer = require('gulp-autoprefixer'); //autoprefixes

var options = {
    src: './src',
    build: './build',
    extensions: {
        html: {
            name: 'pug',
            watch: '/**/*.pug',
            src: '/*.pug',
            build: '/'
        },
        css: {
            name: 'sass',
            watch: '/sass/**/*.sass',
            src: '/sass/styles.sass',
            build: '/css'
        },
        js: {
            name: 'js',
            watch: '/js/**/*.js',
            src: '/js/**/*.js',
            build: '/js',
            output: 'script.js'
        },
        img: {
            name: 'img',
            src: '/img/**/*',
            build: '/img'
        },
        fonts: {
            name: 'fonts',
            src: '/fonts/**/*',
            build: '/fonts'
        },
    },
};

gulp.task('default', function () {
    browserSync.init({
        server: {
            baseDir: options.build
        }
    });

    for (key in options.extensions) {
        let extension = options.extensions[key];
        gulp.watch(options.src + extension.watch, gulp.series(extension.name));
    }

    gulp.watch(options.build + "/index.html").on('change', browserSync.reload);
});

//html
gulp.task(options.extensions.html.name, function () {
    var extension = options.extensions.html;
    return gulp.src(options.src + extension.src)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(options.build + extension.build));
});

//css
gulp.task(options.extensions.css.name, function () {
    var extension = options.extensions.css;
    return gulp.src(options.src + extension.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(options.build + extension.build))
        .pipe(browserSync.stream());
});

//js
gulp.task(options.extensions.js.name, function () {
    var extension = options.extensions.js;
    return gulp.src(options.src + extension.src)
        .pipe(concat(extension.output))
        .pipe(uglify())
        .pipe(gulp.dest(options.build + extension.build));
});

//img
gulp.task(options.extensions.img.name, function () {
    var extension = options.extensions.img;
    return gulp.src(options.src + extension.src)
        .pipe(gulp.dest(options.build + extension.build));
});

//fonts
gulp.task(options.extensions.fonts.name, function () {
    var extension = options.extensions.fonts;
    return gulp.src(options.src + extension.src)
        .pipe(gulp.dest(options.build + extension.build));
});