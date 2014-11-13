/*jslint browser: true, devel: true*/
/*global $, jQuery, alert, FastClick, Handlebars, require*/
var connect = require('connect'),
    serve_static = require('serve-static');

connect().use(serve_static('static')).listen(80);

