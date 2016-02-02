'use strict';

var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var bodyParser= require("body-parser");
var helmet = require("helmet");

var mongoose = require("mongoose");

var bunyan = require("bunyan");
var log = bunyan.createLogger({
    name: 'ViC server',
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
    }
});


/**
 * Set up Express application
*/
var app = express();
app.use(helmet());              // Security by Helmet
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());        // Cookies for user sessions

app.use(require("express-session")({
    secret: "venezuela",        // TODO: store in environment
    resave: false,
    saveUninitialized: false
}));

/**
 * Passport + Users config
 */
var passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
var LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect to database
var DB_URL = "mongodb://localhost:27017/vic";
mongoose.connect(DB_URL);

// Users server module
var users = require("./server/users");
app.use('/user', users);



// Set up Hogan templating engine via Consolidate
app.engine('html', require("consolidate").hogan);
app.set('views', path.join(__dirname, '/client/views'));

// Serve home page and static content
app.get('/', function(req, res) {
    res.render('index.html', {msg: "Hello, World!"});
});
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/client')));



// Error handlers
// 404
app.use(function(req, res, next) {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});
// General error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("Error: " + err.message);
});

// Launch server
var server = app.listen(process.env.PORT, function() {
    var port = server.address().port;
    console.log('Dashboard app listening on port: %s', port);
});