'use strict';

var express = require("express");
var path = require("path");

var app = express();

// Set up Hogan templating engine via Consolidate
app.engine('html', require("consolidate").hogan);
app.set('views', path.join(__dirname, '/client/views'));

app.get('/', function(req, res) {
    res.render('index.html', {msg: "Hello, World!"});
});
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/client'));

var server = app.listen(process.env.PORT, function() {
    var port = server.address().port;
    
    console.log('Dashboard app listening on port: %s', port);
});