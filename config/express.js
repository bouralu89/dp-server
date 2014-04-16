var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    multer = require('multer'),
    errorHandler = require('errorhandler');

module.exports = function(app, passport) {

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,PATCH,DELETE');
            res.header('Access-Control-Allow-Headers', "Content-Type,X-Requested-With,Authorization,Origin,Accept,Image");

            return res.send(200);
        }
        next();
    });
    app.use(passport.initialize());
    app.use(bodyParser({
        keepExtensions: true
    }));
    app.use(multer({
        dest: './upload/'
    }));
    app.use(methodOverride());
    //app.set('views', __dirname + '/../app');
    //app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/../app'));

    var env = process.env.NODE_ENV || 'development';

    if ('development' == env) {
        app.use(errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    }

    if ('production' == env) {
        app.use(errorHandler());
    }

}
