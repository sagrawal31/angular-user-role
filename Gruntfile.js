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
                src: "<%=yeoman.dist %>/angular-roles.js",
                dest: "<%=yeoman.dist %>/angular-roles.min.js"
            }
        }
    }, grunt.registerTask("default", ["uglify"]));
};