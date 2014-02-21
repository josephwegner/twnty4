module.exports = function(grunt) {
 
    // Project configuration.
    grunt.initConfig({
 
        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),
 
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',
 
        // Task configuration.
        less: {
            development: {
                files: {
                    "public/style/style.css": "public/style/style.less"
                }
            }
        },
        concat: {
            dist: {
                src: ['public/js/main.js', 'public/js/*/**/*.js'],
                dest: 'public/js/main-min.js',
            }
        },
        watch: {
            connect: {
                options: {
                    livereload: true
                },
                files: [
                    'public/style/**/*.less'
                ],
                tasks: ['less'],
            }
        }
    });
 
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    // Default task.
    grunt.registerTask('default', ['watch']);
 
};