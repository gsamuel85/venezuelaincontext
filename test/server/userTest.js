'use strict';

var assert = require("assert");
var mongoose = require("mongoose");
var User = require("../../models/user");

var TEST_DB_URL = "mongodb://localhost:27017/test";

describe('User', function() {
    before (function(done) {
        mongoose.connect(TEST_DB_URL);
        done();
    });
    
    beforeEach(function(done) {
        var user = new User({
            username: 'test@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Smith'
        });
        
        user.save(function(error) {
            if (error) { console.log('error' + error.message); }
            else { console.log('no error'); }
            done();
        });
    });
    
    it('should find a user by name', function(done) {
        User.findOne({ username: 'test@example.com' }, function(err, user) {
            assert(!err, 'no error retrieving user');
            assert.equal(user.username, 'test@example.com');
            assert.equal(user.firstName, 'John');
            done();
        });
    });
    
    it('should display a full name', function(done) {
        User.findOne({ username: 'test@example.com' }, function(err, user) {
            assert(!err, 'no error retrieving user');
            assert.equal(user.fullName, 'John Smith' );
            done();
        });
    });
    
    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
     });
     
     after(function closeDB(done) {
         mongoose.connection.close();
         done();
     });
});
