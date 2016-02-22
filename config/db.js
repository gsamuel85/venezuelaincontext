'use strict';

module.exports = {
    dev: {
        url: 'mongodb://localhost:27017/vic'
    },
    
    prod: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        url: "mongodb://" + this.user + 
            ":" + this.password + "@ds013898.mongolab.com:13898/venezuelaincontext"
    }
};