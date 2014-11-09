module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'src/<%= pkg.name %>.min.js': ['<%= jshint.files[1]%>']
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/backbone-hoodie.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },

    karma: {
      unit: {
        options: {
          configFile: 'karma.conf.js'
        }
      },
      unit_watch: {
        options: {
          configFile: 'karma.conf.js',
          autoWatch: true,
          singleRun: false
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('test:watch', ['karma:unit_watch']);

};
