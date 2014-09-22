module.exports = function (grunt) {

    grunt.initConfig({

        less: {
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
        /*copy: {
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
        watch: {
            all: {
                files: ['*.html', './less/cv.less'],
                tasks: ['less:compile']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

};