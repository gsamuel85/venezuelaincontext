'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    username: String,
    password: String,
    
    firstName: String,
    lastName: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);