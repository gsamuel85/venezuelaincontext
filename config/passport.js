'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
        profileFields: ["emails", "displayName", "name", "photos"]
    },
    function facebookStrategy(token, refreshToken, profile, done) {

        /**
         * Login with Facebook
         * 1. Already registered with Facebook: log in
         * 2. Registered with e-mail, no Facebook: add Facebook data to user, log in
         * 3. E-mail not registered: create new profile with Facebook data
         */
        process.nextTick(function facebookAuth() {      // Asynchronous
            var facebookEmail = profile.emails[0].value;

            User.findOne({'username': facebookEmail}, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // User found
                    // Is Facebook already part of their profile?
                    if (user.facebook && user.facebook.id === profile.id) {
                        // Facebook is already in their profile - log in
                        return done(null, user);
                    } else {
                        // If not, add Facebook data and log them in
                        user.facebook = {
                            id: profile.id,
                            token: token,
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            email: profile.emails[0].value,
                            photoUrl: profile.photos[0].value
                        };

                        user.save(function(err) {
                            if (err) {
                                throw(err);
                            }
                            return done(null, user);
                        });
                    }


                } else {
                    // No user found, create new user
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    newUser.facebook.photoUrl = profile.photos[0].value;

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


    /**
     * Google Auth Configuration
     */
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function googleStrategy(token, refreshToken, profile, done) {
        process.nextTick(function googleAuth() {
            var googleEmail = profile.emails[0].value;

            User.findOne({'username': googleEmail}, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // User found
                    // Is Google already part of their profile?
                    if (user.google && user.google.id === profile.id) {
                        // Google is already in their profile - log in
                        return done(null, user);
                    } else {
                        // If not, add Facebook data and log them in
                        user.google = {
                            id: profile.id,
                            token: token,
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            email: profile.emails[0].value
                        };

                        user.save(function(err) {
                            if (err) {
                                throw(err);
                            }
                            return done(null, user);
                        });
                    }


                } else {
                    // No user found, create new user
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.google.email = profile.emails[0].value;

                    // Copy to local User model
                    newUser.username = newUser.google.email;
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