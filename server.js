'use strict';

// New Relic monitoring - on production server only
if (process.env.ENV === "production") {
    require("newrelic");
}

var path = require("path");

// App modules
var express = require("express");
var compression = require("compression");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var bodyParser= require("body-parser");
var favicon = require("serve-favicon");
var helmet = require("helmet");         // Helmet security
var morgan =  require("morgan");        // Logging


// DB + User modules
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
var passport = require("passport");



/**
 * Set up Express application
*/
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

if (process.env.ENV !== "production") {
    // Debugging - Log all requests
    app.use(morgan('dev'));
}

app.use(helmet());              // Security by Helmet
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());        // Cookies for user sessions
app.use(flash());
app.use(favicon(path.join(__dirname + '/public/images/favicon.png')));



/**
 * Views - Use Hogan.js template engine
 */
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/client/views'));
app.set('layout', 'layout');
app.enable('view cache');
app.engine('hjs', require("hogan-express"));



/**
 * USERS: Passport + Sessions
 */
 
 // Connect to database
var dbConfig = require("./config/db")(process.env.DB_USER, process.env.DB_PASSWORD);
var dbUrl = (process.env.ENV === "production" ? dbConfig.prod.url : dbConfig.dev.url);
mongoose.connect(dbUrl);

app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

// Configure passport - in passport config
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Connect authentication data to socket.io
var passportSocketIo = require("passport.socketio");
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: process.env.COOKIE_KEY,
    store: sessionStore
}));




/**
 * ROUTES
 */

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

app.get('/contribute', function(req,res) {
    res.render('contribute.hjs', { user: req.user });
});

// Serve home page and static content
app.get('/', function(req, res) {
    res.render('home.hjs', {
        user: req.user
    });
});
app.use(express.static(path.join(__dirname + '/public')));
// app.use(express.static(path.join(__dirname + '/client')));





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
    next(err);
});




// Launch server
var server = http.listen(process.env.PORT || 3000, function() {
    console.log('Server running');
});