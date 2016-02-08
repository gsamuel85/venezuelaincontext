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
    
    it('can add replies to a comment', function(done) {
        async.waterfall([
            function getParentComment(cb) {
                VideoComment.findOne({ 'author.name': "Guy" }, cb);
            },
            function addReply(parentComment, cb) {
                var reply = new VideoComment({
                    author: {
                        name: "Bob",
                        email: "bob@capitmobile.com"
                    },
                    video_id: 3,
                    text: 'This is a reply',
                    path: "," + parentComment._id
                });
                
                reply.save(cb);
            },
            function checkReply(savedComment) {
                assert(savedComment.path, "path is not null");
                done();
            }
        ]);
    });
    
    it('should build a comment tree two levels deep', function(done) {
        async.waterfall([
            function getParentComment(cb) {
                VideoComment.findOne({ 'author.name': "Guy" }, cb);
            },
            function addReplies(parentComment, cb) {
                for (var i=0; i<5; i++) {
                    var reply = new VideoComment({
                        author: {
                            name: "Bob",
                            email: "bob@capitmobile.com"
                        },
                        video_id: 3,
                        text: "This is a reply " + i,
                        path: "," + parentComment._id.toString()
                    });
                    
                    reply.save();
                }
                
                cb(null, parentComment);
            },
            function buildReplyTree(root, cb) {
                var pathRegExp = new RegExp("^," + root._id.toString());
                
                VideoComment.find({path: pathRegExp}, function(err, comments) {
                    assert(!err, 'can retrieve replies with regexp');
                    assert.equal(comments.length, 5, 'should retrieve 5 comments');
                    done();
                });
            }
        ]);
    });
    
    
    
    
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
