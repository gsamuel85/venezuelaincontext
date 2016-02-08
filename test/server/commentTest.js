'use strict';

var assert = require("assert");
var async = require("async");
var mongoose = require("mongoose");
var VideoComment = require("../../models/videocomment");

var TEST_DB_URL = "mongodb://localhost:27017/test";

describe('Comment Model', function() {
    before (function(done) {
        mongoose.connect(TEST_DB_URL);
        done();
    });
    
    beforeEach(function(done) {
        var comment = new VideoComment({
            author: {
                name: "Guy",
                email: "guy@capitmobile.com"
            },
            video_id: 3,
            text: 'This is a comment'
        });
        
        comment.save(function(error, savedComment) {
            if (error) { console.log('error' + error.message); }
            else {
                console.log('no error');
            }
            done();
        });
    });
    
    it('should have a video_id', function(done) {
        async.series([
            function getInsertedComment(cb) {
                VideoComment.findOne({ 'author.name': "Guy" }, function(err, foundComment) {
                    assert(!err, 'no error retrieving comment');
                    assert.equal(foundComment.video_id, 3, "video_id should be 3");
                    cb();
                });
            },
            
            function insertWithoutId(cb) {
                var comment = new VideoComment({
                    author: {
                        name: "Guy",
                        email: "guy@capitmobile.com"
                    },
                    text: 'This is a comment without an id'
                });
                
                comment.save(function(err, savedComment) {
                    assert(err, "should not save comment without video_id");
                    cb();
                });
            }
        ], done);
    });
    
    it('can add replies to a comment');
    
    afterEach(function(done) {
        VideoComment.remove({}, function() {
            done();
        });
     });
     
     after(function closeDB(done) {
         mongoose.connection.close();
         done();
     });
});
