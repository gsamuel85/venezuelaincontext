'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var WordpressStrategy = require('passport-wordpress').Strategy;

var User = require('../models/user');
var configAuth = require('../config/auth');



/**
 * Create the social data object for an existing user's profile from the Passport profile object
 * @param profile
 * @param token
 * @returns {{id: *, token: token, name: string, email: *, photoUrl: *}}
 */
var createUserSocialData = function createUserSocialData(profile, token) {
    return {
        id: profile.id,
        token: token,
        name: profile.name.givenName + ' ' + profile.name.familyName,
        email: profile.emails[0].value,
        photoUrl: profile.photos[0].value
    };
};

var createUserFromProfile = function(service, profile, token, done) {
    var newUser = new User();

    switch (service) {
        case 'facebook':
            newUser.facebook = createUserSocialData(profile, token);
            break;
        case 'google':
            newUser.google = createUserSocialData(profile, token);
            break;
        case 'wordpress':
        case 'google':
            newUser.wordpress = createUserSocialData(profile, token);
            break;
    }

    // Copy to local User model
    newUser.username = profile.emails[0].value;
    newUser.firstName = profile.name.givenName;
    newUser.lastName = profile.name.familyName;


    newUser.save(function(err) {
        if (err) {
            done(err);
        }
        done(null, newUser);
    });
};


var passportConfig = function passportConfig(passport) {
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
                if (err) { return done(err); }

                if (user) {
                    // User found
                    // Is Facebook already part of their profile?
                    if (user.facebook && user.facebook.id === profile.id) {
                        // Facebook is already in their profile - log in
                        return done(null, user);
                    } else {
                        // If not, add Facebook data and log them in
                        user.facebook = createUserSocialData(profile, token);

                        user.save(function(err) {
                            if (err) {
                                throw(err);
                            }
                            return done(null, user);
                        });
                    }
                } else {
                    // No user found, create new user
                    createUserFromProfile('facebook', profile, token, done);
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
                if (err) { return done(err); }

                if (user) {
                    // User found
                    // Is Google already part of their profile?
                    if (user.google && user.google.id === profile.id) {
                        // Google is already in their profile - log in
                        return done(null, user);
                    } else {
                        // If not, add Facebook data and log them in
                        user.google = createUserSocialData(profile, token);

                        user.save(function(err) {
                            if (err) {
                                throw(err);
                            }
                            return done(null, user);
                        });
                    }
                } else {
                    // No user found, create new user
                    createUserFromProfile('google', profile, token, done);
                }
            });
        });
    }));

    /**
     * WordPress Auth Configuration
     */
    passport.use(new WordpressStrategy({
            clientID: configAuth.wordpressAuth.clientID,
            clientSecret: configAuth.wordpressAuth.clientSecret,
            callbackURL: configAuth.wordpressAuth.callbackURL,
        },
        function wordpressStrategy(token, refreshToken, profile, done) {
            process.nextTick(function googleAuth() {
                var wordpressEmail = profile.emails[0].value;

                User.findOne({'username': wordpressEmail}, function(err, user) {
                    if (err) { return done(err); }

                    if (user) {
                        // User found
                        // Is WordPress already part of their profile?
                        if (user.wordpress && user.wordpress.id === profile.id) {
                            // Google is already in their profile - log in
                            return done(null, user);
                        } else {
                            // If not, add Facebook data and log them in
                            user.wordpress = createUserSocialData(profile, token);

                            user.save(function(err) {
                                if (err) {
                                    throw(err);
                                }
                                return done(null, user);
                            });
                        }
                    } else {
                        // No user found, create new user
                        createUserFromProfile('wordpress', profile, token, done);
                    }
                });
            });
        }));

};


module.exports = passportConfig;