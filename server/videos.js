'use strict';

var router = require("express").Router();
var Video = require('../models/video');
var log = require("./logger");


router.get('/:id', function(req, res) {
    Video.findOne({ _id: req.params.id }, 'title description video_url', function(err, video) {
        if (err) { res.send('Video not found'); }
        else {
            var videoData = "var video_url = '" + video.video_url + "'";
            res.render('videos/video.html', {video: video, videoData: videoData});
        }
    });
});


module.exports = router;