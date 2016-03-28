'use strict';

var router = require("express").Router();
var passport = require("passport");
var User = require('../models/user');
var gravatar = require('gravatar');

var access = require('../config/access');

/**
 * Helper method to get the user's profile image
 * @param user: User document from database
 * @returns String of URL to profile picture
 */
var getUserProfileImageURL = function getUserProfileImageURL(user) {
    if (user.facebook.photoUrl) { return user.facebook.photoUrl; }
    if (user.google.photoUrl) { return user.google.photoUrl; }
    if (user.facebook.photoUrl) { return user.facebook.photoUrl; }

    // Nothing found? Try to get image from gravatar
    return gravatar.url(user.username, {s: 50}, true);
};

router.get('/signup', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('users/signup.html', {partials: {
            social: 'partials/_social'
        }});
    }
});

router.post('/signup', function(req, res) {
    User.register(new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }), req.body.password, 
        function(err, user) {
            if (err) {
                res.render('users/signup.html', {flash: {msg: "Sorry, that e-mail address is already registered"}});
                return;
            }
            
            passport.authenticate('local')(req, res, function() {
                res.redirect('/profile');
            });
        }
    );
});

router.get('/login', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('users/login.html', { flash: req.flash('error'), partials: {
            social: 'partials/_social'
        } });
    }
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: "Incorrect e-mail or password"} ));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


/**
 * Facebook Auhentication
 */
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: "Unable to log in with Facebook"
    })
);

/**
 * Google Authentication
 */
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: "Unable to log in with Google"
    })
);

/**
 * WordPress Auhentication
 */
router.get('/auth/wordpress', passport.authenticate('wordpress', {scope: 'email'}));
router.get('/auth/wordpress/callback',
    passport.authenticate('wordpress', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: "Unable to log in with WordPress"
    })
);



/**
 * Load Profile page with user details
 */
router.get('/profile', access.isLoggedIn, function(req, res) {
    User.findOne({ username: req.user.username }, function getProfile(err, foundUser) {
        if (err) { return res.send("Error: " + err); }
        
        if (!foundUser) { return res.send("User not found"); }

        var user = foundUser._doc;
        user.profileImageURL = getUserProfileImageURL(user);
        res.render("users/profile.html", {msg: "Hello there!", user: user});
    });
});


/**
 * GET details of a user
 * Only the admin can view (and block) other users
 */
router.get('/user/:email', access.isLoggedIn, function(req,res) {
    if (!access.isAdmin(req.user)) { return res.status(403).send("You must be an admin to manage users"); }

    User.findOne({ username: req.params.email }, function getProfile(err, foundUser) {
        if (err) { return res.send("Error: " + err); }

        if (!foundUser) { return res.send("User not found"); }
        res.render("users/profile.html", {admin: true, user: foundUser._doc});
    });
});


module.exports = router;