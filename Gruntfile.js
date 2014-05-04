module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			version: '0.0.5'
		},
		uglify: {
			default: {
				files: [{
					expand: true,
					cwd: 'chrome_extension_dist/static/js',
					src: '**/*.js',
					dest: 'chrome_extension_dist/static/js'
				}]
			}
		},
		copy: {
			default: {
				files: [
					// includes files within path and its sub-directories
					{expand: true, cwd: 'chrome_extension/chrome/', src: ['**'], dest: 'chrome_extension_dist/'},
				]
			}
		},
		removelogging: {
			default: {
				src: "chrome_extension_dist/static/js/*.js" // Each file will be overwritten with the output!
			}
		},
		clean: ["chrome_extension_dist/**"]
	});

	// Laoded tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task.
	grunt.registerTask('default', ['clean', 'copy', 'removelogging', 'uglify']);
};
