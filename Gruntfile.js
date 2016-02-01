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
            serverdir: 'server'
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
                src: ["server.js", "<%= app.serverdir %>/**/*.js"]
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
                    '<%= app.srcdir %>/css/style.css': '<%= app.srcdir %>/css/*.scss'
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
        mochaTest: {
            options: {
                // TODO: add coverage reports
            },
            client: {
                src: ['test/<%= app.srcdir%>/**/*.js']
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
                tasks: ['jshint:client', 'mochaTest:client']
            },
            serverjs: {
                files: ["server.js", "<%= app.serverdir %>/**/*.js"],
                tasks: ['jshint:server', 'mochaTest:server']
            },
            commonjs: {
                files: ["<%= app.commondir %>/**/*.js"],
                tasks: ['jshint:common', 'mochaTest:common']
            },
            commonjsx: {
                files: ["<%= app.commondir %>/**/*.js"],
                tasks: ['jshint:common', 'mochaTest:common']
            },
            tests: {
                files: ["test/**/*.js"],
                tasks: ['jshint:tests', 'mochaTest']
            },
            browserify: {
                files: ['<%= app.commondir %>/main.js'],
                tasks: ['browserify']
            },
            json: {
                files: ['data/**/*.json'],
                tasks: ['jsonlint']
            },
            sass: {
                files: ['<%= app.srcdir %>/css/*.scss'],
                tasks: ['css']
            }
        }
    });
    
    
    grunt.registerTask('css', ['scsslint', 'sass', 'cssmin']);

    grunt.registerTask('default', ['htmlhint', 'jshint', 'mochaTest', 'jsonlint', 'css']);

    // TODO: Nodemon
    // TODO: Production files: minification, transfer to dist
};