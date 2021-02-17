const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/partials/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            prefix: "",
            suffix: ".min",
          }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
})

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles")); //Сначала выполнится watch(т.е. наблюдение за изменением sass), потом styles и styles запустит browser.Sync.
    gulp.watch("src/partials/*.html").on("change", gulp.parallel('inject'));
    gulp.watch("src/*.html").on("change", gulp.parallel('inject'));
    gulp.watch("src/temp/*.html").on("change", gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on("change", gulp.parallel('scripts'));
    gulp.watch("src/fonts/**/*").on("all", gulp.parallel('fonts'));
    gulp.watch("src/icons/**/*").on("all", gulp.parallel('icons'));
    gulp.watch("src/img/**/*").on("all", gulp.parallel('image'));
});

gulp.task('inject', function() {
    return gulp.src('src/index.html')
        .pipe(inject(gulp.src(['src/partials/*.html']), {
            starttag: '<!-- inject:{{path}} -->',
            relative: true,
            removeTags: true,
            transform: function (filePath, file) {
                // return file contents as string
                return file.contents.toString('utf8')
            }
        }))
        .pipe(gulp.dest('src/temp/'));
});

gulp.task('html', function() {
    return gulp.src("src/temp/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function() {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.stream());
});

gulp.task('icons', function() {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

gulp.task('image', function() {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
});

gulp.task('default', gulp.parallel('watch', 'styles', 'browser-sync', 'scripts', 'fonts', 'icons', 'image', 'inject', 'html'));