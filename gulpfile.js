'use strict';

import pkg from 'gulp';
const { gulp, src, dest, watch, lastRun, parallel, series } = pkg

import browserSync      from 'browser-sync'
import del              from 'del'
import pug              from 'gulp-pug'

import gulpSass         from 'gulp-sass'
import dartSass         from 'sass'
const  sass             = gulpSass(dartSass)

import prettyHtml       from 'gulp-pretty-html'
import rename           from 'gulp-rename'
import babel            from "gulp-babel"
import autoprefixer     from 'gulp-autoprefixer'
import cleancss         from 'gulp-clean-css'
import concat           from 'gulp-concat'
import replace          from 'gulp-replace'

import webpackStream    from 'webpack-stream'
import webpack          from 'webpack'

import debug            from 'gulp-debug'
import multipipe        from 'multipipe'
import imagemin         from 'gulp-imagemin'
import notify           from 'gulp-notify'


const config = {
    sourcePath: 'src',
    buildPath: 'build',
    prettyHtml: {
        indent_size: 2,
        indent_char: ' ',
        unformatted: ['code', 'em', 'strong', 'span', 'i', 'b', 'br', 'script'],
        content_unformatted: [],
    },
    webpack: {
        mode: 'production',
        //devtool: mode === 'development' ? 'inline-source-map' : false,
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules)/,
                    resolve: {
                        fullySpecified: false
                    },
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }
    },
    autoprefixer: {
        overrideBrowserslist: ['last 10 versions'],
        grid: true
    },
    cleancss: {
        inline: ['none'],
        level: {
            1: { specialComments: 0 }
        }
    }
}

function clearBuild() {
    return del('build/**/*', { force: true })
}

function copyAssets() {
    return src('src/assets/**/*.*', { since: lastRun('copyAssets') })
        .pipe(debug({title: 'Renames '}))
        .pipe(imagemin())
        .pipe(debug({title: 'Minify '}))
        .pipe(dest('build/assets'));
}

function copyImagesBlocks() {
    return src('src/blocks/**/*.{svg,jpg,png,webp,gif,jpeg}', { since: lastRun('copyImagesBlocks'), base: 'src' })
        .pipe(debug({title: 'Copies '}))
        .pipe(imagemin())
        .pipe(debug({title: 'Minify '}))
        .pipe(rename((file) => file.dirname = file.dirname.replace('\\images', '')))
        .pipe(debug({title: 'Renames '}))
        .pipe(dest('build/images/'));
}

function copyImages() {
    return src('src/images/**/*', { since: lastRun('copyImages') })
        .pipe(debug({title: 'Copies '}))
        .pipe(imagemin([imagemin.gifsicle(), imagemin.mozjpeg(), imagemin.optipng()]))
        .pipe(debug({title: 'Minify '}))
        .pipe(dest('build/images'));
}

function copyFonts() {
    return src('src/fonts/**/*', { since: lastRun('copyFonts') })
        .pipe(debug({title: 'Copies '}))
        .pipe(dest('build/fonts'));
}

function copyFavicon() {
    return src('src/favicon/**/*', { since: lastRun('copyFavicon') })
        .pipe(debug({title: 'Copies '}))
        .pipe(dest('build/favicon'));
}

function compileSass() {
    return multipipe(
        src('src/scss/styles.scss'),
        sass(),
        debug({title: 'Compiles '}),
        replace(/..\/..\/blocks\/([a-zA-Z0-9_-]+)\/images\/([a-zA-Z0-9_-]+).([a-zA-Z0-9_-]+)/g, '../images/blocks/$1/$2.$3'),
        debug({title: 'Replaces path to image '}),
        /** TODO: autoprefixer сыпет ошибки в конечный css - надо разобрать их и вернуть */
        //debug({title: 'Add browser prefix '}),
        //autoprefixer(config.autoprefixer),
        cleancss( {...config.cleancss, format: 'beautify'} ),
        rename({ basename: 'main' }),
        debug({title: 'Renames '}),
        dest('build/css')
    ).on('error', notify.onError("<%= error.title %>: <%= error.message %>"));
}

function compilePug() {
    return multipipe(
        src('src/pug/pages/*.pug'),
        pug(),
        debug({title: 'Compiles '}),
        prettyHtml(config.prettyHtml),
        replace(/blocks\/([a-zA-Z0-9_-]+)\/images\/([a-zA-Z0-9_-]+).([a-zA-Z0-9_-]+)/g, '../images/blocks/$1/$2.$3'),
        debug({title: 'Replaces path to image '}),
        dest('build')
    ).on('error', notify.onError("<%= error.title %>: <%= error.message %>"));
}

function compileJs() {
    return multipipe(
        src('src/js/main.js'),
        webpackStream(config.webpack),
        dest('build/js'),
    ).on('error', notify.onError());
}

function compileLibsJs() {
    return multipipe(
        src([
            'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
            'node_modules/flickity/dist/flickity.pkgd.min.js',
            'node_modules/wow.js/dist/wow.min.js'
        ]),
        concat('libs.min.js'),
        dest('build/js/'),
    ).on('error', notify.onError());
}

function compileLibsSass() {
    return multipipe(
        src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/animate.css/animate.css',
            'node_modules/@fancyapps/ui/dist/fancybox.css',
            'node_modules/flickity/dist/flickity.css'
        ]),
        sass(),
        cleancss( config.cleancss ),
        concat('libs.min.css'),
        dest('build/css')
    ).on('error', notify.onError("<%= error.title %>: <%= error.message %>"));
}

function serve() {
    browserSync.init({
        server: 'build',
        notify: false
    });

    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
}

function startWatch() {
    watch('src/**/*.pug', compilePug)
    watch('src/**/*.{sass,scss}', compileSass)
    watch('src/**/*.js', compileJs)

    watch('src/assets/**/*', copyAssets);
    watch('src/blocks/**/images/*', copyImagesBlocks);
    watch('src/images/**/*', copyImages);
    watch('src/fonts/**/*', copyFonts);
    watch('src/favicon/**/*', copyFavicon);
}

// Utils
export { clearBuild };

// Copies
export { copyAssets, copyImagesBlocks, copyImages, copyFonts, copyFavicon }

// Compiles
export { compilePug, compileSass, compileJs, compileLibsSass, compileLibsJs }

export let compileLibs = parallel(compileLibsSass, compileLibsJs);

// Build
export let build = series(
    clearBuild,
    parallel(copyAssets, copyImagesBlocks, copyImages, copyFonts, copyFavicon),
    parallel(compileSass, compilePug, compileJs, compileLibs)
);

export default series(
    parallel(compileSass, compilePug, compileJs, compileLibs),
    parallel(startWatch, serve)
);