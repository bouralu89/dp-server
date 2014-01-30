var express = require('express');

module.exports = function(app, passport) {

    app.configure(function() {
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
        app.use(express.bodyParser({
            keepExtensions: true
        }));
        
        app.use(express.methodOverride());
        app.use(app.router);
        app.set('views', __dirname + '/../app');
        app.engine('html', require('ejs').renderFile);
        app.use(express.static(__dirname + '/../app'));
    });

}
