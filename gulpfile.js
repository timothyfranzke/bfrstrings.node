var gulp = require('gulp');
var gls = require('gulp-live-server');
var connect = require('gulp-connect');
var server;
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
        .pipe(gulp.dest('dist/public/site/js'))
        .pipe(gulp.dest('dist/public/admin/js'));
});

gulp.task('bowercss', function() {
    gulp.src(plugins.mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerJson: 'bower.json'
        }
    }))
        .pipe(plugins.filter('**/*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('dist/public/site/css'))
        .pipe(gulp.dest('dist/public/admin/css'))
    ;
});

gulp.task('html', function(){
    gulp.src(['src/client/site/**/*.html'] )
        .pipe(gulp.dest('dist/public/site/'));
    gulp.src(['src/client/admin/**/*.html'] )
        .pipe(gulp.dest('dist/public/admin/'));
});

gulp.task('lib', function(){
    gulp.src('src/client/site/lib/js/*.js')
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/site/lib'));
    gulp.src('src/client/site/lib/css/*.js')
        .pipe(plugins.concat('lib.css'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/site/lib'));
    gulp.src('src/client/admin/lib/js/*.js')
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/admin/lib'));
    gulp.src('src/client/admin/lib/css/*.js')
        .pipe(plugins.concat('lib.css'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/admin/lib'))
});

gulp.task('img', function(){
    gulp.src(['src/client/site/img/*'])
        .pipe(gulp.dest('dist/public/site/img'));
   gulp.src(['src/client/site/img/bg/*'])
       .pipe(gulp.dest('dist/public/site/img/bg'));
    gulp.src(['src/client/admin/img/*'])
        .pipe(gulp.dest('dist/public/admin/img'));
    gulp.src(['src/client/site/img/bg/*'])
        .pipe(gulp.dest('dist/public/admin/img/bg'));

});

gulp.task('config', function(){
    gulp.src(['src/client/site/configuration/**/*.json'])
        .pipe(gulp.dest('dist/public/site/configuration'));

});

gulp.task('css', function(){
    gulp.src(['src/client/site/css/*'])
        .pipe(gulp.dest('dist/public/site/css'))
    gulp.src(['src/client/admin/css/*'])
        .pipe(gulp.dest('dist/public/admin/css'))
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
    gulp.src(['src/client/site/app/app.js',
        'src/client/site/router.js',
        'src/client/site/bfController.js',
        'src/client/site/models/*.js',
        'src/client/site/services/*/js',
        'src/client/site/app/**/*.js',
        'src/client/site/app/admin/**/*.js'])
        .pipe(plugins.concat('modules.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/site/js'));
    gulp.src(['src/client/admin/app/app.js',
        'src/client/admin/router.js',
        'src/client/admin/bfController.js',
        'src/client/admin/models/*.js',
        'src/client/admin/services/*/js',
        'src/client/admin/app/**/*.js',
        'src/client/admin/app/admin/**/*.js'])
        .pipe(plugins.concat('modules.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/admin/js'))
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

gulp.task('build', ['clean', 'html', 'modules', 'server', 'app', 'lib', 'css', 'img', 'config'], function(){
    if(server){
        server.stop();
    }
    else
    {
        server = gls.new('./dist/index.js');
    }
    gulp.run('webserver');

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

    return server.start();
/*    connect.server({
        root: ['dist'],
        port: 8000,
        base: 'http://localhost',
        livereload: true
    })*/
});

gulp.task('default', function(){
    gulp.run('build');
    gulp.watch(['./src/index.js', './src/client/site/app/**/*.js', './src/client/site/app/**/*.html','./src/client/admin/app/**/*.js','./src/client/site/app/**/*.html'], function(){
        gulp.run('build');
    })
});
