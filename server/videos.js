'use strict';

var router = require("express").Router();
var async = require("async");

var Video = require('../models/video');


function isAdmin(user) {
    if (user._doc) {
        return user._doc.admin;
    }
    return false;
}


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
    if (!isAdmin(req.user)) { return res.status(403).send("You must be an admin to add a video"); }
    
    res.render('videos/edit.html', { user: req.user });
});    
    
/**
 * Load EDIT page for individual video
 */
router.get('/:id/edit', function editVideo(req, res) {
    if (!isAdmin(req.user)) { return res.status(403).send("You must be an admin to edit a video"); }
    
    Video.findOne({ _id: req.params.id }, 'title description video_url', function(err, video) {
        if (err) { return res.send("Error: " + err); }
        
        if (!video) { res.send('Video not found'); }
        else {
            var videoData = "var videoData = '" + JSON.stringify(video) + "'";
            res.render('videos/edit', {video: video, videoData: videoData, user: req.user});
        }
    });
});



/**
 * GET JSON data for individual video
 */
router.get('/:id.json', function getVideoData(req,res) {
    Video.findOne({ _id: req.params.id }, '_id title video_url', function(err, video) {
        if (err) { return res.send("Error: " + err); }

        if (!video) { res.send('Video not found'); }
        else {
            res.send(video);
        }
    });
});

/**
 * SHOW individual video
 */ 
router.get('/:id', function getVideo(req, res) {
    Video.findOne({ _id: req.params.id }, '_id title subtitle description video_url', function(err, video) {
        if (err) { return res.send("Error: " + err); }
        
        if (!video) { res.send('Video not found'); }
        else {
            var nextVideoId = Math.min(video._id + 1, 12);
            var prevVideoId = Math.max(video._id - 1, 1);

            var videoData = "var video = '" + JSON.stringify(video) +  "';\n" +
                "var nextVideoId = " + nextVideoId + ";\n" +
                "var prevVideoId = " + prevVideoId + ";\n";
            res.render('videos/video', {
                video: video,
                videoData: videoData,
                user: req.user,
                partials: {
                    video_nav: 'partials/_video_nav',
                    comment: 'partials/_comment',
                    comment_form: 'partials/_comment_form'
                }
            });
        }
    });
});


module.exports = router;