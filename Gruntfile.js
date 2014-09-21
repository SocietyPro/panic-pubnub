/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    bower: {
      install: {
        options:{
          targetDir: 'static/bower_components',
          layout: 'byComponent',
          //copy: true,
          cleanTargetDir: true,
          cleanBowerDir: true,
          verbose: true,
        }
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bower-task');
  
  // Default task.
  grunt.registerTask('default', [
    'bower:install',
  ]);
};