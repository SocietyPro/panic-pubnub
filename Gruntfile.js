/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    watch: {
      
      jade: {
        files: ['jade/*'],
        tasks: ['jade:compile']
      },
      

      
    },
    bower: {
      install: {
        options:{
          targetDir: 'static/bower_components',
          layout: 'byComponent',
          //copy: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          verbose: true,
        }
      },
    },
    jade: {
      compile: {
        options: {client: false, pretty: true},
        data:{
          locals:{
            isTrusted: false,
            panicReceived: false,
          }
        },
        files: [
          {
            cwd: 'templates',
            src: '*.jade',
            dest: '../static',
            expand: true,
            ext: '.html'
          },
        ],
      },
    },
    sass: {
      compile: {
        options: {
          style: "expanded",
          pretty: true
        },
        files: [
          {
            cwd: 'sass',
            src: '*.sass',
            dest: '../static',
            expand: true,
            ext: '.css'
          },
        ],
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bower-task');
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  

  grunt.loadNpmTasks('grunt-contrib-jade');

  

  // Default task.
  grunt.registerTask('default', [
    'bower:install',
    //'jade:compile',

    
    //'watch:jade',
    

    
  
  ]);

};