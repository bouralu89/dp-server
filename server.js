var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    config = require('./config/config');

var app = express();
var mongoUrl = process.env.MONGOLAB_URI || config.db;

//connect to database
mongoose.connect(mongoUrl);

//bootstrap model
require('require-all')(__dirname + '/model');

//passport config
require('./config/passport')(passport);

//express config
require('./config/express')(app, passport);

//setup routes
require('./config/routes')(passport, app);

//start app
var port = process.env.PORT || 3000;

app.listen(port);

console.log('Server running at port %s in %s mode.', port, app.settings.env);
