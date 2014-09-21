/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    bower: {
      install: {
        options:{
          //targetDir: 'static/bower_components',
          layout: 'byComponent',
          copy: false,
          //cleanTargetDir: true,
          //cleanBowerDir: true,
          verbose: true,
        }
      },
    },
    copy: {
      bowerFiles: {
        files:[
          // includes files within path and its sub-directories
          {expand: true, src: ['bower_components/**'], dest: 'static'},
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // Default task.
  grunt.registerTask('default', [
    'bower:install',
    'copy:bowerFiles',
  ]);
};