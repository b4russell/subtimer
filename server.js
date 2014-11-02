/*jslint browser: true, devel: true*/
/*global $, jQuery, alert, FastClick, Handlebars, require*/
//just serve static dir
var connect = require('connect'),
    serve_static = require('serve-static'),
    port = Number(process.env.PORT || 5000);
connect().use(serve_static('static')).listen(port);
