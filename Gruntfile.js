module.exports = function (grunt) {

    grunt.initConfig({

        /*less: {
         compile: {
         options: {
         paths: ['less'],
         yuicompress: true
         },
         files: {
         'css/cv.css': 'less/cv.less'
         }
         }
         },
         copy: {
         bower: {
         files: [
         {expand: true, cwd: 'bower_components/jquery/', src: ['jquery.min.*'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/handlebars/', src: ['handlebars.min.js'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/ember/', src: ['ember.js'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/ember-data/', src: ['ember-data.js'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/bootstrap/dist/css/', src: ['bootstrap.css'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/moment/', src: ['moment.js'], dest: 'dist/libs/'},
         {expand: true, cwd: 'bower_components/moment/lang', src: ['fr.js'], dest: 'dist/libs/lang'}

         ]
         }
         },*/
        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'css/cv.css': 'scss/cv.scss'
                }
            }
        },
        watch: {
            all: {
                files: ['*.html', 'scss/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', ['build','watch']);

};