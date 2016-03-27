'use strict';

/**
 Configuration data for Social Authentication using Passport
 */

module.exports = {
    facebookAuth: {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },

    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },

    wordpressAuth: {
        clientID: process.env.WP_CLIENT_ID,
        clientSecret: process.env.WP_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/wordpress/callback"
    }
};