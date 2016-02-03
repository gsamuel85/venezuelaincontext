'use strict';

var router = require("express").Router();
var passport = require("passport");
var User = require('../models/user');


router.get('/signup', function(req, res) {
    res.render('users/signup.html', {});
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
                res.redirect('profile');
            });
        }
    );
});

router.get('/login', function(req, res) {
    res.render('users/login.html', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('profile');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/profile', function(req, res) {
    // TODO: add authentication middleware
    
    User.findOne({ username: req.user.username }, function(err, foundUser) {
        var user = err ? null : foundUser;
        res.render("users/profile.html", {msg: "Hello there!", user: user});
    });
});


module.exports = router;