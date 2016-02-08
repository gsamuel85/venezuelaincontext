'use strict';

var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: String,
    password: String,
    
    firstName: String,
    lastName: String
});

User.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

User.index({username: 1});

var passportLocalMongoose = require('passport-local-mongoose');
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);