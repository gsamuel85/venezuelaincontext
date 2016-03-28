'use strict';

var mongoose = require('mongoose');
var gravatar = require('gravatar');

var User = new mongoose.Schema({
    username: String,
    password: String,
    
    firstName: String,
    lastName: String,
    
    admin: Boolean,
    blocked: Boolean,

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        photoUrl: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        photoUrl: String
    },
    wordpress: {
        id: String,
        token: String,
        email: String,
        name: String,
        photoUrl: String
    }
},
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    }
);

User.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

User.virtual('profileImageURL').get(function() {
    if (this.facebook.photoUrl) { return this.facebook.photoUrl; }
    if (this.google.photoUrl) { return this.google.photoUrl; }
    if (this.facebook.photoUrl) { return this.facebook.photoUrl; }

    // Nothing found? Try to get image from gravatar
    return gravatar.url(this.username, {s: 50}, true);
});

User.index({username: 1});

var passportLocalMongoose = require('passport-local-mongoose', {
    limitAttemtpts: true,
    maxAttempts: 50
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);