'use strict';

var router = require("express").Router();
var passport = require("passport");
var User = require('../models/user');


router.get('/signup', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('users/signup.html', {});
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
        res.render('users/login.html', { flash: req.flash('error') });
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
 * Load Profile page with user details
 */
router.get('/profile', function(req, res) {
    // TODO: add authentication middleware
    
    if (!req.user) { return res.send("Please log in"); }
    
    User.findOne({ username: req.user.username }, function getProfile(err, foundUser) {
        if (err) { return res.send("Error: " + err); }
        
        if (!foundUser) { return res.send("User not found"); }
        res.render("users/profile.html", {msg: "Hello there!", user: foundUser._doc});
    });
});


module.exports = router;