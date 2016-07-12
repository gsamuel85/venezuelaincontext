'use strict';

module.exports = function(user, password) {
    return {
        dev: {
            url: 'mongodb://localhost:27017/vic'
        },
        prod: {
            url: "mongodb://" + user + 
            ":" + password + "@ds013898.mongolab.com:13898/venezuelaincontext?authSource=dbWithUserCredentials"
        }
    };
};