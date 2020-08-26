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
            src: '/*.pug',
            build: '/'
        },
        css: {
            name: 'sass',
            src: '/sass/**/*.sass',
            build: '/css',
            input: 'styles.sass'
        },
        js: {
            name: 'js',
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
        gulp.series(extension.name);
        gulp.watch(options.src + extension.src, gulp.series(extension.name));
    }

    gulp.watch(options.build + "index.html").on('change', browserSync.reload);
});

//html
gulp.task(options.extensions.html.name, function () {
    return pipeline(
        gulp.src(options.src + options.extensions.html.src),
        pug(),
        gulp.dest(options.build + options.extensions.html.build)
    );
});

//css
gulp.task(options.extensions.css.name, function () {
    return pipeline(
        gulp.src(options.src + options.extensions.css.src),
        sass().on('error', sass.logError),
        cleanCSS({
            compatibility: 'ie8'
        }),
        autoprefixer({
            cascade: false
        }),
        gulp.dest(options.build + options.extensions.css.build),
        browserSync.stream()
    );
});

//img
gulp.task(options.extensions.img.name, function () {
    return pipeline(
        gulp.src(options.src + options.extensions.img.src),
        gulp.dest(options.build + options.extensions.img.build)
    );
});

//js
gulp.task(options.extensions.js.name, function () {
    var extension = options.extensions.js;
    return pipeline(
        gulp.src(options.src + extension.src),
        concat(extension.output),
        uglify(),
        gulp.dest(options.build + extension.build)
    );
});

//fonts
gulp.task(options.extensions.fonts.name, function () {
    return pipeline(
        gulp.src(options.src + options.extensions.fonts.src),
        gulp.dest(options.build + options.extensions.fonts.build)
    );
});