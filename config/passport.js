'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('../config/auth');

var passportFacebookConfig = function passportFacebookConfig(passport) {
    // Serialization
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    /**
     * Local Auth Configuration
     */
    passport.use(new LocalStrategy(User.authenticate()));


    /**
     * Facebook Auth Configuration
     */
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ["emails", "displayName", "name"]
    },
    function facebookStrategy(token, refreshToken, profile, done) {

        process.nextTick(function facebookAuth() {      // Asynchoronous
            User.findOne({'facebook.id': profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // User found, log them in
                } else {
                    // No user found, create new user
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    // Copy to local User model
                    newUser.username = newUser.facebook.email;
                    newUser.firstName = profile.name.givenName;
                    newUser.lastName = profile.name.familyName;


                    newUser.save(function(err) {
                        if (err) {
                            throw(err);
                        }

                        done(null, newUser);
                    });
                }
            });
        });
    }));


};


module.exports = passportFacebookConfig;