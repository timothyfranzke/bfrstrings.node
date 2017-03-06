var gulp = require('gulp');
var gls = require('gulp-live-server');
var connect = require('gulp-connect');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = 'build';

gulp.task('bowerjs', function() {
    gulp.src(plugins.mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerJson: 'bower.json'
        }
    }))
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.concat('main.js'))
        //.pipe(plugins.uglify({mangle:false}))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('bowercss', function() {
    gulp.src(plugins.mainBowerFiles({
        paths: {
            bowerDirectory: './src/client/bower_components',
            bowerJson: './src/client/bower.json'
        }
    }))
        .pipe(plugins.filter('**/*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('dist/public/css'));

});

gulp.task('html', function(){
    gulp.src(['src/client/**/*.html','src/client/index.html'] )
        .pipe(gulp.dest('dist/public/'));
});

gulp.task('lib', function(){
    gulp.src('src/client/lib/js/*.js')
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/lib'));
    gulp.src('src/client/lib/css/*.js')
        .pipe(plugins.concat('lib.css'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/lib'))
});

gulp.task('img', function(){
    gulp.src(['src/client/img/*'])
        .pipe(gulp.dest('dist/public/img'))
   gulp.src(['src/client/img/bg/*'])
       .pipe(gulp.dest('dist/public/img/bg'))

});

gulp.task('full-clean', function(){
    gulp.src('dist')
        .pipe(plugins.clean())
});

gulp.task('clean', function(){
    gulp.src(['dist'])
});

gulp.task('lint', function(){
    gulp.src(['src/client/app/*.js', 'src/client/app/**/*.js'])
        .pipe(plugins.jslint())
        .pipe(plugins.jslint.reporter( 'stylish' ))
});

gulp.task('hint', function(){
    gulp.src(['src/client/app/*.js', 'src/client/app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter( 'default' ))
});

gulp.task('modules', function(){
    gulp.src(['src/client/app/app.js',
        'src/client/router.js',
        'src/client/bfController.js',
        'src/client/models/*.js',
        'src/client/services/*/js',
        'src/client/app/**/*.js'])
        .pipe(plugins.concat('modules.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/js'))
});
gulp.task('server', function(){
    gulp.src(['src/server/**/*.js'])
        .pipe(gulp.dest('dist/server'));
    gulp.src(['src/index.js'])
        .pipe(gulp.dest('dist'))
});

gulp.task('app', function(){
    gulp.src(['src/app.js'])
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['clean', 'html', 'modules', 'webserver', 'server', 'app', 'lib', 'img'], function(){
    console.log("building")
});

gulp.task('full-build', ['build', 'bowerjs', 'bowercss']);

gulp.task('webserver', function() {
    /*    gulp.src('dist')
     .pipe(plugins.webserver({
     livereload:true,
     directoryListing:false,
     open:true,
     port:8023,
     path:'./dist'
     })
     );*/
    var server = gls.new('./dist/index.js');
    return server.start();
/*    connect.server({
        root: ['dist'],
        port: 8000,
        base: 'http://localhost',
        livereload: true
    })*/
});

gulp.task('watch', function(){
    plugins.watch(['src/client/app/**/*.js', 'src/client/app/**/*.html', 'src/client/app/**/*.css'],['build', 'webserver'])
});
