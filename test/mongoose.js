'use strict';

var async = require("async");
var mongoose = require("mongoose");
var DB_URL = "mongodb://localhost:27017/vic";

var userSchema = mongoose.Schema( {
    local: {
        email: String,
        password: String
    }
});
userSchema.methods.hash = function(password) {
    return password + "HASH";
};
var User = mongoose.model('user', userSchema);


mongoose.connect(DB_URL);
var db = mongoose.connection;
db.once('open', function() {
    // Successfully connected to the database
    var guy = new User({
        "local.email": "guy@gmail.com",
        "local.password": "password"
    });
    
    async.series([
        function saveUser(cb) {
            guy.save(function(err, user) {
                if (err) { return console.error(err); }
                console.log("Saved user: " + user);
                cb();
            });
        },
        
        function getUsers(cb) {
            User.find({}, function(users) {
                console.log(users);
                cb();
            });
        }
    ], 
    function finish() {
        db.close();
    });
})