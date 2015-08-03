module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      options: {
        browserifyOptions: {
         debug: true
        }
      },
      js: {
        options: {
          transform: [ 'babelify' ]
          // noParse: [ 'node_modules' ]
        },
        files: {
          'dist/main.js': 'src/main.js'
        }
      }
    },

    uglify: {
      js: {
        options: {
          sourceMap: true,
          beautify: false,
          compress: true,
          mangle: false
        },
        files: {
          'dist/main.min.js': [ 'dist/main.js' ]
        }
      }
    },

    watch: {
      js: {
        files: 'src/*.js',
        tasks: [ 'js' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('js', [ 'browserify' ] ); // , 'uglify'

  grunt.registerTask('default', [ 'watch' ] );
};
