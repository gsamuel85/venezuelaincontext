'use strict';

var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: String,
    password: String,
    
    firstName: String,
    lastName: String,
    
    admin: Boolean,

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

User.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

User.index({username: 1});

var passportLocalMongoose = require('passport-local-mongoose', {
    limitAttemtpts: true,
    maxAttempts: 50
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);