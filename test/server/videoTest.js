'use strict';

var assert = require("assert");
var mongoose = require("mongoose");
var Video = require("../../models/video");

var TEST_DB_URL = "mongodb://localhost:27017/test";

describe('Video', function() {
    var id = 100;
    
    before (function(done) {
        mongoose.connect(TEST_DB_URL);
        done();
    });
    
    beforeEach(function(done) {
        var video = new Video({
            _id: id,
            title: 'Test Video',
            video_url: 'https://www.youtube.com/embed/9a_W7ckQ7AY',
            description: 'This is a description',
            theme: { prev: 1, next: 3},
            period: { prev: 4, next: 6},
        });
        
        video.save(function(error, savedVideo) {
            if (error) { console.log('error' + error.message); }
            else {
                console.log('no error');
                id = savedVideo._id;
            }
            done();
        });
    });
    
    it('should find a video by id', function(done) {
        Video.findOne({ _id: id }, function(err, video) {
            assert(!err, 'no error retrieving user');
            assert.equal(video.title, 'Test Video');
            done();
        });
    });
    
    afterEach(function(done) {
        Video.remove({}, function() {
            done();
        });
     });
     
     after(function closeDB(done) {
         mongoose.connection.close();
         done();
     });
});
