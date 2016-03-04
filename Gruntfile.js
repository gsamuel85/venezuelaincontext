'use strict';

module.exports = function(grunt) {
    // Load all grunt modules
    require('matchdep').filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // App variables
        app: {
            srcdir: 'client',
            commondir: 'common',
            distdir: 'public',
            serverdir: 'server',
            configdir: 'config'
        },


        /**************
         * HTML TASKS *
         **************/
        htmlhint: {
            build: {
                options: {
                    // HTML standards
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'tag-self-close': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'attr-no-duplication': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'id-class-value': 'dash',

                    // Performance & Accessibility
                    'head-script-disabled': true,
                    'alt-require': true,
                    'csslint': true,
                    'jshint': true
                },
                src: ['<%= app.srcdir %>/**/*.html']
            },
            index: {
                options: {
                    'doctype-first': true,
                    'doctype-html5': true,
                    'title-require': true
                },
                src: ['<%= app.srcdir %>/views/index.html']
            }
        },



        /************************
         * JavaScript+JSX TASKS *
         ************************/
        jshint: {
            options: {
                "browser": true,
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "globalstrict": true,
                "strict": false,
                "latedef": true,
                "undef": true,
                "devel": true
            },
            client: {
                src: ["<%= app.srcdir %>/**/*.js"]
            },
            common: {
                options: {
                    'node': true
                },
                src: ["<%= app.commondir %>/main.js"]
            },
            server: {
                options: {
                    'node': true
                },
                src: ["server.js", "<%= app.serverdir %>/**/*.js", "<%= app.configdir %>/**/*.js"]
            },
            tests: {
                options: {
                    "node": true,
                    "mocha": true
                },
                src: [  "test/<%= app.serverdir%>/**/*.js",
                        "test/<%= app.commondir%>/**/*.js",
                        "test/<%= app.srcdir%>/**/*.js"]
            }
        },
        browserify: {
            commonjs: {
                src: ['<%= app.commondir %>/**/*.js'],
                dest: '<%= app.distdir %>/js/bundle.js'
            }
        },
        jsonlint: {
            source: {
                src: ['data/**/*.json']
            }
        },




        /******************
         * SASS/CSS TASKS *
         ******************/
        scsslint: {
            source: {
                options: {
                    colorizeOutput: true,
                    config: '.scss-lint.yml'
                },
                src: ['<%= app.srcdir %>/css/*.scss']
            }
        },
        sass: {
            build: {
                files: {
                    '<%= app.srcdir %>/css/main.css': '<%= app.srcdir %>/css/*.scss'
                }
            }
        },
        cssmin: {
            source: {
                files: [{
                    expand: true,
                    cwd: '<%= app.srcdir %>/css',
                    src: '*.css',
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        },




        /****************
         * TESTING TASKS *
         *****************/
        jasmine: {
            client: {
                src: 'client/js/**/*.js',
                options: {
                    specs: "test/client/*.js",
                    vendor: [
                        'node_modules/angular/angular.js',
                        'node_modules/angular-mocks/angular-mocks.js',
                        'node_modules/angular-sanitize/angular-sanitize.js',
                        'public/js/popcorn-complete.min.js'
                        // Add vendor code if necessary
                    ]
                }
            }
        },
        mochaTest: {
            options: {
                // TODO: add coverage reports
            },
            common: {
                src: ['test/<%= app.commondir%>/**/*.js']
            },
            server: {
                src: ['test/<%= app.serverdir%>/**/*.js']
            }
        },



        /***************
         * WATCH TASKS *
         ***************/
        watch: {
            html: {
                files: ['<%= app.srcdir %>/**/*.html'],
                tasks: ['htmlhint']
            },
            clientjs: {
                files: ['<%= app.srcdir %>/js/**/*.js'],
                tasks: ['jshint:client', 'jasmine:client']
            },
            serverjs: {
                files: ["server.js", "<%= app.serverdir %>/**/*.js", "<%= app.configdir %>/**/*.js"],
                tasks: ['jshint:server', 'mochaTest:server']
            },
            commonjs: {
                files: ["<%= app.commondir %>/**/*.js"],
                tasks: ['jshint:common', 'mochaTest:common']
            },
            client_tests: {
                files: ['test/<%= app.srcdir%>/**/*.js'],
                tasks: ['jasmine:client']
            },
            tests: {
                files: ['test/<%= app.commondir%>/**/*.js', 'test/<%= app.serverdir%>/**/*.js'],
                tasks: ['jshint:tests', 'mochaTest']
            },
            browserify: {
                files: ['<%= app.commondir %>/main.js'],
                tasks: ['browserify']
            },
            //json: {
            //    files: ['data/**/*.json'],
            //    tasks: ['jsonlint']
            //},
            sass: {
                files: ['<%= app.srcdir %>/css/**/*.scss'],
                tasks: ['css']
            }
        }
    });
    
    
    grunt.registerTask('css', ['sass', 'cssmin']);

    grunt.registerTask('default', ['htmlhint', 'jshint', 'jasmine', 'mochaTest', 'jsonlint', 'css']);

    // TODO: Nodemon
    // TODO: Production files: minification, transfer to dist
};