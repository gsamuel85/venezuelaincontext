'use strict';

/**
 Configuration data for Social Authentication using Passport
 */

var baseURL = "http://localhost:3000";

switch (process.env.ENV) {
    case "production":
        baseURL = "http://www.venezuelaincontext.org";
        break;
    case "staging":
        baseURL = "https://vic-2016-gsamuel.c9users.io";
        break;
    default:
        baseURL = "http://localhost:3000";  
}

module.exports = {
    facebookAuth: {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: baseURL + "/auth/facebook/callback"
    },

    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: baseURL + "/auth/google/callback"
    },

    wordpressAuth: {
        clientID: process.env.WP_CLIENT_ID,
        clientSecret: process.env.WP_CLIENT_SECRET,
        callbackURL: baseURL + "/auth/wordpress/callback"
    }
};