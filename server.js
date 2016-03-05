'use strict';

// App modules
var express = require("express");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var bodyParser= require("body-parser");
var helmet = require("helmet");
var path = require("path");


// DB + User modules
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
var passport = require("passport");
var User = require('./models/user');
var LocalStrategy = require("passport-local").Strategy;



/**
 * Set up Express application
*/
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(helmet());              // Security by Helmet
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());        // Cookies for user sessions
app.use(flash());


// VIEWS: Hogan templating engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/client/views'));
app.set('layout', 'layout');
app.enable('view cache');
app.engine('html', require("hogan-express"));



/**
 * USERS: Passport + Sessions
 */
 
 // Connect to database
var dbConfig = require("./config/db")(process.env.DB_USER, process.env.DB_PASSWORD);
var dbUrl = (process.env.ENV === "production" ? dbConfig.prod.url : dbConfig.dev.url);
mongoose.connect(dbUrl);
 
// Session - place after static to avoid accessing store for every request
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var passportSocketIo = require("passport.socketio");
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: 'venezuela',
    store: sessionStore
}));

// Videos server module
var videos = require("./server/videos");
app.use('/video', videos);

// Users server module
var users = require("./server/users");
app.use(users);

// Sockets for comments
require("./server/comments-io")(io);
var comments = require("./server/comments");
app.use('/comments', comments);


// Serve home page and static content
app.get('/', function(req, res) {
    res.render('home.html', { 
        user: req.user
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
http.listen(process.env.PORT || 3000, function() {
    console.log('Server listening on port: %s', process.env.PORT);
});