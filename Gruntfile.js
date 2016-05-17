/* global module:false */

"use strict";

var mountFolder;

mountFolder = function (connect, dir) {
    return connect["static"](require("path").resolve(dir));
};

module.exports = function (grunt) {
    var yeomanConfig;
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    yeomanConfig = {
        src: "src",
        dist: "dist"
    };
    return grunt.initConfig({
        yeoman: yeomanConfig,
        uglify: {
            build: {
                src: "<%=yeoman.src %>/angular-user-role.js",
                dest: "<%=yeoman.dist %>/angular-user-role.min.js"
            }
        },
        bump: {
            options: {
                files: ["package.json"],
                updateConfigs: [],
                commit: true,
                commitMessage: "Release v%VERSION%",
                commitFiles: ["package.json"],
                createTag: true,
                tagName: "v%VERSION%",
                tagMessage: "Version %VERSION%",
                push: true,
                pushTo: "upstream",
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
                globalReplace: false,
                prereleaseName: false,
                metadata: "",
                regExp: false
            }
        }
    }, grunt.registerTask("default", ["uglify"]));
};