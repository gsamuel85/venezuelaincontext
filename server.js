'use strict';

var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var bodyParser= require("body-parser");
var helmet = require("helmet");

var mongoose = require("mongoose");


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


// Set up Hogan templating engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/client/views'));
app.set('layout', 'layout');
app.enable('view cache');
app.engine('html', require("hogan-express"));



// Videos server module
var videos = require("./server/videos");
app.use('/video', videos);

// Users server module
var users = require("./server/users");
app.use(users);

// Serve home page and static content
app.get('/', function(req, res) {
    res.render('home.html', { 
        msg: "Hello, World!"
    });
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