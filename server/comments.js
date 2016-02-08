'use strict';

var router = require("express").Router();
var VideoComment = require("../models/videocomment");

router.get('/:video_id', function(req, res) {
    VideoComment.find({ 'video_id': req.params.video_id}).sort({'createdAt': 1}).
            exec(function(err, comments) {
        if (err) { return new Error(err); }
        
        // Return new comments as JSON;
        res.send(comments);
    });
});

module.exports = router;