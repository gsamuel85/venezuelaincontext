/**
 * Created by Guy on 27/3.
 */
'use strict';

module.exports = {
    /**
     * Middleware to ensure a user is logged in for selected functionalities
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    isLoggedIn: function isLoggedIn(req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send("Please log in");
    },


    /**
     * Check if currently logged in user is an admin
     * @param user: The req.user object
     * @returns {*}
     */
    isAdmin: function isAdmin(user) {
        if (user._doc) {
            return user._doc.admin;
        }
        return false;
    }
};