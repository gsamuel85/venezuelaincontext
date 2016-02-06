'use strict';

var router = require("express").Router();
var async = require("async");

var Video = require('../models/video');
var log = require("./logger");

/**
 * Return JSON of all videos
 */ 
router.get('/all.json', function getVideos(req, res) {
    Video.find({}, '_id title', function foundVideos(err, videos) {
        if (err) { return res.send("Error: " + err); }
        
        res.send(videos);
    });
});


/**
 * Add a new video, or post an update to an existing video
 */ 
router.post('/update', function updateVideo(req, res) {
    var video = req.body;
    
    async.waterfall([
        function findVideo(cb) {
            Video.findOne({ _id: video._id}, cb);
        },
        function createOrUpdate(foundVideo, cb) {
            if (!foundVideo) {
                // Video doesn't exist in database, create new
                Video.create(video, cb);
            } else {
                // Update existing video
                Video.findByIdAndUpdate(video._id, {$set: video}, cb);
            }
        }
        ], function callback(err, savedVideo) {
            if (err) { return res.send("Error: " + err); }
            res.send("Video saved successfully: " + savedVideo._id);
        }
    );
});


/**
 * Create a new video
 */
router.get('/new', function(req, res) {
    res.render('videos/edit.html');
});    
    
/**
 * Load EDIT page for individual video
 */
router.get('/:id/edit', function editVideo(req, res) {
    Video.findOne({ _id: req.params.id }, 'title description video_url', function(err, video) {
        if (err) { return res.send("Error: " + err); }
        
        if (!video) { res.send('Video not found'); }
        else {
            var videoData = "var videoData = '" + JSON.stringify(video) + "'";
            res.render('videos/edit.html', {video: video, videoData: videoData});
        }
    });
});

/**
 * Display individual video
 */ 
router.get('/:id', function getVideo(req, res) {
    Video.findOne({ _id: req.params.id }, 'title description video_url', function(err, video) {
        if (err) { return res.send("Error: " + err); }
        
        if (!video) { res.send('Video not found'); }
        else {
            var videoData = "var video_url = '" + video.video_url +  "'\n" +
                "var nextVideoUrl = ''";        // TODO: Add funciton to get next video URL
            res.render('videos/video.html', {video: video, videoData: videoData});
        }
    });
});


module.exports = router;